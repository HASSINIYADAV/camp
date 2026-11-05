
import os
from functools import wraps

from flask import Flask, g, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client
from postgrest import APIError
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Browser requests are limited to the configured frontend origins. Set
# FRONTEND_ORIGINS to a comma-separated list in the Render service settings.
frontend_origins = [
    origin.strip().rstrip("/")
    for origin in os.environ.get("FRONTEND_ORIGINS", "").split(",")
    if origin.strip()
]
CORS(
    app,
    resources={r"/api/*": {"origins": frontend_origins}},
    allow_headers=["Authorization", "Content-Type"],
    methods=["GET", "POST", "OPTIONS"],
)

# Supabase connection
supabase: Client = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_PUBLISHABLE_KEY")
)


# ----------------------------------
# Authentication helper
# ----------------------------------

def get_current_user():
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        return None

    token = auth_header.split(" ", 1)[1]

    try:
        response = supabase.auth.get_user(token)
        if response.user:
            # Use the signed-in user's JWT for RLS-protected table operations.
            user_supabase = create_client(
                os.environ.get("SUPABASE_URL"),
                os.environ.get("SUPABASE_PUBLISHABLE_KEY")
            )
            user_supabase.postgrest.auth(token)
            g.user_supabase = user_supabase
        return response.user
    except Exception:
        return None


def login_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user = get_current_user()

        if not user:
            return jsonify({
                "error": "Authentication required"
            }), 401

        return func(user, *args, **kwargs)

    return wrapper


# ----------------------------------
# Home route
# ----------------------------------

@app.route("/")
def index():
    return jsonify({
        "message": "Events API is running"
    })


# ----------------------------------
# 1. GET /api/events
# Browse all events
# ----------------------------------

@app.route("/api/events", methods=["GET"])
def get_events():
    try:
        response = supabase.table("events").select("*").execute()

        return jsonify(response.data), 200

    except APIError as error:
        return jsonify({
            "error": error.message
        }), 500


# ----------------------------------
# 2. GET /api/events/<id>
# Get event details
# ----------------------------------

@app.route("/api/events/<event_id>", methods=["GET"])
def get_event(event_id):
    try:
        response = (
            supabase.table("events")
            .select("*")
            .eq("event_id", event_id)
            .limit(1)
            .execute()
        )

        if not response.data:
            return jsonify({
                "error": "Event not found"
            }), 404

        return jsonify(response.data[0]), 200

    except APIError as error:
        return jsonify({
            "error": error.message
        }), 500


# ----------------------------------
# 3. POST /api/registrations
# Create event registration
# ----------------------------------

@app.route("/api/registrations", methods=["POST"])
@login_required
def create_registration(user):
    data = request.get_json(silent=True) or {}

    event_id = data.get("event_id")

    if not event_id:
        return jsonify({
            "error": "event_id is required"
        }), 400

    try:
        # Check whether event exists
        event = (
            supabase.table("events")
            .select("event_id")
            .eq("event_id", event_id)
            .limit(1)
            .execute()
        )

        if not event.data:
            return jsonify({
                "error": "Event not found"
            }), 404

        # Create registration
        response = (
            g.user_supabase.table("registrations")
            .insert({
                "event_id": event_id,
                "student_id": user.id
            })
            .execute()
        )

        return jsonify({
            "message": "Registration successful",
            "registration": response.data[0]
        }), 201

    except APIError as error:

        # Duplicate registration
        if error.code == "23505":
            return jsonify({
                "error": "You are already registered for this event"
            }), 409

        return jsonify({
            "error": error.message
        }), 500


# ----------------------------------
# 4. GET /api/me/registrations
# Get current user's registrations
# ----------------------------------

@app.route("/api/me/registrations", methods=["GET"])
@login_required
def get_my_registrations(user):
    try:
        response = (
            g.user_supabase.table("registrations")
            .select("*")
            .eq("student_id", user.id)
            .execute()
        )

        return jsonify(response.data), 200

    except APIError as error:
        return jsonify({
            "error": error.message
        }), 500


# ----------------------------------
# 5. GET /api/events/<id>/registrations
# Organizer-only attendee list
# ----------------------------------

@app.route(
    "/api/events/<event_id>/registrations",
    methods=["GET"]
)
@login_required
def get_event_registrations(user, event_id):
    try:
        # Find event and its organizer
        event = (
            supabase.table("events")
            .select("event_id, student_id")
            .eq("event_id", event_id)
            .limit(1)
            .execute()
        )

        if not event.data:
            return jsonify({
                "error": "Event not found"
            }), 404

        event_data = event.data[0]

        # Check organizer permission
        if str(event_data["student_id"]) != str(user.id):
            return jsonify({
                "error": "Only the event organizer can view attendees"
            }), 403

        # Get attendee registrations
        response = (
            supabase.table("registrations")
            .select("*")
            .eq("event_id", event_id)
            .execute()
        )

        return jsonify(response.data), 200

    except APIError as error:
        return jsonify({
            "error": error.message
        }), 500


# ----------------------------------
# Run Flask application
# ----------------------------------

if __name__ == "__main__":
    import os

    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 10000)),
        debug=False
    )

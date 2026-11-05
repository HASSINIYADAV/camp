# CampusConnect frontend

This is the production frontend folder for the Stitch screens in `../design/`. It connects the student flows supported by the existing Flask API: event discovery and details, Supabase email sign-in/sign-up, registration, and the signed-in user's registrations. Organizer event creation and organizer dashboard metrics need additional API endpoints and authorization rules, so those features are labelled as unavailable in the UI.

## Render Static Site

Create a **Static Site** from this repository and set:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Publish Directory: `dist`

Set these environment variables on the static site:

- `API_BASE_URL` = `https://camp-1-dufr.onrender.com`
- `SUPABASE_URL` = the Supabase project URL
- `SUPABASE_PUBLISHABLE_KEY` = the Supabase publishable/anon key (never use the service-role secret in browser code)

The build uses Node's built-in tools and does not need an `npm install` step or third-party build dependencies. It writes `config.js` to `dist` from the hosting environment, so Supabase values are not committed in this repository. Publish the site, copy its `https://...onrender.com` URL, then set that exact origin in the backend Render service as `FRONTEND_ORIGINS`. Include `http://localhost:5173` there too if using the local development server.

In Supabase Authentication → URL Configuration, add the deployed frontend origin to the allowed redirect URLs and set the Site URL to that origin. Email/password sign-up may require email confirmation based on the Supabase Auth settings.

## Local preview

For a production-like preview, set the three environment variables above and run `npm run build`, then serve the `dist` folder with any static file server. The browser will call the Render API by default if `API_BASE_URL` is omitted. Supabase credentials are required to sign in and register.


---
name: Campus Event Coordination System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434752'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737783'
  outline-variant: '#c3c6d4'
  surface-tint: '#275bb4'
  primary: '#2459b1'
  on-primary: '#ffffff'
  primary-container: '#4372cc'
  on-primary-container: '#fefcff'
  inverse-primary: '#aec6ff'
  secondary: '#595f65'
  on-secondary: '#ffffff'
  secondary-container: '#dee3ea'
  on-secondary-container: '#5f656b'
  tertiary: '#535c6d'
  on-tertiary: '#ffffff'
  tertiary-container: '#6c7587'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#aec6ff'
  on-primary-fixed: '#001a43'
  on-primary-fixed-variant: '#004397'
  secondary-fixed: '#dee3ea'
  secondary-fixed-dim: '#c2c7ce'
  on-secondary-fixed: '#171c21'
  on-secondary-fixed-variant: '#42474d'
  tertiary-fixed: '#dae3f7'
  tertiary-fixed-dim: '#bec7da'
  on-tertiary-fixed: '#131c2a'
  on-tertiary-fixed-variant: '#3e4757'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1rem
  label-lg:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system establishes a trustworthy, highly structured collegiate SaaS aesthetic. Built for student body leaders, faculty advisors, and university event coordinators, it projects academic authority balanced with contemporary student ease. The emotional objective is structural clarity: eliminating schedule friction, visual ambiguity, and organizational chaos across dense schedules and multi-hall campus logistics.

The aesthetic leans firmly into modern corporate collegiate utility. It employs clear containment lines, high-contrast text hierarchies, crisp structural boundaries, and soft atmospheric backdrops. Interfaces prioritize scanning speed and spatial order, letting dense agenda items, reservation states, and attendee metrics feel deliberate, dependable, and immediately manageable.

## Colors
The palette relies on a balanced academic triad anchored by purposeful functional contrasts:

- **Primary (`#4776D0`)**: Campus accent blue. Guides interaction, primary calls-to-action, calendar selection rings, and current state indicators.
- **Secondary (`#EEF3FA`)**: Soft collegiate ice blue. Defines structural grouping, subtle container backdrops, badge surfaces, and active navigation tiles.
- **Tertiary (`#202938`)**: Deep collegiate navy. Delivers commanding header typography, structural shell headers, and high-priority administrative badges.
- **Neutral (`#64748B`)**: Slate gray. Governs secondary descriptions, timestamp captions, subtle table dividers, and disabled metadata.

### Background & State Semantics
- **Canvas Base**: Pure white (`#FFFFFF`) with alternating structural page tiers set to soft cool gray (`#F8FAFC`).
- **Dividers & Borders**: Crisp slate hairline border (`#E2E8F0`).
- **Success (`#22A06B`)**: Attendance confirmations, room reservations approved, capacity targets met.
- **Warning (`#F59E0B`)**: Pending advisor review, near-capacity alerts, schedule collisions.
- **Critical (`#EF4444`)**: Canceled events, room double-bookings, required policy violations.

## Typography
Typographic rhythm is unified under the structural grotesque clarity of Inter. Line heights remain generous to ensure rapid scanning during calendar review and roster audits.

- **Headlines**: Rendered in weights 600 through 700 with gentle negative letter-spacing to enforce visual weight on academic titles and room identifiers.
- **Body**: Regular weight 400 with strict proportional leading. Never drops below `0.75rem` (`12px`) to ensure absolute readability on desktop split-screen views.
- **Labels & Metrics**: Rendered in weight 600 with positive tracking for tags, department badges, status pills, and calendar timestamp headers.

## Layout & Spacing
The layout operates on a desktop-first 12-column responsive grid structured around standard administrative desktop viewports (1440px target, 1280px minimum container, fluid down to mobile).

- **Grid Rhythms**: Desktop uses a 12-column fluid grid within a 1280px max-width container, featuring `2rem` outer margins and `1.5rem` gutters. Tablet adjusts to an 8-column layout with `1.5rem` margins. Mobile transitions to a single-column sequence with `1rem` margins and `1rem` gutters.
- **Section Spacing**: Layout divisions alternate using `2rem` to `3rem` vertical blocks. Card containers enforce an internal padding rhythm matching `space-md` (`1rem`) on compact summary modules and `space-lg` (`1.5rem`) on expanded booking panels.
- **Rhythm Standards**: Gaps between icon-label lockups resolve to `space-xs` (`0.25rem`) or `space-sm` (`0.5rem`). Complex metadata rows utilize `space-md` horizontal separation.

## Elevation & Depth
Depth is produced through subtle planar layering and soft architectural shadows rather than floating surfaces, maintaining an institutional, clean SaaS feel:

- **Surface Tiers**:
  - `Layer 0 (Canvas)`: Background canvas (`#FFFFFF` or `#F8FAFC`).
  - `Layer 1 (Cards & Workspaces)`: Pure white surfaces bound by a 1px border of `#E2E8F0`.
  - `Layer 2 (Overlays & Menus)`: Dropdown popovers, filter menus, and date pickers.
  - `Layer 3 (Modals)`: Centered event creation workflows and attendee check-in drawers.
- **Shadow Behavior**:
  - **Flat / Resting Card**: `0 1px 3px 0 rgba(32, 41, 56, 0.05), 0 1px 2px -1px rgba(32, 41, 56, 0.05)`.
  - **Card Hover / Elevated Panel**: `0 4px 6px -1px rgba(32, 41, 56, 0.07), 0 2px 4px -2px rgba(32, 41, 56, 0.05)`.
  - **Dropdown / Flyout Menu**: `0 10px 15px -3px rgba(32, 41, 56, 0.08), 0 4px 6px -4px rgba(32, 41, 56, 0.04)`.
  - **Modal Dialog**: `0 20px 25px -5px rgba(32, 41, 56, 0.12), 0 8px 10px -6px rgba(32, 41, 56, 0.04)`.
- **Outlines**: Every card and table container pairs with a hairline `#E2E8F0` border to preserve structure even under low-contrast display environments.

## Shapes
The shape language uses balanced rounded geometry (`roundedness: 2`). This grounds the interface in modern, accessible product design without appearing overly playful or toy-like:

- **Standard Elements (0.5rem / 8px)**: Inputs, buttons, list item highlights, tab indicators, table rows, and tooltips.
- **Containers & Panels (`rounded-lg` / 1rem / 16px)**: Calendar schedule cards, roster tables, navigation panels, filter groups, and notification trays.
- **Hero Modules (`rounded-xl` / 1.5rem / 24px)**: Featured campus announcement cards, registration banners, and event overview dialogs.
- **Pills / Badges (9999px)**: Category tags, capacity metrics, RSVP status chips, and avatar containers.

## Components

### Buttons
- **Primary**: Solid `#4776D0` fill, white Inter label (weight 600), `0.5rem` corner radius, `0.625rem 1.25rem` padding. Hover shifts to `#3662B5`. Active shifts to `#2E529A`.
- **Secondary**: `#EEF3FA` background with `#4776D0` text. Hover scales background to `#DFE9F6`.
- **Outline / Ghost**: 1px `#E2E8F0` border, `#202938` text, white background. Hover switches to `#F8FAFC`.

### Cards
- **Event Cards**: Background `#FFFFFF`, 1px solid border `#E2E8F0`, rounded to `rounded-xl` (`1.5rem`). Internal padding set to `1.5rem`. Top section hosts event banner or date square; middle holds title in `#202938`, room number, and host group; bottom features RSVP count and registration triggers.
- **Metric Cards**: Pure white background, `rounded-lg` (`1rem`), 1px `#E2E8F0` border, `1rem` internal padding, featuring large bold data figures paired with neutral caption text.

### Chips & Badges
- **Status Tags**: Rounded pill (`9999px`), `0.25rem 0.75rem` padding, font size `0.75rem` (weight 600).
  - *Confirmed / Open*: `#E8F8F0` background with `#22A06B` text.
  - *Waitlist / Full*: `#FEF3C7` background with `#B45309` text.
  - *Canceled*: `#FEE2E2` background with `#B91C1C` text.
  - *Department Category*: `#EEF3FA` background with `#4776D0` text.

### Form Inputs & Selects
- **Text Inputs**: Height `2.5rem`, `0.5rem` border radius, `#FFFFFF` background, 1px solid border `#CBD5E1`. Default text `#202938`, placeholder `#94A3B8`. Focus ring creates a crisp 2px glow of `#4776D0` with zero layout jump.
- **Checkboxes & Radios**: `1.125rem` square/circle, `#E2E8F0` stroke. Selected state applies `#4776D0` solid fill with crisp white vector checkmark.

### Calendar Day Columns & Timelines
- **Schedule Cells**: Clean vertical borders in `#E2E8F0`, headers set in `#F8FAFC`. Booked blocks display as rounded `0.5rem` cards nested within the grid using `#EEF3FA` backgrounds and a solid 3px left border accent in `#4776D0`.

### Iconography
- **Style**: Lucide-inspired line icons (24px or 20px grid, uniform 1.75px stroke width, rounded caps and joins). Color maps to parent text context or `#64748B` when acting as secondary metadata anchors (clock, map pin, user group).
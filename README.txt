MANA MOVEMENT TRAINING v4.3.2
PERMANENT WORKER DEPLOYMENT

- Permanent Worker target: calm-forest-aed7
- Permanent URL: https://calm-forest-aed7.lewisnorman19.workers.dev
- Includes wrangler.jsonc
- Includes package.json deploy commands
- Keeps future deployments on the same Worker
- v4.3.1 login/session and report-exit improvements retained
- No new Supabase SQL required

MANA MOVEMENT TRAINING v4.3.1
REPORT EXIT + STRONGER SESSION RESTORE

NEW:
- Standalone Client Progress Report now has a clear "Back to Mana Movement" button.
- Button returns focus to the original app tab and closes the report tab when Safari allows it.
- Fallback uses browser history if needed.
- Return button is hidden from the printed/PDF report.

LOGIN IMPROVEMENTS:
- Existing Supabase session is restored on app launch.
- If the access token needs refreshing, the app now attempts refreshSession automatically.
- INITIAL_SESSION / SIGNED_IN / TOKEN_REFRESHED auth events can reopen the correct coach/client screen automatically.
- Email/password AutoFill from v4.3 retained.
- Raw passwords are never stored by Mana Movement.

NO NEW SUPABASE SQL REQUIRED.

MANA MOVEMENT TRAINING v4.3
REMEMBER THIS DEVICE / SECURE LOGIN

NEW:
- Supabase sessions explicitly persist in browser localStorage.
- Session tokens auto-refresh so users stay signed in.
- App restores an existing session automatically on launch.
- Last-used email is remembered on the device.
- Raw passwords are NEVER saved by Mana Movement.
- Login fields now use Safari/iPhone AutoFill attributes:
  username + current-password.
- Signup/reset fields use new-password AutoFill attributes.
- Works with iCloud Keychain / Safari Password AutoFill.

IMPORTANT:
- Browser sessions are tied to the website origin.
- If every Cloudflare upload creates a brand-new workers.dev subdomain,
  Safari treats that as a different website. For seamless login across future
  upgrades, keep deploying to one stable Worker URL or connect a custom domain.

NO NEW SUPABASE SQL REQUIRED.

MANA MOVEMENT TRAINING v4.2.3
STANDALONE IPHONE PDF PRINT

MAJOR FIX:
- Stops printing the live app page entirely.
- Print / Save PDF now creates a separate clean document containing ONLY the Client Progress Report.
- This prevents Safari from adding hidden app screens, fixed navigation, or phantom pages.
- Compact A4 layout is embedded directly into the standalone print document.

EXPECTED:
- Current Tamara report should print as a clean single A4 page.
- Longer future reports will naturally flow onto additional A4 pages.

NOTE:
- Safari may require pop-ups to be allowed for this site the first time.
- No Supabase SQL changes required.

MANA MOVEMENT TRAINING v4.2.2
IPHONE PDF CONTENT RESTORE FIX

FIX:
- v4.2.1 successfully reduced the report to one page, but Safari print preview hid the report content.
- v4.2.2 removes the blanket body-child display:none rule.
- App screens/navigation are hidden explicitly instead.
- Client Report modal and all report descendants are forced visible in print.
- Compact one-page A4 layout retained.

EXPECTED:
- Tamara report should show as Page 1 of 1 with full report content visible.

NO NEW SQL REQUIRED.

MANA MOVEMENT TRAINING v4.2.1
IPHONE / SAFARI PDF BLANK PAGE FIX

FIX:
- iPhone print preview was still counting hidden app content, producing extra blank pages.
- During printing, all app content is now removed from print flow except Client Report.
- Report modal is changed to normal static print flow.
- Fixed/sticky/mobile viewport sizing is disabled during printing.
- Compact A4 report design from v4.2 retained.

EXPECTED RESULT:
- Tamara's current report should print as approximately 1 page, or a small number of pages
  when more notes/data are added, instead of 6 blank/extra pages.

NO NEW SQL REQUIRED.

MANA MOVEMENT TRAINING v4.2
COMPACT CLIENT REPORT PDF

NEW:
- Print/PDF layout tightened for A4.
- Mobile/app layout unchanged.
- Reduced print spacing, heading size, card padding and excessive inherited heights.
- Summary metrics remain four across on A4.
- Strength/check-in cards use a compact two-column print layout.
- Key blocks avoid awkward page breaks.
- Target: approximately 2–3 pages instead of 7 for a normal client report.

NO NEW SQL REQUIRED.

MANA MOVEMENT TRAINING v4.1
CLIENT REPORT VIEW

NEW:
- Coach > Client Detail includes Open client report.
- Report combines days complete, habit adherence, strength sessions, average load change,
  strength highlights, latest check-in and the existing cloud coach note.
- Print / Save PDF button opens the browser print dialog with an A4-friendly report layout.
- Uses existing Supabase data. No new SQL required.

MANA MOVEMENT TRAINING v4.0
COACH SUMMARY DASHBOARD

NEW:
- Coach > Client Detail now includes a Coach Summary card above Strength Progression.
- Strongest improvement identifies the lift with the biggest kg increase.
- Most consistent lift identifies the repeated lift with the smallest average change between logged sessions.
- Strength sessions counts unique strength days with logged loads.
- Average load change shows the mean kg change across repeated lifts.
- Summary updates automatically from existing exercise_logs data.

Existing v3.9 trend graphs and strength progression remain unchanged.

NO NEW SQL REQUIRED.

MANA MOVEMENT TRAINING v3.9
COACH STRENGTH TREND GRAPHS

NEW:
- Each exercise in Coach > Client Detail > Strength progression now includes a compact trend line.
- Trend uses the client's logged weights across MANA 28 days.
- Multiple logs show a gold line with points.
- A single log shows one gold point without implying a trend.
- Existing progression cards, latest weight, session count and kg change remain unchanged.

NO NEW SQL REQUIRED.

MANA MOVEMENT TRAINING v3.8
COACH STRENGTH PROGRESSION

NEW:
- Coach > Client Detail now groups strength logs by exercise.
- Each exercise shows latest weight, total logged sessions and progression change.
- Horizontal history chips show Day + Weight, e.g. Day 1 15 kg → Day 8 17.5 kg → Day 15 20 kg.
- Existing client strength logging and Supabase table remain unchanged.

NO NEW SQL REQUIRED.

MANA MOVEMENT TRAINING v3.7.2
VERIFIED SMART STRENGTH FIELDS

Fixed and verified in the actual HTML:
- Plank, side plank, bird dog, dead bug and similar bodyweight/core moves show NO kg field.
- Push-up or chest press shows Load used (optional), which works for either exercise choice.
- Normal weighted lifts show Weight used.
- Existing Supabase strength logging remains unchanged.
- No new SQL required.

MANA MOVEMENT TRAINING v3.7.1
SMART STRENGTH LOGGING

Refined:
- Weighted lifts keep Weight used (kg).
- Plank, side plank, bird dog and similar bodyweight/timed/core movements do not show a kg field.
- Push-ups show Added weight (optional).
- Existing Supabase exercise_logs table remains unchanged.
- Existing saved strength logs and Coach visibility are unchanged.

NO NEW SQL REQUIRED.

MANA MOVEMENT TRAINING v3.7
STRENGTH LOGGING

NEW:
- Strength days show a Weight used (kg) field under every exercise.
- Clients can enter values such as 15, 17.5, 20 kg.
- Save Weights stores the values in Supabase.
- Saved values reload when the client opens that workout again.
- Mark Day Complete also saves any entered weights automatically.
- Coach Client Detail now includes a live Strength Logs section.

IMPORTANT:
1. Run v3_7_strength_logging.sql ONCE in Supabase SQL Editor.
2. Then deploy this ZIP to Cloudflare.
3. Update Supabase Site URL + Redirect URL to the new workers.dev address.

MANA MOVEMENT TRAINING v3.6.4
SOFTER CURRENT-DAY HIGHLIGHT

Refined:
- Current day still clearly marked Today.
- Softer gold tint for a cleaner premium look.
- Thinner left gold accent.
- Subtle gold border around the current-day row.
- Completed and future day states unchanged.

No SQL or Supabase changes required.

MANA MOVEMENT TRAINING v3.6.3
CURRENT DAY HIGHLIGHT

New:
- Completed days remain marked Complete ✓.
- The current MANA 28 day is highlighted in gold and labelled Today.
- Future days show Tap to open.
- After completing a day, the Programs list refreshes and highlights the next day automatically.

No SQL changes required.

MANA MOVEMENT TRAINING v3.6.2
DAY PANEL BUTTON DISPLAY FIX

Fixed:
- Interactive day panel now sits above the fixed bottom navigation.
- Bottom navigation is hidden while the day panel is open.
- Mark day complete button is fully visible and tappable on iPhone.
- Added safe-area spacing for iPhone browser/home indicator.

Unchanged:
- Supabase live progress sync
- Program day details
- Coach dashboard
- Client Home/Fuel/Progress/Profile
- No SQL changes required.

MANA MOVEMENT TRAINING v3.6.1
INTERACTIVE PROGRAM TAP + LIVE SYNC FIX

Fixed:
- Every MANA 28 Program day is now an explicit tappable button.
- Tapping a day opens the workout/recovery detail panel.
- Completed days show Complete ✓.
- Upcoming days show Tap to open.
- Mark day complete writes directly to the existing Supabase day_progress table.
- Home, Progress and Coach data refresh after completion.

No SQL or Supabase configuration changes required.

MANA MOVEMENT TRAINING v3.6
INTERACTIVE MANA 28 PROGRAM

New:
- Clients can tap each MANA 28 day from Programs.
- Opens a full day-detail panel with workout/recovery instructions.
- Includes exercise sets/reps or recovery tasks.
- Adds a Mark day complete action.
- Keeps existing login, coach dashboard, client Home, Fuel, Progress and Profile.

Important:
- No new SQL is required for this build.
- Existing cloud completion hooks are used when present.
- A local completion fallback is included so the interaction still works safely.

MANA MOVEMENT TRAINING v3.5.2
CLIENT TAB TOP-SPACE FIX

Fixed:
- Removed the full-screen empty gap above Programs, Fuel, Progress and Profile.
- Client tab content now sits inside the main Mana Movement app wrapper.
- Keeps normal safe-area spacing on iPhone.

Unchanged:
- Supabase authentication
- Lewis coach dashboard
- Client Home
- MANA 28 progress data
- Check-ins, habits and coach data
- No SQL changes required

V3.5.1 CLIENT TAB DISPLAY FIX

Fix:
- Programs, Fuel, Progress and Profile client views are now inside the main app wrapper.
- Fixes blank client tabs on iPhone/mobile Safari.

Unchanged:
- Supabase login/auth
- Coach dashboard
- Client Home
- Check-in requests
- Existing cloud data
- No new SQL required

V3.5 CLIENT SUITE - SINGLE DEPLOY BUILD
Built from login-stable v3.3.1.
Coach side remains unchanged.

CLIENT:
- Home stays on proven stable v3.3.1 implementation
- Programs tab
- Fuel tab
- Progress tab
- Profile tab
- Forgot password
- Reset password handling
- Existing coach check-in request banner retained

PROGRESS:
- Days complete
- Habit adherence
- Weight trend
- Energy trend
- Workout history

No new SQL required.

V3.3.1 LOGIN STABILITY FIX
- Rebuilt directly from known-good v3.2
- Leaves working Supabase login/authentication code untouched
- Keeps Coach Insights
- Adds client check-in request banner
- Client check-in completes outstanding coach request
- Larger client navigation upgrade will be reintroduced incrementally after login test

V3.2 COACH INSIGHTS
- Weight trend chart
- Energy trend chart
- Workout completion history
- Habit adherence history
- Cloud-saved coach notes
- Request client check-in action
- Includes v3_2_database_upgrade.sql (run once in Supabase before use)

V3.1 CLIENT DETAIL PAGE STRUCTURE FIX
- Rebuilt from known-good v2.9 base
- Fixed blank coach screen caused by misplaced detail section
- Tap Tamara/Nicole to open client details
- Current day, completed days, habits, check-ins
- Latest check-in and history
- Coach notes
- Back button returns to live coach dashboard

V2.9 CLIENT LIST DISPLAY FIX
- Fixed client-name rendering crash in Coach Dashboard
- Supabase was already returning client rows correctly
- Active Clients list now renders returned names, current day, days complete and habits
- Error display also fixed

V2.8 TOUCH / NAVIGATION FIX
- Restored missing bottom-navigation click handlers
- Coach Home / Programs / Fuel / Progress / Profile now switch screens
- Profile logout works
- Raises nav z-index and tap targets for iPhone
- Adds visual tap feedback
- Keeps Supabase cloud and coach dashboard connection

V2.7 BRAND / LOGIN CLEANUP
- Removed prototype Preview as Client button
- Removed prototype Preview Lewis Coach Dashboard button
- Removed outdated Supabase-ready notice
- Login button now says Log in to Mana Movement
- Clarifies MANA 28 is a program inside Mana Movement Training
- Keeps Supabase connected backend and coach RPC

V2.6 RPC COACH DASHBOARD
- Coach dashboard now uses one secure Supabase RPC function
- Avoids multi-table browser RLS query problems
- 8-second timeout with visible error
- Requires running coach_dashboard_rpc.sql once in Supabase SQL Editor

V2.5 CLOUD DIAGNOSTIC FIX
- Coach client list now uses direct Supabase REST request
- 8-second timeout prevents endless Loading state
- Shows exact Supabase/RLS/API error on screen
- Uses logged-in coach access token
- Real profiles load before optional progress/habit data

V2.4 COACH DATA FIX
- Removed hard-coded 3 clients / 82% from coach dashboard
- Coach dashboard now starts at 0 / 0%
- Loads Supabase client profiles first
- Progress and habits load separately, so one permission/query error cannot freeze the client list
- Displays real client names as soon as profiles load
- Shows readable Supabase error inside dashboard if profile access fails

FIX 3 / V2.3
- Disabled service-worker caching during beta testing
- Forces old Mana caches/service workers to clear
- Removed demo client UI
- Added working coach bottom navigation
- Added Home / Programs / Fuel / Progress / Profile coach screens
- Added real logout button
- Added no-cache Netlify headers

FIX 2: Removed all prototype/demo client rows from Coach Dashboard.

MANA MOVEMENT TRAINING — CONNECTED TEST BUILD

Connected to Supabase for real authentication and cloud data.

Includes:
- Real email/password login
- Client signup and email confirmation
- Coach role lookup from profiles table
- Cloud day progress
- Cloud daily habits
- Cloud check-ins
- Coach dashboard reading live client data
- Session restore
- Installable PWA with Mana M icon

DEPLOYMENT
Upload this as a NEW Netlify test site. Do not replace your live MANA 28 v1 yet. Test the Lewis coach login first, then make one test client account and verify cloud saving.

SECURITY
Only a Supabase publishable browser key is included. Never add the service_role key or database password to the app files.

FIX1: Coach Active Clients card now renders live Supabase data; demo client rows removed; cache bumped.

# Landing page message and local development

ArticulateX offers public speaking courses, individual coaching and team workshops for leaders, founders and professionals. The landing page should explain the service before asking visitors to explore it.

The first viewport names the service in its main headline: “Public speaking coaching.” The eyebrow lists courses, individual coaching and team workshops, followed by the audience and session format. The primary hero link leads to courses.

The main message is: bring a real pitch, presentation or speaking challenge, practise it, receive feedback and improve delivery. The entry offer is the existing free one-day demo class. Course formats and availability should be confirmed in the inquiry rather than presenting unverified durations.

The existing sections, typography, colours, animation and layout are preserved. Illustrative testimonials have been replaced with practice scenarios, so the page does not imply they are verified customer endorsements.

## Local database

Development uses `mongodb://127.0.0.1:27017/articulatex` when MONGODB_URI is absent. An explicitly configured URI takes precedence. Production still requires MONGODB_URI and retains the Vercel configuration. No environment file was created or downloaded.

Start the local MongoDB service with `brew services start mongodb-community@8.0`, then run `pnpm dev`. Stop the service with `brew services stop mongodb-community@8.0` when no longer needed.

## Motion and globe section

The hero uses a two-line headline and smaller typography so its actions remain visible. Two aircraft tow SVG message banners. The globe appears in its own section after the ticker, accompanied by speaking-focused copy and a course link.

The globe component is sourced from Aceternity UI: https://ui.aceternity.com/components/3d-globe and https://ui.aceternity.com/registry/3d-globe.json. Earth textures are vendored locally from three-globe 2.31.0 example images (earth-blue-marble.jpg and earth-topology.png). SVG orbit accents and aircraft banners are custom. Native reduced-motion preferences disable flight, banner and orbit animation and globe auto-rotation.

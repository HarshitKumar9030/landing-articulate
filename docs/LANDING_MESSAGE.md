# Landing page message and local development

ArticulateX offers public speaking courses, individual coaching and team workshops for leaders, founders and professionals. The landing page should explain the service before asking visitors to explore it.

The first viewport names the service in its main headline: “Public speaking coaching.” The eyebrow lists courses, individual coaching and team workshops, followed by the audience and session format. The primary hero link leads to courses.

The main message is: bring a real pitch, presentation or speaking challenge, practise it, receive feedback and improve delivery. The entry offer is the existing free one-day demo class. Course formats and availability should be confirmed in the inquiry rather than presenting unverified durations.

The existing sections, typography, colours, animation and layout are preserved. Illustrative testimonials have been replaced with practice scenarios, so the page does not imply they are verified customer endorsements.

## Local database

Development uses `mongodb://127.0.0.1:27017/articulatex` when MONGODB_URI is absent. An explicitly configured URI takes precedence. Production still requires MONGODB_URI and retains the Vercel configuration. No environment file was created or downloaded.

Start the local MongoDB service with `brew services start mongodb-community@8.0`, then run `pnpm dev`. Stop the service with `brew services stop mongodb-community@8.0` when no longer needed.

## Motion and official Aceternity components

The hero keeps the business headline on two lines, using one consistent sans-serif font, with a colour accent for coaching. Spacing is reduced around the service label and the headline uses a more open line height. Aceternity's Text Generate Effect reveals the short service label; the description remains immediately readable. Custom aircraft tow SVG message banners.

A separate open editorial section uses Aceternity's GitHub Globe with dotted country polygons, animated arcs and rings. Typography, annotation colours and globe lighting follow the selected palette. Routes are illustrative connections, not claims about customer locations. The globe never appears inside the hero.

Sources:
- https://ui.aceternity.com/components/github-globe
- https://ui.aceternity.com/registry/globe.json
- https://assets.aceternity.com/globe.json
- https://ui.aceternity.com/registry/text-generate-effect.json

The copied components are adapted for the existing palette, React 19 ref types and reduced motion. The stable installed React Three Fiber version is retained rather than adopting the registry's alpha dependency. Reduced motion disables globe rotation and routes and makes the service text reveal immediate.

## Globe sizing

The globe stays inside a square responsive frame. React Three Fiber owns renderer sizing and the perspective camera aspect ratio. Do not reintroduce a fixed camera aspect or manual renderer setSize calls: these distorted the sphere after theme-triggered rerenders. Camera and fog objects are no longer reconstructed during rendering.

## Visual consistency

The global reach section follows Focus Areas and Method: the same horizontal gutters and vertical spacing, rounded eyebrow label, large sans-serif heading with muted accent text, restrained body width, soft 3% ink surface, 2rem stage corners and pill CTA. Technical coordinates and the extra numbered outcome row were removed. The responsive square globe frame and renderer-managed camera aspect are retained.

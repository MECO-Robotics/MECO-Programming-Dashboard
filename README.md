# MECO Programming Dashboard

An outreach exhibit for FRC Team 8324 MECO Robotics: explore our GitHub projects, try small interactive activities, or run a rotating showcase on a monitor. Built with vanilla JavaScript, CSS, and Vite. No backend, account, API key, or live robot connection is required.

## Run locally

Use Node.js 22.12+ (Node 24 recommended).

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite (normally http://127.0.0.1:5173). Keep the terminal running while using the exhibit.

## At an outreach event

- **Explore:** select a project card. Each project has a plain-language “The big idea” explanation and an “Under the hood” explanation for visitors interested in the technology.
- **Try it:** sequence a scoring cycle, count practice scores, complete a readiness checklist, or select an illustrated autonomous route. All activity state resets when reopening a project; nothing is uploaded or saved.
- **Showcase:** select “Start showcase” to switch to a larger monitor layout and slide through all five projects every 10 seconds in a revolving carousel. The last project slides forward into the first, and previous navigation wraps in reverse. Use the dots, previous/next arrows, or a horizontal touch swipe to select a project. Reduced-motion preferences disable the sliding animation. “Pause showcase” or Escape returns to the normal layout. Opening an activity stops the showcase. Rotation pauses while the browser tab is hidden or keyboard focus is inside the featured slide.
- **Full screen:** select “Full screen.” Browser support and permissions may vary; the browser’s own full-screen command also works.
- **Keyboard:** Tab navigates controls; Enter/Space activates buttons. Escape closes the project dialog and stops the showcase. Left/Right changes the featured project when focus is outside a button, link, input, or dialog.
- The exhibit supports landscape, portrait, and small screens, keyboard focus indicators, native modal focus containment, and reduced-motion preferences.

Install dependencies before traveling. Once the local server is running, the dashboard, bundled images, and activities work without internet. GitHub, the team website, and the external QRScout app require internet. This is not a service-worker-cached offline website; hosted copies still need a connection to load initially.

The “From East Orlando to the competition field” link opens the team website (replacing the former “Meet the team” navigation item). Project website buttons appear on the carousel, project cards, and project dialogs. Available destinations include Remy's season page and 3D viewer, QRScout and its legacy preview, FieldScout downloads, Mission Control at `https://meco-pm.duckdns.org/`, and the AutoDrive training monitor. The AutoDrive monitor is labeled **team network** because its `100.121.248.52:8765` address requires access to that network; it is not a public website. Website links open in a new tab. 16th Note has no configured website.

## Featured projects

| Area | Main repository | Related repositories |
| --- | --- | --- |
| Remy | [2026-Rebuilt](https://github.com/MECO-Robotics/2026-Rebuilt) | — |
| Scouting | [FieldScout](https://github.com/MECO-Robotics/FieldScout) | QRScout_MECO, QRScout-Legacy, QRScout-app- |
| 16th Note | [16th_Note](https://github.com/MECO-Robotics/16th_Note) | — |
| Mission Control | [meco-mission-control-web](https://github.com/MECO-Robotics/meco-mission-control-web) | meco-mission-control-mobile, meco-mission-control-platform |
| AutoDrive | [AutoDrive](https://github.com/MECO-Robotics/AutoDrive) | — |

Content was checked against the public repository READMEs on October 22, 2026. Mission Control is explicitly labeled as a prototype. The mini activities, field paths, chart data, and planning board are educational illustrations, not embedded production applications or live telemetry. AutoDrive's actual training uses PPO defense and AD* route planning; the exhibit does not execute that engine.

## Editing the exhibit

- `src/projects.js`: project titles, categories, repository links, `websites` button labels/URLs, explanations, and accent colors.
- `src/main.js`: rendering, project visuals, demos, showcase timing, and controls.
- `src/style.css`: MECO theme, responsive layouts, and monitor mode.
- `public/assets/`: locally bundled team logo and robot photos.

When adding a project, add its content to `projects.js` and provide an appropriate visual/activity in `main.js`. Update the five-project labels and counters in `main.js` as needed. There is no GitHub API dependency: descriptions and repository links are curated, rather than fetched at runtime.

## Verify and build

```sh
npm test
npm run build
npm run preview
```

Tests run the actual application source in jsdom and cover filters, scoring feedback/reset, technical explanations, the scouting counter, showcase timing/wrap/pause, carousel direction and inactive-slide accessibility, focus preservation, checklists, and route controls. jsdom stubs the browser's dialog/full-screen-adjacent environment; visual layout and native interactions need browser review.

`npm run build` creates `dist/`. The relative Vite base supports static hosting at either a domain root or a repository subpath such as GitHub Pages. Publish the contents of `dist/` through your chosen host. No hosting account or deployment has been configured by this project.

## Branding and asset credits

- Official colors from MECO Mission Control: blue `#16478e`, red `#ea1c2d`; the exhibit adds a dark navy background and project accents.
- `public/assets/meco-logo.svg`: MECO's white logo, sourced from the existing Mission Control web repository's `public/meco-main-logo-white.svg`.
- `public/assets/remy.jpg`: Remy photograph from [MECO's 2026 REBUILT page](https://www.mecorobotics.org/frc/2026-rebuilt). Team branding and photography remain the property of their respective owners.
- Team background: [MECO Robotics](https://www.mecorobotics.org/).

16th Note displays `public/assets/16th-note-4k.png` (3840 × 3280 pixels). The original 192 × 164 screenshot remains unchanged at `public/assets/16th-note-original.png`. The display asset was conservatively restored with built-in imagegen, then resized to a 3840-pixel long edge. It remains soft: an upscale cannot recover missing source detail. CSS fades its edges into the navy background and applies a small contrast adjustment. Display width remains capped at 384px to avoid excessive enlargement. The drivetrain icon remains; there are no music-note graphics.

### Image restoration prompt

> Conservative restoration/upscale ONLY of this exact photograph. Output 3840x3280 pixels (same 192:164 aspect ratio, 4K long edge). Absolutely preserve original pixel composition, camera perspective, exact robot silhouette, tiny robot dimensions, all visible component positions, red bumper number 9924, gray floor, blue background bins, and original framing. Do not redesign, relight, replace background, add components, extrapolate plausible sharp mechanical details, or change shapes. A previous attempt invented a different robot and was rejected. This should look exactly like the attached screenshot but resampled with very gentle noise reduction and conservative sharpening. Keep naturally soft areas soft wherever detail cannot be recovered. No text additions. Preserve the source's appearance and robot identity over sharpness.

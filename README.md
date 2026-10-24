# MECO Programming Dashboard

This outreach exhibit for FRC Team 8324 MECO Robotics lets visitors explore our GitHub projects, try small interactive activities, and browse a manual project carousel on a monitor. It is built with vanilla JavaScript, CSS, and Vite. No backend, account, API key, or live robot connection is required.

## Open the dashboard

Visit **[MECO Programming Dashboard](https://meco-robotics.github.io/MECO-Programming-Dashboard/)** in your browser. No installation or terminal is needed.

## At an outreach event

- **Explore:** select a project preview image, project name, or “Details and activity” in the project directory. Each project has a plain-language “Overview” section and an “Engineering” section with design decisions, limitations, and links to supporting documentation.
- **Try it:** expand “Try an activity” in a project, then sequence a scoring cycle, count practice scores, complete a readiness checklist, or select an illustrated autonomous route. Each activity resets when you reopen its project; nothing is uploaded or saved.
- **Featured projects:** use the arrows floating on the panel, the named project buttons, a horizontal touch swipe, a mouse drag, or a horizontal trackpad gesture. Navigation works across every slide’s image and text and wraps between the first and last project. Arrows stay at a consistent position within the panel across projects, with a separate placement for small screens. Vertical gestures continue scrolling the page. The carousel stays on your chosen project; there is no automatic slideshow. Reduced-motion preferences disable the sliding animation.
- **Full screen:** select “Full screen.” Browser support and permissions may vary; the browser’s own full-screen command also works.
- **Keyboard:** Tab navigates controls; Enter or Space activates buttons. Escape closes the project dialog. The Left and Right arrow keys change the featured project when focus is outside a button, link, input, or dialog.
- The exhibit supports landscape, portrait, and small screens, keyboard focus indicators, native modal focus containment, and reduced-motion preferences.

An internet connection is required to open the GitHub Pages site and external project websites. The exhibit activities run in the browser without sending data to a server.

The link labeled “East Orlando, Florida” and “Team website” opens the team website. Project website buttons appear on the carousel, the project directory, and project dialogs. Available destinations include Remy's season page and 3D viewer, QRScout and its legacy preview, FieldScout downloads, Mission Control at `https://meco-pm.duckdns.org/`, and the AutoDrive training monitor. The AutoDrive monitor is labeled **team network** because its `100.121.248.52:8765` address requires access to that network; it is not a public website. Website links open in a new tab. La Petit Fromage has no configured website.

## Featured projects

| Area | Main repository | Related repositories |
| --- | --- | --- |
| Remy | [2026-Rebuilt](https://github.com/MECO-Robotics/2026-Rebuilt) | — |
| Scouting | [FieldScout](https://github.com/MECO-Robotics/FieldScout) | QRScout_MECO, QRScout-Legacy, QRScout-app- |
| La Petit Fromage | [16th_Note](https://github.com/MECO-Robotics/16th_Note) | — |
| Mission Control | [meco-mission-control-web](https://github.com/MECO-Robotics/meco-mission-control-web) | meco-mission-control-mobile, meco-mission-control-platform |
| AutoDrive | [AutoDrive](https://github.com/MECO-Robotics/AutoDrive) | — |

Content and engineering evidence were checked against the public repository READMEs on October 23, 2026. Mission Control is explicitly labeled as a prototype. The mini activities and field paths are educational illustrations, not embedded production applications or live telemetry. The scouting panel shows a QRScout screenshot, and the Mission Control panel shows its prototype task interface with demo data. AutoDrive's actual training uses PPO defense and AD* route planning; the exhibit does not execute that engine.

## Editing the exhibit

- `src/projects.js`: project titles, categories, repository links, `websites` button labels/URLs, explanations, engineering decisions, evidence links, and accent colors.
- `src/main.js`: rendering, project visuals, demos, manual carousel navigation, and controls.
- `src/style.css`: responsive layouts and activities.
- `src/identity.css`: MECO exhibit styling, typography, blue masthead, dark project directory, project details, and photographic presentation area.
- `public/assets/`: bundled team logo and robot photos.

When adding a project, add its content to `projects.js` and provide an appropriate visual/activity in `main.js`. Update the five-project labels and counters in `main.js` as needed. There is no GitHub API dependency: descriptions and repository links are curated, rather than fetched at runtime.

## Publishing through GitHub Pages

Every push to `main` runs `.github/workflows/pages.yml`. GitHub Actions installs the locked dependencies with Node.js 24, runs the interaction tests, builds the website, and deploys `dist/` to GitHub Pages. A failing test or build prevents deployment.

To publish an update, commit and push your changes to `main`. Check progress under the repository's **Actions** tab. To republish without a new commit, select **Deploy dashboard to GitHub Pages → Run workflow**.

Repository **Settings → Pages → Source** must be **GitHub Actions**. Vite's base path is `/MECO-Programming-Dashboard/`, matching the repository's Pages URL. If the repository name or hosting domain changes, update `vite.config.js` and the website link above.

The test suite covers project filters, activities, carousel wraparound, touch swipes, horizontal trackpad gestures, preview links, accessibility, focus preservation, optional activities, and engineering views. Visual layout and native browser interactions still require browser review.

## Branding and asset credits

- Official colors from MECO Mission Control: blue `#16478e`, red `#ea1c2d`; the exhibit uses a compact team-blue navigation header without the logo or team-number label, a consistent dark navy background across the project directory, project details, activities, and presentation area, with light text, pale blue links, and red navigation accents.
- `public/assets/meco-logo.svg`: MECO's white logo, sourced from the existing Mission Control web repository's `public/meco-main-logo-white.svg`.
- `public/assets/remy.jpg`: Remy photograph from [MECO's 2026 REBUILT page](https://www.mecorobotics.org/frc/2026-rebuilt). Team branding and photography remain the property of their respective owners.
- `public/assets/scouting-preview.png`: captured from the live [MECO QRScout app](https://meco-robotics.github.io/QRScout_MECO/) on October 23, 2026, showing its dark TEAM 8324 interface. Only browser chrome was cropped out.
- `public/assets/mission-preview.png`: prototype task screenshot with demo data, used in the feature panel and directory, from [Mission Control](https://github.com/MECO-Robotics/meco-mission-control-web/blob/main/docs/ui-audit/task-desktop.png).
- `public/assets/autodrive-preview.png`: user-provided AutoDrive simulation screenshot, displayed in the feature panel and directory. The optional activity remains a separate route illustration.
- Team background: [MECO Robotics](https://www.mecorobotics.org/).

The photo of La Petit Fromage uses `public/assets/16th-note-4k.png` (3840 × 3280 pixels). The original 192 × 164 screenshot remains unchanged at `public/assets/16th-note-original.png`. The display asset was conservatively restored with built-in imagegen, then resized to a 3840-pixel long edge. It remains soft: an upscale cannot recover missing source detail. CSS fades its edges into the navy background and applies a small contrast adjustment. The display width remains capped at 384px to avoid excessive enlargement. There are no music-note graphics.

### Image restoration prompt

> Conservative restoration/upscale ONLY of this exact photograph. Output 3840x3280 pixels (same 192:164 aspect ratio, 4K long edge). Absolutely preserve original pixel composition, camera perspective, exact robot silhouette, tiny robot dimensions, all visible component positions, red bumper number 9924, gray floor, blue background bins, and original framing. Do not redesign, relight, replace background, add components, extrapolate plausible sharp mechanical details, or change shapes. A previous attempt invented a different robot and was rejected. This should look exactly like the attached screenshot but resampled with very gentle noise reduction and conservative sharpening. Keep naturally soft areas soft wherever detail cannot be recovered. No text additions. Preserve the source's appearance and robot identity over sharpness.

## Presentation review

[Review notes](docs/review-notes.md) record the judge and first-time-visitor walkthroughs, findings, fixes, and validation. The engineering view describes documented behavior; it does not claim award results, measured competition improvements, or completed hardware validation where the project documentation does not establish them.

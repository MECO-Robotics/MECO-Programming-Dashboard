## Swipe regression review — October 24, 2026

Reproduced a touch gesture that did nothing on the “Swipe to explore” strip: gesture handlers were attached only to the inner slide viewport. Moved them to the persistent outer carousel, covering images, text, controls, and the hint strip. Mouse release is tracked outside the panel, short horizontal swipes are accepted, and reversed trackpad gestures no longer remain locked as momentum. Keyboard activation is not suppressed after a swipe.

Browser validation used a dedicated Chrome window and DevTools touch emulation. At 1280 × 800, swiped the hint strip forward through all five projects and back to Remy, image areas backward through all five and back to Remy, and text areas forward through the full cycle. At the iPhone 16 preset (393 × 852), swiped every image forward and backward, including both wraparound transitions. Native gestures drove these checks; they were not synthetic DOM events. The native automation tool produced zero horizontal wheel deltas, so trackpad-specific direction/momentum checks remain covered by the automated event tests rather than a physical trackpad test.

> Update: The carousel is now manual, with floating arrows, touch swipes, and horizontal trackpad gestures. Slideshow controls and timing described in the historical review below have been removed. The directory now includes previews, and the scouting panel shows a repository screenshot.

# Outreach and judging review

Review started October 23, 2026. These are walkthrough findings, not feedback from actual judges or visitors. The review does not predict award results.

## Pass 1: engineering presentation

- Technical descriptions name libraries without explaining a concrete decision, its purpose, or how to inspect it. Add project-specific decisions and direct documentation references.
- Every detail view gives a large activity immediate prominence, even when discussing engineering. Separate the project explanation from an optional activity.
- Source links lead only to repository roots. Add documentation links supporting the specific claims; distinguish a prototype and a simulation from demonstrated hardware results.
- AutoDrive's network-only monitor is a likely dead end for visitors. Explain the requirement beside the link, with a public documentation alternative.
- The tiny dot navigation makes jumping to a named project awkward during a conversation. Provide named project navigation.
- The field illustration lacks an accessible explanation and its drawn route does not align with the robot's CSS movement.

## Pass 1: first-time visitor

- FRC, scouting, intake, game pieces, and autonomous operation need context. Explain them in ordinary language where they occur.
- The page does not tell a new visitor how to begin. Add one practical introduction, not a slogan.
- The robot activity is a three-click quiz that does not explain why order matters. Add explanatory feedback and let visitors undo a step.
- The scouting counter lacks a connection to an actual scouting record. Show what is being recorded and why it helps.
- Completing a sample checklist should not imply that a real robot is ready.
- Keep the honest, small robot photo rather than inventing a sharper robot.

## Changes and repeat review

All first-pass findings above were addressed. The overview explains each project's purpose; Engineering gives two documented decisions, the relevant limits, and two supporting links. Activities are optional disclosures. Navigation names the projects rather than using anonymous dots. The existing photo of La Petit Fromage is retained.

The second browser pass found and corrected:

- Completing the sequence disabled the focused button. Focus now moves to Undo; the browser walkthrough confirmed it.
- Presenters could only stop rotation by leaving the monitor layout. Pause/Resume now keeps the layout and supports manual navigation while paused.
- Different desktop slide heights moved the controls between projects. A shared minimum height keeps normal desktop navigation stable.
- The route illustration and goal position did not match the motion endpoint. They now share percentage-based positions and the robot arrives at the goal.
- Native fullscreen consumes the first Escape key before the page receives it. Exiting fullscreen now also stops presentation, verified with the fullscreen-change regression test and repeated native browser exit.
- The portrait presentation's two-row controls extended beyond the viewport. Presentation height now accounts for the header, margins, and controls; the repeated fullscreen check showed both Pause and Stop visible without scrolling.

## Verification

- Browser walkthrough: all five project overviews and Engineering sections reviewed against the current public project READMEs. No invented results, awards, or hardware validation claims were added.
- Browser activities: sequence error, undo, and success; scouting increment, correction, and reset; sample checklist completion; route movement. The automated suite also verifies activity reset on reopen and retained state when changing explanation level.
- Browser presentation: named project selection, pause and manual selection, resume, automatic advancement from the last project back through the beginning, stop, and native fullscreen entry/exit.
- Responsive browser review: 375 × 667 phone preset, 1280 × 800 landscape preset, and 1080 × 1920 fullscreen portrait. Inspected phone directory, scrollable dialog, route controls, and sticky close button; desktop and monitor project layouts; portrait controls after the height fix.
- Keyboard: explanation buttons activated with Tab/Enter; Escape closes the dialog and returns focus to its launcher; activity completion leaves focus on Undo. Native modal behavior prevents interaction with background page controls.
- All 17 unique public evidence/website destinations returned HTTP 200 during this review. AutoDrive's team-network monitor is explicitly labeled and was not treated as a public destination.
- Automated checks cover filters, activity behavior, carousel wraparound, inaccessible outgoing slides, preserved navigation focus, paused rotation, all five engineering views, reduced motion, and sequence focus recovery.

These are agent walkthroughs, not a substitute for feedback from actual judges or children. The original robot photo remains low-resolution, and repository documentation is evidence of implementation rather than proof of competition outcomes.


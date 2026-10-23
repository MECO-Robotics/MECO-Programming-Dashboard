export const github = 'https://github.com/MECO-Robotics/';
export const projects = [
  {
    "id": "remy",
    "title": "Remy",
    "name": "Remy robot code",
    "category": "Robots",
    "label": "2026 competition robot",
    "color": "#91b5e5",
    "repo": "2026-Rebuilt",
    "language": "Java",
    "hook": "Swerve drive, intake, and shooter control for our 2026 robot.",
    "simple": "Remy is our 2026 competition robot. Its code controls the wheels, collects game pieces, and coordinates aiming and shooting.",
    "technical": "Command-based Java coordinates the swerve drivetrain, intake, and shooter. Subsystem IO separates real hardware from simulation and replay, with AdvantageKit telemetry to help understand robot behavior.",
    "challenge": "Put the scoring actions in order.",
    "steps": [
      "Collect",
      "Aim",
      "Shoot"
    ],
    "related": [],
    "websites": [
      {
        "label": "Robot website",
        "url": "https://www.mecorobotics.org/frc/2026-rebuilt"
      },
      {
        "label": "3D robot viewer",
        "url": "https://meco-robotics.github.io/robot-cad-embeds/"
      }
    ]
  },
  {
    "id": "scouting",
    "title": "Scouting software",
    "name": "Scouting software",
    "category": "Team tools",
    "label": "QRScout and FieldScout",
    "color": "#91b5e5",
    "repo": "FieldScout",
    "language": "Web, iPad, and desktop",
    "hook": "Match data collection with QRScout and analysis in FieldScout.",
    "simple": "Scouts record what happens during a match in QRScout. FieldScout organizes those observations into team summaries, charts, and rankings.",
    "technical": "QRScout captures match observations and encodes them for transfer. FieldScout keeps raw entries in an offline-first desktop spreadsheet and calculates separate summaries, rankings, and charts. Its iPad Portal works over local Wi-Fi.",
    "challenge": "Record scored game pieces.",
    "related": [
      "QRScout_MECO",
      "QRScout-Legacy",
      "QRScout-app-"
    ],
    "websites": [
      {
        "label": "Open QRScout",
        "url": "https://meco-robotics.github.io/QRScout_MECO/"
      },
      {
        "label": "Legacy preview",
        "url": "https://meco-robotics.github.io/QRScout-Legacy-Preview/"
      },
      {
        "label": "Download FieldScout",
        "url": "https://github.com/MECO-Robotics/FieldScout/releases/latest"
      }
    ]
  },
  {
    "id": "note",
    "title": "La Petit Fromage",
    "name": "La Petit Fromage",
    "category": "Robots",
    "label": "Tank-drive robot",
    "color": "#91b5e5",
    "repo": "16th_Note",
    "language": "Java",
    "hook": "Driving, intake, and shooter code for our small tank-drive robot.",
    "simple": "La Petit Fromage steers by changing the speed of its left and right wheels. Its code also controls the intake and shooter.",
    "technical": "The tank drivetrain uses the rebuilt command/subsystem/IO structure, AdvantageKit logs, SPARK MAX control, and PathPlanner autonomous routines.",
    "challenge": "Put the scoring actions in order.",
    "steps": [
      "Collect",
      "Aim",
      "Shoot"
    ],
    "related": []
  },
  {
    "id": "mission",
    "title": "Mission Control",
    "name": "Mission Control",
    "category": "Team tools",
    "label": "Team management · Prototype",
    "color": "#91b5e5",
    "repo": "meco-mission-control-web",
    "language": "TypeScript · React",
    "hook": "Planning, inventory, and build coordination in one team workspace.",
    "simple": "Mission Control brings tasks, parts, and team information into one workspace. It includes tools for planning builds and checking robot readiness.",
    "technical": "The web prototype supports planning, readiness review, inventory, manufacturing coordination, and roster workflows. Separate web, mobile, and API repositories make up the Mission Control system. It is not yet serving real operational data.",
    "challenge": "Complete a sample pre-match checklist.",
    "related": [
      "meco-mission-control-mobile",
      "meco-mission-control-platform"
    ],
    "websites": [
      {
        "label": "Open Mission Control",
        "url": "https://meco-pm.duckdns.org/"
      }
    ]
  },
  {
    "id": "auto",
    "title": "AutoDrive",
    "name": "AutoDrive",
    "category": "Autonomy",
    "label": "Robot simulation",
    "color": "#91b5e5",
    "repo": "AutoDrive",
    "language": "Python",
    "hook": "Simulated matches for testing path planning and defensive strategies.",
    "simple": "AutoDrive runs simulated robot matches to test movement and strategy. It combines planned routes with machine learning experiments for defense.",
    "technical": "GPU-vectorized training uses PPO for defense against deterministic offense strategies. AD* plans routes, and a robot controller follows them. Simulated physics and scoring support experiments; this exhibit is a simplified route illustration, not the training engine.",
    "challenge": "Choose a destination.",
    "related": [],
    "websites": [
      {
        "label": "Training monitor (team network)",
        "url": "http://100.121.248.52:8765/"
      }
    ]
  }
];
export function nextProject(index, count = projects.length) { return (index + 1) % count; }
export function sequenceFeedback(sequence) {
  return sequence.join(',') === 'Collect,Aim,Shoot' ? 'success' : sequence.length >= 3 ? 'retry' : 'pending';
}

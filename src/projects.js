export const github = 'https://github.com/MECO-Robotics/';
export const projects = [
  {
    "id": "remy",
    "title": "Remy",
    "name": "Remy",
    "category": "Robots",
    "label": "2026 competition robot",
    "color": "#91b5e5",
    "repo": "2026-Rebuilt",
    "language": "Java",
    "hook": "Code that drives our competition robot and coordinates collecting and shooting.",
    "simple": "Remy is our 2026 competition robot. Drivers use a controller to move it. Software also runs the intake, which picks up the balls used in the game, and the shooter, which sends them toward the goal.",
    "technical": "Commands coordinate the robot’s actions. Reusable Flywheel and PositionJoint subsystems handle motor speed and mechanism position. Separate input/output (IO) implementations support real hardware, simulation, and recorded-log replay.",
    "challenge": "Put the scoring actions in order.",
    "steps": [
      "Collect",
      "Aim",
      "Shoot"
    ],
    "related": [],
    "websites": [
      {
        "label": "Robot documentation",
        "url": "https://meco-robotics.github.io/2026-Rebuilt/"
      },
      {
        "label": "Robot website",
        "url": "https://www.mecorobotics.org/frc/2026-rebuilt"
      },
      {
        "label": "3D robot viewer",
        "url": "https://meco-robotics.github.io/robot-cad-embeds/"
      }
    ],
    "purpose": "The driver asks for an action; the software coordinates the motors needed to carry it out.",
    "engineering": [
      [
        "Reuse motor control",
        "A Flywheel can control one motor or a group sharing one speed. Mechanisms needing different speeds use separate subsystems, coordinated by a command."
      ],
      [
        "Check what the robot actually does",
        "The intake system check records requests, measured movement, limits, and controller results separately. A voltage request alone is not evidence that a mechanism moved."
      ]
    ],
    "evidence": [
      [
        "Subsystem design",
        "https://github.com/MECO-Robotics/2026-Rebuilt#subsystems"
      ],
      [
        "Intake diagnosis procedure",
        "https://github.com/MECO-Robotics/2026-Rebuilt/blob/main/docs/source/system-check.rst"
      ]
    ],
    "limitation": "Simulation supports development. Physical intake direction and hardware behavior still need verification on the robot.",
    "shortName": "Remy"
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
    "hook": "Record what robots do during matches, then compare the results.",
    "simple": "Scouting means watching matches and recording what each robot does. QRScout collects those observations. FieldScout turns the records into summaries that help our team compare robots and plan matches.",
    "technical": "FieldScout keeps raw scouting entries separate from calculated summaries. QRScout records can be scanned into it, and an iPad Portal can submit entries over local Wi-Fi without internet access.",
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
    ],
    "purpose": "A written record lets the team compare many matches instead of relying on memory.",
    "engineering": [
      [
        "Keep the original observations",
        "Charts and rankings are calculated as separate views. Duplicate scans are ignored, while conflicting entries for the same team and match require review."
      ],
      [
        "Work without venue internet",
        "Scouting records stay on the computer. The iPad Portal uses the local network and queues entries on the iPad if the computer disconnects."
      ]
    ],
    "evidence": [
      [
        "Data collection and offline behavior",
        "https://github.com/MECO-Robotics/FieldScout#scout-from-an-ipad-without-installing-an-app"
      ],
      [
        "QRScout form and transfer format",
        "https://github.com/MECO-Robotics/QRScout_MECO"
      ]
    ],
    "limitation": "The counter here is a teaching example. It does not send a record to QRScout or FieldScout.",
    "shortName": "Scouting"
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
    "hook": "Drive and mechanism control for our smaller development robot.",
    "simple": "La Petit Fromage is our smaller development robot. It turns by changing the speed of its left and right wheels. Its software also picks up game pieces and controls the shooter.",
    "technical": "The tank drivetrain uses the rebuilt command/subsystem/IO structure, AdvantageKit logs, SPARK MAX motor controllers, and PathPlanner routes. Shooter routines check measured wheel speed before feeding a game piece.",
    "challenge": "Put the scoring actions in order.",
    "steps": [
      "Collect",
      "Aim",
      "Shoot"
    ],
    "related": [],
    "purpose": "This robot gives the team another platform for developing and checking driving and mechanism code.",
    "engineering": [
      [
        "Wait for the mechanism to be ready",
        "Autonomous shooting waits for the measured shooter speed to reach its tolerance. If that takes too long, the routine reports an error and does not feed the game piece."
      ],
      [
        "Keep evidence from a run",
        "Match information, controls, and mechanism measurements are saved in logs. Logging uses writable USB storage when available, with onboard storage as a startup fallback."
      ]
    ],
    "evidence": [
      [
        "Robot behavior and tuning notes",
        "https://github.com/MECO-Robotics/16th_Note#readme"
      ],
      [
        "Recorded match data",
        "https://github.com/MECO-Robotics/16th_Note#match-logs"
      ]
    ],
    "limitation": "The repository is still named 16th_Note. Its documentation identifies preliminary settings that require hardware tuning.",
    "shortName": "La Petit Fromage"
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
    "hook": "A prototype workspace for tasks, parts, and robot preparation.",
    "simple": "Building a robot takes more than writing code. Mission Control is a prototype for keeping track of jobs, parts, and team information so people can see what needs attention.",
    "technical": "The React web client, mobile client, and shared API live in separate repositories. The web workspace covers planning, resources, and team information. Demo and tutorial modes use separate example data.",
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
    ],
    "purpose": "The workspace connects the work to be done with the parts and people involved.",
    "engineering": [
      [
        "Separate practice from team data",
        "Unsigned demos keep edits in the browser tab. Tutorials use an in-memory copy and discard changes when the tutorial ends. These modes do not upload edits to a real workspace."
      ],
      [
        "Share a service across clients",
        "Web and mobile clients use the platform API. The web interface supports detailed planning and review; the mobile interface is intended for quick shop updates."
      ]
    ],
    "evidence": [
      [
        "Demo and tutorial isolation",
        "https://github.com/MECO-Robotics/meco-mission-control-web#local-demo-and-tutorials"
      ],
      [
        "System architecture",
        "https://github.com/MECO-Robotics/meco-mission-control-web#system-overview"
      ]
    ],
    "limitation": "This is a prototype, not evidence of a production rollout or measured team outcomes.",
    "shortName": "Mission Control"
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
    "hook": "Test robot routes and defensive strategies in simulated matches.",
    "simple": "AutoDrive runs robot matches inside a computer. It tests where a robot should move and how it could defend against another robot, before trying those ideas on a physical field.",
    "technical": "A learning method called PPO trains defensive strategies against scripted opponents. AD* plans routes, and a robot controller follows them. Evaluation compares strategies on matched, seeded scenarios.",
    "challenge": "Choose a destination.",
    "related": [],
    "websites": [
      {
        "label": "Training monitor (team network)",
        "url": "http://100.121.248.52:8765/"
      }
    ],
    "purpose": "Simulation provides a repeatable place to compare strategies under the same starting conditions.",
    "engineering": [
      [
        "Separate strategy from movement",
        "The strategy selects an objective. A route planner finds a path, and a controller handles following it. These are separate responsibilities."
      ],
      [
        "Compare repeatable trials",
        "Evaluation records include scored game pieces, cycle time, defensive outcomes, and simulated score differences against scripted baselines."
      ]
    ],
    "evidence": [
      [
        "Training and evaluation",
        "https://github.com/MECO-Robotics/AutoDrive#train-on-the-wx-9100-gpus"
      ],
      [
        "Physics assumptions and limits",
        "https://github.com/MECO-Robotics/AutoDrive#swerve-physics-assumptions"
      ]
    ],
    "limitation": "The simulator has simplified physics and game rules. Results are not proof of performance on a real robot. The training monitor requires access to the team network.",
    "shortName": "AutoDrive"
  }
];
export function sequenceFeedback(sequence) {
  return sequence.join(',') === 'Collect,Aim,Shoot' ? 'success' : sequence.length >= 3 ? 'retry' : 'pending';
}

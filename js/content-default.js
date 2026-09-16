/* AUTO-GENERATED from content/site.json — do not edit by hand.
   Regenerate with: npm run build  (or just start the server). */
window.MORIZIN_DEFAULT = {
  "profile": {
    "name": "Mohammed Rizin",
    "handle": "morizin",
    "role": "AI/ML Solution Architect",
    "tagline": "Systems for a more human future.",
    "headline": "I build intelligent systems for real-world problems.",
    "location": "Malappuram, Kerala ⇄ Mumbai, India",
    "status": "Founding Engineer at Medulla · open to collaboration on meaningful problems",
    "email": "hello@morizin.com",
    "website": "https://morizin.me",
    "socials": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/morizin"
      },
      {
        "label": "GitHub",
        "href": "https://github.com/morizin"
      },
      {
        "label": "X",
        "href": "https://x.com/MohammedRizin"
      },
      {
        "label": "Kaggle",
        "href": "https://www.kaggle.com/morizin"
      },
      {
        "label": "Medium",
        "href": "https://medium.com/@mrizin2013"
      }
    ],
    "about": [
      "I'm an AI/ML solution architect who moves between research and production. I take intelligent systems from the first sketch to something that actually runs in the world — the model, the edge, and the interface designed as one thing.",
      "Most of my work sits where machine learning meets a real environment: a warehouse aisle, a stadium, a desk, a device on a pole. The question is always the same — does this make someone's day safer, clearer, or better?"
    ],
    "portrait": "",
    "experience": [
      {
        "org": "Medulla",
        "role": "Founding Engineer",
        "when": "Present",
        "note": "Applied ML from prototype to product."
      },
      {
        "org": "NVIDIA",
        "role": "Deep Learning Intern",
        "when": "May – Aug 2023",
        "note": "Deep learning optimisation and deployment on the CUDA / TensorRT stack."
      },
      {
        "org": "Fathom Solutions",
        "role": "AI/ML Engineer",
        "when": "Jan 2022 – Apr 2023",
        "note": "Computer vision for industrial and retail, PoC to production."
      }
    ],
    "education": [
      {
        "org": "IIT Madras",
        "role": "BS, Data Science (online)",
        "when": "2021 – 2024",
        "note": "Machine learning, statistics, real-world AI systems."
      },
      {
        "org": "Amity University Mumbai",
        "role": "B.Tech, Computer Science & Engineering",
        "when": "2019 – 2023",
        "note": "Computer science, algorithms, applied machine learning."
      }
    ],
    "achievements": [
      {
        "label": "Kaggle Competitions Master",
        "note": "3 gold · 8 silver · 1 bronze across 66 competitions; peak global rank #38."
      },
      {
        "label": "1st place — VinBigData Chest X-ray Abnormalities Detection",
        "note": "Team of four; consensus-fusion detector ensemble."
      },
      {
        "label": "2nd place — Bristol-Myers Squibb Molecular Translation",
        "note": "Image-to-InChI sequence modelling."
      },
      {
        "label": "Upstage: Making AI Beneficial — 0.966",
        "note": "SAINT transformer with pseudo-labelling and ensembling; code public."
      },
      {
        "label": "Zindi Competition Winner",
        "note": "1st place, Crop Yield Prediction."
      },
      {
        "label": "Smart India Hackathon Finalist",
        "note": "Top 3 — computer vision for safer public spaces."
      }
    ],
    "skills": {
      "AI & Machine Learning": [
        "Computer Vision",
        "Deep Learning",
        "Model Deployment",
        "Edge / On-device ML",
        "MLOps",
        "Experiment Design"
      ],
      "Programming & Tools": [
        "Python",
        "PyTorch",
        "TensorFlow",
        "OpenCV",
        "Docker",
        "ONNX",
        "TensorRT"
      ],
      "Domains": [
        "Workplace Safety",
        "Sports Analytics",
        "Robotics",
        "Industrial IoT",
        "Sustainability"
      ],
      "Soft Skills": [
        "Systems Thinking",
        "Technical Writing",
        "Client Collaboration",
        "Mentoring"
      ]
    },
    "calendly": "",
    "fullName": "Mohammed Rizin V K",
    "faq": [
      {
        "q": "Who is morizin?",
        "a": "morizin is Mohammed Rizin V K, an AI/ML Solution Architect based in Kerala and Mumbai, India, and currently Founding Engineer at Medulla. He designs and ships machine-learning systems for real-world problems — computer vision, edge intelligence, robotics and applied research."
      },
      {
        "q": "What is Mohammed Rizin known for?",
        "a": "Competitive machine learning (Kaggle Competitions Master with 3 gold, 8 silver and 1 bronze medals and a peak global rank of 38 — 1st place in the VinBigData Chest X-ray Abnormalities Detection competition and 2nd place in Bristol-Myers Squibb Molecular Translation) and production computer-vision work such as workplace-safety detection."
      },
      {
        "q": "How can I work with morizin?",
        "a": "Describe what you want to build on the home page and the planning assistant lays out a scoped plan from the services offered — discovery sprint, working prototype, production build, or ongoing architecture advisory — then book a call or email."
      },
      {
        "q": "Where can I find morizin online?",
        "a": "GitHub, Kaggle, LinkedIn and X as “morizin”, Medium as @mrizin2013, and this site."
      }
    ]
  },
  "projects": [
    {
      "id": "movement-safety",
      "number": "01",
      "tags": [
        "Rust",
        "IMU",
        "Sensor fusion",
        "Privacy by design",
        "Research"
      ],
      "metrics": [
        {
          "value": "Stage 1 / 10",
          "label": "IMU capture and storage, shipped"
        },
        {
          "value": "0 identifiers",
          "label": "names, numbers or precise location stored"
        }
      ],
      "timeline": [
        {
          "when": "Aug 2026",
          "what": "Stage 1 — consented multi-phone IMU capture, JSONL sessions, synthetic generator, tests"
        }
      ],
      "links": [
        {
          "label": "Repository",
          "href": "https://github.com/morizin/movement-safety"
        }
      ],
      "title": "Movement Safety",
      "domain": "Sensing & Safety",
      "modality": "IMU / Sensor ML",
      "status": "Research prototype",
      "featured": true,
      "summary": "Can synchronised accelerometer and gyroscope data from several consenting phones characterise a physical interaction? A controlled-experiment prototype in Rust.",
      "body": "The question is whether movement alone — no camera, no identity — carries enough signal to tell what kind of physical interaction is happening between people. Stage 1 is the capture rig: a local Rust server that any phone on the same network can open, an explicit consent step before a session may start, accelerometer and gyroscope streamed over WebSocket, and every session written as append-only JSONL with random device and session identifiers. Participants can stop or delete their own data at any time. A deterministic synthetic generator lets the rest of the pipeline be tested with no phone attached.\n\nThe out-of-scope list is enforced in code, not written in a policy: no age, gender or race inference, no facial or biometric identification, no persistent identity or location tracking, no matching against records, no automatic reporting, no covert use. It is a research instrument for consenting participants and nothing else. Stages 2–10 — synchronisation, feature extraction, models, evaluation — follow the spec in the repository.",
      "cover": "assets/movement-safety.webp",
      "updated": "2026-08-14"
    },
    {
      "id": "mnist-cuda",
      "number": "02",
      "tags": [
        "CUDA",
        "C++",
        "GPU kernels",
        "From scratch"
      ],
      "metrics": [
        {
          "value": "784 → 256 → 10",
          "label": "ReLU MLP, float32, row-major"
        },
        {
          "value": "6 kernels",
          "label": "matmul · bias+ReLU · softmax-CE fwd/bwd · gather · SGD"
        }
      ],
      "timeline": [
        {
          "when": "Aug 2026",
          "what": "Kernels, loader, training loop and Makefile (sm_70 – sm_90)"
        }
      ],
      "links": [
        {
          "label": "Repository",
          "href": "https://github.com/morizin/mnist_c"
        }
      ],
      "title": "MNIST in hand-written CUDA",
      "domain": "Systems & Compute",
      "modality": "CUDA / Systems",
      "status": "Prototype",
      "featured": true,
      "summary": "A two-layer MLP trained on MNIST where every kernel — tiled matmul, fused bias+ReLU, fused softmax cross-entropy, batch gather, SGD-momentum — is written by hand. No cuBLAS, no cuDNN.",
      "body": "The point was to own every byte between the data and the gradient. One generic 16×16 shared-memory tiled matmul kernel serves every forward and backward product through transpose flags rather than a kernel per op. Softmax and cross-entropy are fused in both directions — the backward pass writes probs − one_hot(label) directly, so there is no Jacobian to build. The full training set lives on the GPU for the whole run; each epoch reshuffles an index array on the host and uploads only the batch's indices, and a gather kernel pulls the rows. Optimiser is plain SGD with momentum.\n\nIt was written and reviewed on a machine without an NVIDIA GPU, so the repository is honest about that: build it on real hardware before trusting the numbers, and the README lists the places to check first if training misbehaves.",
      "cover": "assets/desk.webp",
      "updated": "2026-08-17"
    },
    {
      "id": "crash-detector",
      "number": "03",
      "tags": [
        "Computer Vision",
        "IMU",
        "Control",
        "PID",
        "MPC"
      ],
      "metrics": [
        {
          "value": "3 signals",
          "label": "camera · IMU · actuators"
        },
        {
          "value": "PID → MPC",
          "label": "stabiliser roadmap"
        }
      ],
      "timeline": [
        {
          "when": "Sep 2026",
          "what": "Architecture, success metrics and roadmap published"
        }
      ],
      "links": [
        {
          "label": "Repository",
          "href": "https://github.com/morizin/crash-detector"
        }
      ],
      "title": "Crash Detector",
      "domain": "Vehicles & Safety",
      "modality": "Multi-modal ML",
      "status": "In progress",
      "featured": true,
      "summary": "Predict an imminent crash from dashcam frames, vehicle sensors and current actuator state — then intervene to stabilise the vehicle in the seconds before impact.",
      "body": "Most crashes come with a short warning that a driver cannot use: low visibility, a vehicle already past the point of control, a roll about to happen. The system watches three things at once — a camera model on dashcam frames for obstacles and lane departure; a sensor model on accelerometer, gyroscope and speed for dynamics the camera cannot see, especially in the dark; and an actuator model on the steering, braking and throttle combination for control inputs that are themselves unsafe. When risk is high, a stabiliser takes over the actuators — PID to begin with, model-predictive control as the goal.\n\nThe repository holds the architecture, the metrics the project is judged by, and the roadmap. Several components are still marked to-do; it is a project in motion, not a result.",
      "cover": "assets/edge-camera.webp",
      "updated": "2026-09-07"
    },
    {
      "id": "making-ai-beneficial",
      "number": "04",
      "tags": [
        "Kaggle",
        "Transformer",
        "SAINT",
        "Pseudo-labelling",
        "Ensembling"
      ],
      "metrics": [
        {
          "value": "0.966",
          "label": "competition score"
        },
        {
          "value": "7 variants",
          "label": "ensembled"
        }
      ],
      "timeline": [
        {
          "when": "Feb 2025",
          "what": "Solution code and weights published"
        }
      ],
      "links": [
        {
          "label": "Repository",
          "href": "https://github.com/morizin/Making-AI-Beneficial"
        }
      ],
      "title": "Upstage: Making AI Beneficial",
      "domain": "Competitions",
      "modality": "Sequence models",
      "status": "Shipped",
      "featured": false,
      "summary": "A 0.966 solution to Upstage's sequential-learning competition: a SAINT transformer, pseudo-labelled retraining, and an ensemble across seven training variants — all code and weights public.",
      "body": "The task was sequential prediction over learner interactions. The solution is a SAINT-style transformer trained in seven variants — plain, pseudo-labelled, and one with Adam swapped in — then ensembled. Pseudo-labelling on the test set was the reliable lift; the ensemble did the rest. Training and inference are single shell commands, and every weight and submission file is in the repository so the score can be reproduced rather than believed.",
      "cover": "",
      "updated": "2025-02-03"
    },
    {
      "id": "tuberculosis-detection",
      "number": "05",
      "tags": [
        "Computer Vision",
        "Medical Imaging",
        "TensorFlow",
        "Streamlit"
      ],
      "metrics": [
        {
          "value": "2 classes",
          "label": "TB positive / negative"
        }
      ],
      "timeline": [
        {
          "when": "Jan 2026",
          "what": "Model, app and README published"
        }
      ],
      "links": [
        {
          "label": "Repository",
          "href": "https://github.com/morizin/tuberculosis-detection"
        }
      ],
      "title": "Tuberculosis Detection",
      "domain": "Medical Imaging",
      "modality": "Computer Vision",
      "status": "Prototype",
      "featured": false,
      "summary": "Binary TB screening from chest X-rays with a Keras model behind a one-page Streamlit app — upload a radiograph, get a call. Research and education only.",
      "body": "A deliberately small piece: a trained TensorFlow/Keras classifier, a Streamlit front end, and nothing between them. Drop in a chest X-ray and it returns TB-positive or TB-negative. It exists to make the model usable by someone who is not going to open a notebook, and it carries the disclaimer it should — this is a research tool, not a diagnosis.",
      "cover": "",
      "updated": "2026-01-25"
    }
  ],
  "services": [
    {
      "id": "discovery",
      "name": "Discovery sprint",
      "price": "[TODO] from ₹—",
      "tier": "entry",
      "description": "[TODO] One to two weeks to turn a problem statement into a scoped, costed plan — data audit, feasibility, first architecture.",
      "includes": [
        "Problem framing workshop",
        "Data & feasibility review",
        "Written plan with budget bands"
      ]
    },
    {
      "id": "prototype",
      "name": "Working prototype",
      "price": "[TODO] from ₹—",
      "tier": "core",
      "description": "[TODO] Four to eight weeks to a demonstrable system on real data — model, pipeline, and a thin interface.",
      "includes": [
        "Model + pipeline on your data",
        "Edge or cloud deployment target",
        "Demo and handover notes"
      ]
    },
    {
      "id": "production",
      "name": "Production build & deployment",
      "price": "[TODO] from ₹—",
      "tier": "core",
      "description": "[TODO] Taking a validated prototype to something that survives the field — monitoring, retraining, integration.",
      "includes": [
        "Hardening and integration",
        "Monitoring and retraining loop",
        "Team enablement"
      ]
    },
    {
      "id": "advisory",
      "name": "Architecture advisory",
      "price": "[TODO] ₹— / month",
      "tier": "retainer",
      "description": "[TODO] Ongoing architecture and review time for teams already building — a few hours a week, async-first.",
      "includes": [
        "Weekly review call",
        "Design and code review",
        "Vendor and model selection"
      ]
    }
  ],
  "writing": [
    {
      "id": "vinbigdata-1st-place-ensemble",
      "title": "How we won VinBigData: an ensemble built to agree like radiologists",
      "summary": "First place in the VinBigData Chest X-ray Abnormalities Detection competition — a three-tier detector ensemble fused with a consensus variant of Weighted Boxes Fusion, the metric quirk we found, four things that did not work, and the submission we should have picked.",
      "date": "2026-09-17",
      "originally": "2022-01-27",
      "tags": [
        "Kaggle",
        "Computer Vision",
        "Medical Imaging",
        "Object Detection",
        "Ensembling",
        "WBF"
      ],
      "source": {
        "label": "Team write-up on Kaggle",
        "href": "https://www.kaggle.com/competitions/vinbigdata-chest-xray-abnormalities-detection/writeups/s-1st-place-solution"
      },
      "coauthors": [
        "Sergio Manuel Papadakis",
        "avsanjay",
        "Fatih Öztürk"
      ],
      "body": "We finished first in VinBigData's Chest X-ray Abnormalities Detection with a private-leaderboard mAP of **0.314** — and, as every Kaggler will recognise, with a better submission (0.321) sitting unselected in the queue. This is the short version of how the winning ensemble worked, why it worked, and the four things we tried that did nothing. The [full team write-up is on Kaggle](https://www.kaggle.com/competitions/vinbigdata-chest-xray-abnormalities-detection/writeups/s-1st-place-solution).\n\n## The problem, briefly\n\nFourteen thoracic abnormalities to localise on chest radiographs, plus a fifteenth \"no finding\" class. The training labels came from several radiologists per image, and the test set was scored against their *consensus*. That last detail turned out to be the whole competition.\n\n## We merged late, and it cost us a validation scheme\n\nWe came together from separate teams, each with its own cross-validation split and its own best ensemble. There was no clean way to compare a model trained on my folds with one trained on Fatih's. So we did something that made us nervous and, in the end, paid off: we treated the public leaderboard as one more validation set, and we sorted every model into three tiers by how much we trusted its number.\n\n- **Fully validated** — Detectron2 ResNet-101, YOLOv5, EfficientDet-D2, all on a shared split.\n- **Partially validated** — a 5-fold YOLOv5.\n- **Public-LB only** — everything else: two more EffDet-D2s, three YOLOv5 variants (one with test-time augmentation), a 16-class YOLO, a re-anchored YOLO, Detectron2 ResNet-50, and two community YOLOv5 baselines we retrained.\n\nWe also retrained our strongest models on one common split and ensembled those. On its own that \"clean\" ensemble did not beat the messy one on the private board.\n\n## The trick: fuse boxes the way radiologists agree\n\nEvery detector produced its own boxes. We merged them with [Weighted Boxes Fusion](https://github.com/ZFTurbo/Weighted-Boxes-Fusion) — and then with a variant Sergio wrote that changed the competition for us.\n\nStandard WBF clusters boxes that overlap above an IoU threshold and gives the merged box the *mean* of their confidences. Our variant, **p_sum**, gives it the *sum*, normalised at the end. The intuition is the test set itself: the ground truth was radiologists agreeing. A box that five models drew should outrank a box that one model drew with high confidence — because that is exactly how the labels were made. Switching the final stage from mean to sum moved the public score from **0.319 to 0.331**.\n\n## The metric had no penalty for extra boxes\n\nChris Deotte [pointed this out](https://www.kaggle.com/c/vinbigdata-chest-xray-abnormalities-detection/discussion/229637) and we confirmed it: adding low-confidence boxes could only help recall and never hurt precision at the operating points that mattered. We took a high-mAP model and appended every non-overlapping box from a high-recall model. The precision-recall curves kept their shape; their tails stretched from a recall ceiling of about 0.7 to past 0.8. We did not need it in the end — the ensemble's recall was already high — but it is the kind of thing worth knowing about a metric before you spend a week on architecture.\n\n## What did not work\n\n- **A 14-class multi-label classifier as a gate.** Train a sigmoid classifier on the whole image; drop any box whose class the classifier does not believe. It reduced the score. Swapping in PCAM attention pooling, which won CheXpert, did not rescue it.\n- **A crop classifier.** EfficientNet-B6 on the cropped box, asked \"is this really class X?\" It could not tell diseases apart from a crop alone; it needed the whole image.\n- **NIH ChestX-ray14 as pre-training.** Backbone trained as a multi-label classifier on NIH, transplanted into the detector, heads fine-tuned on the competition data. No measurable gain.\n- **One model per class.** Each with its own anchors, trained on class-X plus no-finding. Some classes improved, others did not, and the split it used did not match anyone else's, so it could not join the validated tier. A final ensemble with it scored the same as the one we selected.\n\n## The selection\n\nOur best local-CV model (around 0.47 mAP on CV) scored 0.300 public / 0.287 private. Our best public-LB submission scored **0.354 / 0.314**, and that is the one we chose. Had we given the public-LB-only tier less weight, we would have submitted **0.330 / 0.321**. We over-fitted the public board, knew we might be, and did it anyway because it was the only validation we shared. It still won. It is not the lesson I would teach.\n\n## Hardware\n\nBetween us: four Quadro GV100s, four GTX 1080s, four Titan Xs, an RTX 3080 and a Quadro RTX 6000. The solution reproduces on a single GPU — the fleet bought us breadth of experiments, not the result.\n\n## Credits\n\nSergio Manuel Papadakis (socom20), Mohammed Rizin V K, avsanjay, Fatih Öztürk (fatihozturk). Baselines from corochann, awsaf49 and nxhong93 were part of the ensemble. Cite the Kaggle write-up if you use this.\n\n*If you are working on medical imaging or any detection problem where the labels are a committee's opinion, the consensus-fusion idea travels. Say so on the home page and I will lay out how it would apply.*\n"
    }
  ]
};

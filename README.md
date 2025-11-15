# final-project_dgao0048_9103_tut1

This project is adapted from the collaborative apple-tree base code created by my group, upon which I developed additional **user-input** interactions.

### Interactive Apple Tree — Inspired by *Stranger Things*

This project is an interactive, animated apple-tree environment that transforms between two parallel worlds:  
a bright and lively day/night world, and an unsettling, corrupted “UpsideDown” world inspired by the TV series **Stranger Things**.

### How to Interact with the Work

This project contains *two different worlds* you can switch between:

#### **Normal World (Day/Night)**
- **Press `T`** → Toggle between **Day Mode** and **Night Mode**  
- **Click the Rain Button (☔️)** → Turn **Rain On or Off**
- **Click on the Tree Trunk** → Enter the **UpsideDown World**
- Apples grow, fall, land, and re-grow over time.
- In Night mode, apples glow softly and golden fireflies appear.

#### **UpsideDown World**
- **Click the Tree Trunk again** → Return to the Normal World
- **Click the Smoke Button (☁️)** → Release or dissipate **creepy purple fog**
- Background shifts subtly between cold blues, deep violets, and sickly purples
- Ambient particles drift around the corrupted tree
- Apples become pulsing, corrupted, glowing purple

---
### My Individual Approach to Animating the Group Code
 In my version, users can click the tree trunk to flip between the normal world and the UpsideDown world, and can press T in the normal world to switch between day and night, while the animation is driven primarily by interaction (mouse clicks, key presses) and time-based progression (continuous frameCount-driven changes) together with Perlin-like randomness that gives the entire scene a gentle breathing motion, with animatable properties including the swaying of tree branches, the cyclical growth and falling of apples, the glowing apples at night, the drifting golden fireflies, variations in rainfall density, and the corrupted apples and drifting smoke that appear only in the UpsideDown world, making my work thematically connected yet visually distinctive compared to the versions created by other group members; visually influenced by the iconic aesthetic cues of Stranger Things—the purple-black tones of the UpsideDown, the floating particles, and the ominous smoky atmosphere—I implemented a dynamically shifting cool-toned background, floating dark particles, and lightly trembling branches to evoke instability and eerie tension, and technically, using p5.js drawing functions and custom classes such as Segment, Apple, Firefly, RainDrop, and SmokeParticle, I constructed modular behaviors while separating world-space from screen-space coordinates to maintain stable UI scaling, applied translate-rotate easing for natural world-flip transitions, and integrated a scaleFactor resizing system to ensure that the entire scene preserves correct proportions and remains fully responsive across varying browser window sizes.
# final-project_dgao0048_9103_tut1

This project is adapted from the collaborative apple-tree base code created by my group, upon which I developed additional **user-input** interactions.

### Interactive Apple Tree — Inspired by *Stranger Things*

This project is an interactive, animated apple-tree environment that transforms between two parallel worlds:  
a bright and lively day/night world, and an unsettling, corrupted “UpsideDown” world inspired by the TV series **Stranger Things**.

### How to Interact with the Work

This project contains *two different worlds* you can switch between:

#### **Start**
When the page loads, the animation begins automatically.
You interact using keyboard keys and mouse clicks.

#### **Day / Night Toggle (Normal World Only)**
- Press T to switch between day and night.
- This function is disabled in the UpsideDown World.

**Day**: blue sky, green leaves sway, apples fall slowly
**Night**: dark blue sky, moon appears, leaves grow from small to large, fireflies appear

#### **Rain (Rain ☔️ Button)**
- Click the Rain ☔ button (top-right) to toggle rain.
- Rain is only visible in the normal world.

Special behaviors:
- If rain is activated during daytime, leaves begin to fall.
- If you then enter the UpsideDown World:
       - Rain will not be drawn
       - But leaves continue falling (they turn black)

#### **Leaf**
- **Normal Day:** green leaves gently sway
- **Normal Day + Rain:** leaves fall downward
- **Normal Night:** leaves scale up from small to large
- **UpsideDown World (entered from daytime):** leaves become black, falling continues if triggered
- **UpsideDown World (entered from nighttime):** leaves shrink to 0 and disappear

#### **Entering / Exiting the UpsideDown World**
- Click the **tree trunk** to flip the world.
- The whole canvas rotates 180°.
**Entering UpsideDown World:**
- Background becomes purple and dynamic
- Leaves turn black or disappear (depending on day/night when you entered)
- Apples switch to a cycle: rising → floating → returning to branch → repeat
**Exiting UpsideDown World:**
- Rotation returns to normal
- All apples reset back to their original positions
- Day/night toggle and rain display work normally again

#### **Apple**
**Normal World:**
waiting → falling → landing → reset → repeat
**UpsideDown World:**
waiting → rising upward → floating → returning to branch → repeat

This creates a surreal anti-gravity animation unique to the inverted world.

---

### My Individual Approach to Animating the Group Code
 In my version, users can click the tree trunk to flip between the normal world and the UpsideDown world, and can press T in the normal world to switch between day and night, while the animation is driven primarily by interaction (mouse clicks, key presses) and time-based progression (continuous frameCount-driven changes) together with Perlin-like randomness that gives the entire scene a gentle breathing motion, with animatable properties including the swaying of tree branches, the cyclical growth and falling of apples, the glowing apples at night, the drifting golden fireflies, variations in rainfall density, and the corrupted apples and drifting smoke that appear only in the UpsideDown world.
 
Visually influenced by the iconic aesthetic cues of Stranger Things—the purple-black tones of the UpsideDown, the floating particles, and the ominous smoky atmosphere—I implemented a dynamically shifting cool-toned background, floating dark particles, and lightly trembling branches to evoke instability and eerie tension, and technically, using p5.js drawing functions and custom classes such as Segment, Apple, Firefly, RainDrop, and SmokeParticle, I constructed modular behaviors while separating world-space from screen-space coordinates to maintain stable UI scaling, applied translate-rotate easing for natural world-flip transitions, and integrated a scaleFactor resizing system to ensure that the entire scene preserves correct proportions and remains fully responsive across varying browser window sizes.
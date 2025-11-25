# Jarvis Web App - Design Guidelines

## Design Approach

**Reference-Based Design**: Direct inspiration from Iron Man's Jarvis UI as seen in the MCU films, specifically the holographic interface systems in Tony Stark's workshop and helmet HUD displays.

**Core Design Principles**:
- Cinematic holographic aesthetic with futuristic tech interface styling
- High contrast with luminous accent elements
- Translucent layered panels creating depth
- Reactive, alive interface that responds to user interaction
- Clean, precise, military-grade tech feel

---

## Typography

**Font System**:
- Primary: 'Orbitron' or 'Rajdhani' (geometric, tech-inspired sans-serif) for headings and key UI elements
- Secondary: 'Inter' or 'IBM Plex Sans' for body text and chat messages
- Monospace: 'JetBrains Mono' for technical readouts (battery %, coordinates)

**Hierarchy**:
- Hero text (Jarvis greetings): text-4xl to text-5xl, font-bold, letter-spacing wide
- Dashboard widget titles: text-sm, uppercase, font-semibold, tracking-wider
- Chat messages: text-base to text-lg, font-normal
- Technical readouts: text-xs to text-sm, monospace, font-medium

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16 consistently
- Tight spacing: space-2, p-2 (within components)
- Standard spacing: space-4, p-4, gap-4 (between related elements)
- Section spacing: space-8, p-8 (between major sections)
- Large spacing: space-12 to space-16 (isolating major UI areas)

**Grid Structure**:
- Full viewport layout with fixed dashboard sidebar/top bar
- Main chat area: flex-1 with max-w-4xl centered container
- Dashboard widgets: grid-cols-1 md:grid-cols-3 for weather/battery/time
- Tony Tracker: Full-width featured section with map visualization

---

## Component Library

### Holographic Container Panels
- Translucent backgrounds with backdrop blur (backdrop-blur-md to backdrop-blur-lg)
- Subtle borders with glow effect simulation (border with luminous treatment)
- Rounded corners: rounded-lg to rounded-xl
- Shadow layers: multiple box-shadows creating depth and glow

### Central AI Orb/Waveform
- Circular or waveform visualization (200-300px diameter on desktop, 150-200px mobile)
- Pulsing animation synchronized with AI thinking/speaking states
- Multiple concentric rings or bars creating audio visualization effect
- Scale and opacity transitions during interaction states

### Dashboard Widgets (Weather, Battery, Time)
- Card-based design with glass-morphism effect
- Icon + value + label structure
- Battery displays as arc reactor visualization (circular progress indicator)
- Weather with animated icon states
- All widgets have subtle glow on hover

### Chat Interface
- Message bubbles with distinction between user and Jarvis
- Jarvis messages: Left-aligned, typewriter animation effect (letter-by-letter reveal)
- User messages: Right-aligned, standard appearance
- Timestamps in small monospace font
- Scrollable chat history with gradient fade at top/bottom

### Tony Stark Activity Tracker
- Full-width featured panel with map background
- Activity text: Large, centered, witty description
- Interactive map with location pin marker
- Coordinates display in technical readout style
- Randomized on each page load with smooth transition

### Voice Input Button
- Large circular button (80-100px diameter)
- Pulsing outer ring during recording
- Microphone icon center
- Active state shows waveform feedback
- Positioned prominently (bottom-center on mobile)

---

## Animations & Interactions

**Key Animation Patterns**:
- **Panel Entry**: Fade in + scale from 0.95 to 1.0, duration 300-400ms, ease-out
- **Text Typing**: Letter-by-letter reveal at 30-50ms per character for Jarvis responses
- **Orb Pulse**: Continuous scale animation from 1.0 to 1.1, 2s duration, ease-in-out infinite
- **Active State**: Scale 1.05 + brightness increase during voice recording
- **Hover Effects**: Subtle glow intensification, 200ms transition
- **Widget Updates**: Smooth number counting animations for changing values

**Transition Timing**:
- Micro-interactions: 150-200ms
- Component state changes: 300-400ms  
- Page/section transitions: 500-600ms
- Continuous ambient animations: 2-3s loops

**Performance**: Use CSS transforms (translate, scale, rotate) and opacity for animations. Avoid animating layout properties.

---

## Responsive Behavior

**Mobile (< 768px)**:
- Single column layout, stack all elements vertically
- Dashboard widgets in vertical stack (space-y-4)
- Voice button fixed to bottom with safe-area padding
- Chat messages full-width with reduced padding
- Tony Tracker map scales responsively, maintains aspect ratio

**Desktop (≥ 768px)**:
- Dashboard in horizontal grid (3 columns) or sidebar
- Chat centered with max-width constraint
- Larger orb visualization
- More generous spacing throughout

---

## Easter Egg Interactions

**Trigger Phrase Responses**: When user types specific phrases, show special animations:
- "I am Iron Man": Full-screen flash effect + special Jarvis acknowledgment
- "Status report": Dashboard widgets animate in sequence
- "Run diagnostics": Fake loading sequence with technical readouts

**Implementation**: Detect phrases client-side, trigger custom animation sequences and AI response templates.

---

## Images

**No hero images required** - this is a dashboard/application interface, not a marketing site. All visual interest comes from the holographic UI treatment, animations, and data visualizations.

**Map for Tony Tracker**: Use Leaflet.js or Mapbox GL with custom styling (dark theme, minimal labels, glowing markers) showing randomized global locations.
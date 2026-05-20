---
name: Infrastructural Integrity System
colors:
  surface: '#101415'
  surface-dim: '#101415'
  surface-bright: '#363a3b'
  surface-container-lowest: '#0b0f10'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2c'
  surface-container-highest: '#323537'
  on-surface: '#e0e3e5'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e0e3e5'
  inverse-on-surface: '#2d3133'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#bec6e0'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00885d'
  on-tertiary-container: '#000703'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#101415'
  on-background: '#e0e3e5'
  surface-variant: '#323537'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  technical-data:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  container-max: 1440px
---

## Brand & Style

The design system is engineered for a high-stakes environment where technical precision meets academic integrity. The brand personality is authoritative yet forward-thinking—a "digital fortress" for infrastructure and research data. 

We utilize a **Glassmorphic / Modern** aesthetic that blends the transparency of cloud-native systems with the structural rigidity of enterprise software. The UI should evoke a sense of deep-space scanning, cryptographic security, and scientific rigor. High-trust is established through technical clarity, generous whitespace in body text, and sharp, monospaced data visualization.

## Colors

The palette is anchored by "Cyber Purple"—a gradient spanning from **Electric Indigo (#6366F1)** to **Deep Space Blue (#1E1B4B)**. This core gradient represents the flow of data and energy within the infrastructure.

For the default **Dark Mode**, we use a base of Slate-950 (#020617) to provide maximum contrast for neon accents. **Light Mode** utilizes a crisp Slate-50 (#F8FAFC) for a professional, document-centric feel.

The status palette is optimized for accessibility:
- **Verified/Safe:** Emerald green, signifying a "clear path."
- **Pending/Warning:** High-visibility Amber.
- **Risk/Plagiarism:** Rose red, providing a sharp alert contrast against the indigo/navy background.

## Typography

This design system uses a tri-font hierarchy to balance approachability, readability, and technicality.

1.  **Plus Jakarta Sans** is used for all primary headings. Its geometric construction provides a modern, cloud-native feel that remains friendly and open.
2.  **Inter** is the workhorse for body copy and long-form research text. It is set with a generous line-height (1.6) to ensure maximum readability during deep analysis.
3.  **JetBrains Mono** is reserved for technical data, cryptographic keys, metadata labels, and metrics. This monospaced accent reinforces the "scientific/technical" nature of the product.

## Layout & Spacing

The design system utilizes a **12-column fluid grid** for dashboard views and a **fixed-center grid** (max-width 1440px) for marketing and content-heavy pages. 

The spacing rhythm is built on an **8px base unit**. Dashboards should feel dense but organized, utilizing 24px gutters to separate complex data modules. On mobile, margins shrink to 16px, and multi-column cards reflow into a single-column stack. Content-heavy research pages should utilize a narrower 8-column central span to maintain an optimal line length for the Inter body font.

## Elevation & Depth

We rely on **Glassmorphism** to convey depth rather than traditional drop shadows. Layers are defined by their backdrop-blur (12px to 20px) and semi-transparent fills.

- **Level 1 (Base):** Solid navy background.
- **Level 2 (Cards/Modules):** 40% opacity fill with a 1px "inner-glow" border (white at 10% opacity) to catch the light.
- **Level 3 (Modals/Menus):** 70% opacity fill with a more pronounced backdrop blur and a subtle outer glow using the Primary color (indigo) at very low opacity.

This approach creates a sense of "illuminated glass," suggesting that the UI is a digital overlay sitting atop a deep infrastructure layer.

## Shapes

The shape language is **"Modern Geometric."** We use a `roundedness` level of **2**, which translates to 0.5rem (8px) for standard components. This provides a balance between the "friendliness" of rounded corners and the "precision" of sharp angles.

Interactive elements like buttons and input fields use the base 8px radius. Larger containers and cards can scale up to 1.5rem (24px) to create a more distinct container for complex data. Cryptographic badges and status chips may use pill-shaped (full-round) geometry to differentiate them from actionable UI components.

## Components

### Glassmorphic Cards
Cards are the primary container. They must feature a `1px` stroke using a linear gradient (top-left to bottom-right) from `rgba(255,255,255,0.2)` to `transparent`.

### Mega Menu
Designed for dual-pathway navigation (B2B/Infrastructure vs. Academic/Integrity). Use large icon-set descriptors and clear typography hierarchy to separate role-based tools.

### ROI & Cost Sliders
Interactive sliders should use a thick track with the "Cyber Purple" gradient. The "handle" or "thumb" should be a large, glowing white circle with a subtle primary-color drop shadow to signify high interactivity.

### Cryptographic Badges
Verification badges (Shield/Lock) should use JetBrains Mono for the associated hash or ID string. The icons should be SVG paths with a "pulsing" subtle outer glow when the status is "Verified."

### Heatmap Indicators
Research metrics use a heatmap scale from Slate-900 (low activity/risk) to Electric Indigo (high activity) to Emerald (high integrity). Avoid harsh red-to-green scales unless specifically marking Plagiarism/Risk.

### Inputs & Buttons
- **Primary Button:** Solid Electric Indigo gradient with white text.
- **Secondary Button:** Ghost style with the 1px glass border.
- **Input Fields:** Dark background with a focus state that "illuminates" the border using the indigo primary color. Use JetBrains Mono for the input text.
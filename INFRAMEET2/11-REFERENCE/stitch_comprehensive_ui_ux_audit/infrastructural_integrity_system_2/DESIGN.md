---
name: Infrastructural Integrity System
colors:
  surface: '#15121b'
  surface-dim: '#15121b'
  surface-bright: '#3c3742'
  surface-container-lowest: '#100d16'
  surface-container-low: '#1d1a24'
  surface-container: '#221e28'
  surface-container-high: '#2c2833'
  surface-container-highest: '#37333e'
  on-surface: '#e8dfee'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#e8dfee'
  inverse-on-surface: '#332f39'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#bec6e0'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#ffb784'
  on-tertiary: '#4f2500'
  tertiary-container: '#a15100'
  on-tertiary-container: '#ffe0cd'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb784'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#713700'
  background: '#15121b'
  on-background: '#e8dfee'
  surface-variant: '#37333e'
  cyber-purple: '#7C3AED'
  deep-space-blue: '#020617'
  trust-green: '#10B981'
  trust-blue: '#3B82F6'
  surface-dark: '#0F172A'
  surface-light: '#F8FAFC'
  text-light-primary: '#0F172A'
  text-light-secondary: '#475569'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 3.5rem
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.5rem
    fontWeight: '700'
    lineHeight: '1.2'
  body-base:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '400'
    lineHeight: '1.6'
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: '1.5'
  data-mono-lg:
    fontFamily: JetBrains Mono
    fontSize: 1rem
    fontWeight: '500'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1280px
---

## Brand & Style

The brand persona is that of a **Technical Expert Mentor**—transitioning from a defensive "police" stance to a proactive, authoritative infrastructure provider. The system prioritizes transparency, academic integrity, and cloud-native reliability.

The design style is **Corporate Modern with a technical "Cyber" edge**. It utilizes high-fidelity technical credibility through crisp borders, modular layouts, and "Science & Technology" aesthetics. The UI must feel "decision-ready," emphasizing data density and functional utility over decorative elements. Visual trust is reinforced through "Cryptographic Verification" motifs and a structured, systematic approach to information hierarchy.

## Colors

The design system defaults to a **Dark Mode** ("Cyber Purple") to reinforce its serverless and cloud-native positioning. 

- **Dark Mode:** Uses `Deep Space Blue` for the primary canvas, with `Cyber Purple` as the high-energy brand accent. Surfaces utilize subtle shifts in saturation to create hierarchy.
- **Light Mode:** A "High-Authority" variant. It uses `Surface Light` (off-white/gray) for the canvas to maintain a clean, institutional feel, while preserving brand authority through deep `Cyber Purple` accents and high-contrast `Deep Space Blue` for typography.

Functional colors like `Trust Green` and `Trust Blue` are reserved exclusively for cryptographic verification badges and architecture status indicators.

## Typography

This system employs a dual-font strategy to balance approachability with technical precision:
1. **Plus Jakarta Sans:** Used for all prose, headings, and UI labels to ensure the "Expert Mentor" persona feels modern and accessible.
2. **JetBrains Mono:** Used for technical snippets, ROI calculations, statistics, and data-heavy tables.

**Typography Resizer Support:**
Tokens are structured to allow a global multiplier. The "Base" scale is defined above. For "Large" (+15%) and "Extra Large" (+30%), the `fontSize` and `lineHeight` values scale proportionally while maintaining the same `fontWeight` to ensure readability and prevent layout breaks.

## Layout & Spacing

The layout model is a **12-column Fluid Grid** with a fixed maximum container width for desktop readability. 

- **Search-First UX:** The primary interface utilizes "Dead Center" placement for critical inputs with generous white space (80px+ vertical padding) to focus user intent.
- **Decision-Ready Density:** Content modules (Directory Cards, Insights) use a strict 4px baseline grid to keep data-heavy layouts organized.
- **Accessibility Integration:** The **Night/Light Toggle** and **Font Resizer** are housed in a **Sticky Accessibility FAB** (Floating Action Button) positioned at the bottom-right of the viewport. This ensures controls are persistent without cluttering the primary technical navigation.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Subtle Glows** rather than heavy shadows.
- **Base Layer:** Deep Space Blue (Dark) / Surface Light (Light).
- **Elevated Layer:** A slightly lighter/darker surface tint with a 1px "Technical Stroke" (0.1 opacity) to define boundaries.
- **Active State:** A soft `Cyber Purple` outer glow (8px blur, 0.2 opacity) to indicate focus or interactivity.
- **Shortlist Drawer:** Uses a backdrop-blur (12px) to partially obscure the background, maintaining context while focusing on the drawer's content.

## Shapes

The system uses **Soft (0.25rem)** roundedness for standard UI elements (inputs, buttons, cards) to maintain a professional, architectural feel. 

**Exceptions:**
- **Verification Badges:** Utilize a "Cryptographic" hexagonal shape to differentiate verified status from interactive buttons.
- **Accessibility Controls:** The sticky FAB and its internal toggles use **Pill-shaped (3)** roundedness to clearly mark them as "Utility" rather than "Content" elements.

## Components

- **Buttons:** Primary buttons use a solid `Cyber Purple` fill. Secondary buttons use a "Ghost" style with a 1.5px stroke and `JetBrains Mono` for text to emphasize technicality.
- **Accessibility Toggle (The "Integrity Hub"):** A persistent floating component. It features a simple moon/sun icon for theme switching and a segmented controller for Typography Scaling (A / A+ / A++).
- **Directory Cards:** Clean containers with minimal padding. Numerical data within cards must use `JetBrains Mono`.
- **Status Badges:** Cryptographic hexagonal icons. Verified experts get a `Trust Green` border; infrastructure diagrams use `Trust Blue` for active nodes.
- **ROI Calculators:** Elevated interactive widgets with "squishy" micro-interactions on sliders and smooth statistical transitions for number updates.
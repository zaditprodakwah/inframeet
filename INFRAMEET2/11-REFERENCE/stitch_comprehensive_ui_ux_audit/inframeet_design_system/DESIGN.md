---
name: InfraMeet Design System
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d8'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#918fa1'
  outline-variant: '#464555'
  surface-tint: '#c3c0ff'
  primary: '#c3c0ff'
  on-primary: '#1d00a5'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#4d44e3'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-bold:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: '0'
  stat-lg:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '900'
    lineHeight: 40px
    letterSpacing: -0.02em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '800'
    lineHeight: 14px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is anchored in a "Cyber Purple" aesthetic that merges deep-tech precision with cryptographic trust. It avoids soft, generic consumer aesthetics in favor of a disciplined, blueprint-like grid system. The brand evokes the feeling of a modern, secure web-terminal—bulletproof, high-speed, and authoritative.

### Design Movement: Technical Glassmorphism
This design system utilizes a hybrid of **Glassmorphism** and **Corporate Modernism**. 
- **Dark Mode (Primary):** An immersive "Tech Lab" environment using deep slate-black canvases, semi-transparent indigo-tinted glass surfaces, and vivid neon accents.
- **Light Mode:** A clean "Corporate Integrity" aesthetic using high-contrast slate-gray canvases and precise gridlines.

### Emotional Response
The UI should feel **structured, transparent, and secure**. It communicates precision through hairline borders, technical monospace data points, and sophisticated backdrop blurs that suggest depth and layered security.

## Colors

The palette is functionally driven, prioritizing legibility and status communication.

### Brand Accents
- **Primary (Trust Anchor Indigo):** `#4F46E5`. Used for core CTAs and primary identifiers. In dark mode, this expands into a neon glow (`#6366F1`).
- **Secondary (Cyber Purple):** `#8B5CF6`. Used for premium interactions and accessibility highlights.
- **Tertiary (Success Emerald):** `#10B981`. Reserved for verified nodes and digital signatures.

### Functional States
- **Pending/Audit:** `#F59E0B` (Amber Gold).
- **Error/Expired:** `#F43F5E` (Rose Red).

### Surface Strategy
In dark mode, surfaces utilize a "Glass Surface" (`rgba(9, 13, 31, 0.65)`) with a **12px backdrop blur**. Light mode uses a frosted white surface (`rgba(255, 255, 255, 0.7)`).

## Typography

The system employs two distinct engines: a geometric humanist sans-serif for narrative and a sharp monospace for technical truth.

- **Headlines:** Use **Plus Jakarta Sans** for a modern, high-performance engineering feel.
- **Body:** Use **Inter** for maximum readability across dense data sets.
- **Technical/Stats:** Use **JetBrains Mono** for all numeric statistics, timestamps, and system state readouts.

### Accessibility Features
The system supports fluid scaling via `rem` units. 
- **Font Resizing:** Users can toggle between scale steps (87.5% to 137.5%).
- **Serif Override:** A system-wide toggle replaces all fonts with a Serif stack (`Georgia`, `Times New Roman`) for users with specific reading preferences.

## Layout & Spacing

This design system uses a **fixed-fluid hybrid grid** model based on a **4px base unit**.

### Layout Philosophy
- **Border-Led Dividers:** Instead of shadows, use hairline borders (`1px`) to define the structure, matching the blueprint theme.
- **Rhythmic Spacing:** Standardize on 16px (`md`) for component gaps and 24px-32px (`lg-xl`) for internal card padding to allow data to "breathe."
- **Responsive Adaptation:** On mobile, layouts transition to a stacked single-column view with a fixed **MobileBottomNav** for thumb-accessible navigation. Desktop layouts utilize multi-column flex containers with 32px margins.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** and **Glassmorphism** rather than traditional high-offset shadows.

- **Stacking Logic:** Backgrounds are ultra-dark (`#020617`). Cards sit on top using semi-transparent surfaces with a `12px` backdrop blur.
- **Shadows:** Use **Ambient Glowing Shadows**. Instead of black shadows, use tinted glows (e.g., `rgba(99, 102, 241, 0.15)`) to simulate light emanating from high-energy technical components.
- **Interaction Depth:** On hover, elements should translate `-2px` vertically and increase their border opacity and glow intensity.
- **High-Contrast Mode:** A system override strips all blurs and gradients, forcing pure solid `#000000` and `#FFFFFF` with `1px` solid borders for maximum accessibility.

## Shapes

The design uses a **Rounded** (Level 2) shape language to soften the technical precision of the grid.

- **Standard Elements:** Cards and primary containers use `rounded-xl` (1.5rem) or `rounded-lg` (1rem).
- **Technical Elements:** Inputs and small system buttons use `rounded-md` (0.75rem) to maintain a tighter, more "engineered" look.
- **Status Chips:** Use `rounded-full` for a pill-shaped distinction from structural boxes.

## Components

### Buttons
- **Primary (Cyber-Glow):** Multi-color gradient (`from-indigo-600 to-violet-600`), bold uppercase **JetBrains Mono** text at `10px`, and a signature indigo glow shadow.
- **Secondary (Technical):** Slate-900 background with a 1px slate-850 border. Uppercase monospace typography.

### Inputs & Forms
- **Fields:** Dark backgrounds (`#020617`) with slate-850 borders. Small monospace text (`text-xs`).
- **Labels:** Always placed above the input. Use `label-caps` style: bold, uppercase, 10px, monospace, with wide tracking.
- **Focus State:** Trigger a `1px` purple-indigo glowing border.

### Cards
- **Glass Cards:** 1px hairline border (`rgba(255, 255, 255, 0.08)`), `12px` backdrop blur, and internal padding of 24px.
- **Metrics:** Pair a large `stat-lg` number on the right with a `label-caps` title on the left.

### Accessibility Hub
- A floating widget providing real-time controls for theme switching, font scaling (A-/A+), and the Serif/High-Contrast toggles. Styled as a premium glassmorphic overlay.
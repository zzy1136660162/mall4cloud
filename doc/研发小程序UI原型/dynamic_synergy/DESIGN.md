---
name: Dynamic Synergy
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#424754'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#4648d4'
  on-tertiary: '#ffffff'
  tertiary-container: '#6063ee'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
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
  base: 4px
  container-padding: 16px
  stack-gap: 12px
  section-margin: 24px
  gutter: 12px
---

## Brand & Style

This design system shifts the "Industrial Collaboration" narrative from rigid precision to **Dynamic Innovation and Efficient Synergy**. Targeted at ecosystem partners, the visual language balances professional reliability with the approachability of a modern digital workspace.

The style leverages **Modern Minimalism with a hint of Glassmorphism** to ensure the interface feels breathable and forward-thinking. By utilizing generous whitespace, semi-transparent overlays, and vibrant accents, the UI moves away from heavy industrial aesthetics toward a lightweight, mobile-first experience that invites participation and reduces cognitive load during complex collaborative tasks.

## Colors

The palette is anchored by **Vitality Blue (#3B82F6)**, a high-energy primary hue that drives the core action and brand identity. **Innovation Green (#10B981)** is reserved for success states and critical progression points, symbolizing growth and positive results.

To achieve the requested "transparency," the background strategy uses a soft light-gray base with subtle indigo tints in the neutrals to prevent a "flat" institutional feel. Secondary actions and supportive icons may use a soft indigo to maintain the vibrant spectrum without clashing with the primary blue.

## Typography

The typographic scale prioritizes **"Breathing Room."** By using **Plus Jakarta Sans** for headings, the design system gains a friendly, geometric personality. **Work Sans** provides a grounded, highly legible experience for long-form data and body text.

To maintain the industrial heritage in a modern way, **JetBrains Mono** is used sparingly for labels, status codes, and data points, providing a "technical yet clean" accent. Increased line heights (1.5x - 1.6x for body text) are mandatory to ensure the UI feels spacious and less cluttered on small mobile screens.

## Layout & Spacing

The layout follows a **Fluid Mobile-First Grid**. On mobile devices, a standard 16px side margin is maintained, while internal card components use a 12px gutter. 

Spacing is used to create "logical clusters." Instead of using heavy dividers, the system relies on varying the vertical rhythm (using 24px increments between sections and 12px within sections) to guide the eye. This creates a sense of openness and prevents the "boxed-in" feeling typical of older industrial dashboards.

## Elevation & Depth

Depth is achieved through **Soft Ambient Shadows and Tonal Layering** rather than harsh outlines. Surfaces use a "Surface-over-Surface" approach:
- **Level 0 (Background):** #F8FAFC (Subtle tint).
- **Level 1 (Cards/Containers):** Solid White (#FFFFFF) with a very soft, diffused 10% opacity blue-tinted shadow (y: 4px, blur: 12px).
- **Level 2 (Overlays/Modals):** Glassmorphism effect—Backdrop filter blur (10px) with 80% opacity white fill.

This approach creates a sense of "lightness," making the interface feel like a series of floating, interactive panels.

## Shapes

In alignment with the `ROUND_TWELVE` (12px) requirement, the shape language is distinctly friendly. 
- **Standard Cards & Buttons:** 12px (rounded-lg).
- **Large Containers/Modals:** 24px (rounded-xl).
- **Input Fields:** 8px (rounded-md) to maintain some structural alignment.

The large radii eliminate visual tension, reinforcing the theme of "Collaboration and Ease of Use."

## Components

### Buttons
- **Primary:** Vitality Blue background with white text. High-contrast, 12px rounded corners.
- **Secondary (Action):** Innovation Green for "Approve" or "Complete" tasks.
- **Ghost:** Transparent background with Blue border; used for secondary navigation to maintain "breathability."

### Cards
Cards should not have borders. Use the Level 1 shadow and 12px corner radius. Content inside cards should have at least 16px of internal padding.

### Input Fields
Soft gray backgrounds (#F1F5F9) instead of white backgrounds with borders. This makes the form feel more "integrated" into the page. On focus, the field transitions to a white background with a 2px Vitality Blue border.

### Status Chips
Use "Pill-shaped" (full round) geometry. Backgrounds should be highly desaturated (10% opacity) versions of the status color (e.g., 10% Innovation Green for "Success") with high-saturation text of the same color for maximum legibility and a modern, airy look.

### Navigation (Mini Program)
Bottom tab bars should utilize a subtle backdrop-blur (glassmorphism) to allow the content to peek through, enhancing the feeling of depth and transparency.
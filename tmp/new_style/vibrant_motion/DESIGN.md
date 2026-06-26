---
name: Vibrant Motion
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#e4bdc3'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#ab888e'
  outline-variant: '#5b3f44'
  surface-tint: '#ffb1c0'
  primary: '#ffb1c0'
  on-primary: '#660029'
  primary-container: '#ff4c83'
  on-primary-container: '#5a0023'
  inverse-primary: '#bc0051'
  secondary: '#8fd8ff'
  on-secondary: '#003548'
  secondary-container: '#00c1fd'
  on-secondary-container: '#004b65'
  tertiary: '#60df72'
  on-tertiary: '#00390f'
  tertiary-container: '#1ba741'
  on-tertiary-container: '#00320c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffd9df'
  primary-fixed-dim: '#ffb1c0'
  on-primary-fixed: '#3f0017'
  on-primary-fixed-variant: '#90003d'
  secondary-fixed: '#c2e8ff'
  secondary-fixed-dim: '#75d1ff'
  on-secondary-fixed: '#001e2b'
  on-secondary-fixed-variant: '#004d67'
  tertiary-fixed: '#7efd8b'
  tertiary-fixed-dim: '#60df72'
  on-tertiary-fixed: '#002106'
  on-tertiary-fixed-variant: '#00531a'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  title-sm:
    fontFamily: Sora
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.4'
    letterSpacing: 0.1em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

This design system embodies the high-energy and professional atmosphere of a premier dance academy. It balances the sultry, fluid nature of Bachata Sensual with the rigorous discipline of professional mentorship. 

The visual style is **Corporate Modern with a Neon Edge**. It utilizes a deep, layered dark mode to create a premium "stage-like" environment where vibrant accents can shine. The aesthetic is sharp, precise, and energetic, moving away from oversized elements toward a sophisticated, compact UI that maximizes information density without sacrificing elegance.

**Key Principles:**
- **Kinetic Energy:** Use of italics and bold weights to suggest movement.
- **Precision:** Tight spacing and aligned grids reflecting technical dance mastery.
- **Depth:** Layered dark surfaces that mimic a spotlight on a stage.

## Colors

The palette is optimized for a high-contrast dark environment. 

- **Primary (Electric Pink):** Reserved for primary actions, active navigation states, and brand highlights. 
- **Secondary (Cyan Blue):** Used for data visualization, secondary stats, and distinguishing gender-neutral or alternative data points.
- **Neutrals:** A range of cool-toned greys facilitate hierarchy within the dark UI.
- **Layering Logic:** 
    - `Base`: The main background.
    - `Level 1`: Large cards and navigation bars.
    - `Level 2`: Inset elements, list items, and hover states.
    - `Level 3`: Active states for small components or tooltips.

## Typography

The typography strategy pairs expressive, italicized display fonts with a highly functional sans-serif for UI clarity.

- **Headlines:** Use **Sora** with a heavy weight and italic styling to convey the "flow" and energy of dance. Use uppercase sparingly for section labels to maintain a professional tone.
- **Body & UI:** Use **Inter** for all functional text. It provides exceptional legibility at small sizes, which is critical for the compact layout.
- **Scaling:** For mobile devices, `display-lg` should scale down to 32px and `headline-lg` to 24px to ensure headers do not dominate the viewport.

## Layout & Spacing

The system uses a **4px base grid** to achieve a dense, "pro-app" feel. 

- **Navbar:** A slim 56px sticky bar on desktop, reduced to 48px on mobile. 
- **Grid System:** 
    - **Desktop:** 12-column fluid grid with 16px gutters. Stats cards should span 3 columns (4 per row).
    - **Mobile:** 4-column grid with 16px gutters. Most elements reflow to full-width or side-scrolling containers.
- **Compactness:** Vertical padding in list items and cards is aggressively tightened (typically 12px-16px) to maximize visible items on the dashboard.

## Elevation & Depth

Hierarchy is established through color luminosity and subtle borders rather than heavy shadows.

- **Surface Tiers:** Higher elevation is represented by lighter shades of the background (`surface_level_2`).
- **Outlines:** Use 1px solid borders in `surface_level_3` for cards to define boundaries without adding visual bulk.
- **Active Glow:** Interactive elements (like the primary button) use a subtle, 8px outer glow of the primary color (opacity 20%) to indicate focus/activity.
- **Backdrop Blur:** The sticky navbar uses a 12px blur effect with a semi-transparent `surface_level_1` background (80% opacity) to maintain context while scrolling.

## Shapes

The shape language is **Soft** but disciplined. 

- **Small Components:** Checkboxes and small tags use a 4px (0.25rem) radius.
- **Standard UI:** Buttons, input fields, and list items use an 8px (0.5rem) radius.
- **Large Containers:** Main dashboard cards use a 12px (0.75rem) radius to feel approachable yet structured.
- **Pill Factor:** Use full pill-shaped rounding (999px) only for status chips and icon-only floating buttons.

## Components

### Buttons
- **Primary:** Solid `#FF2D78` with white or near-black text. Height: 36px (Compact) or 44px (Standard).
- **Ghost:** Transparent background with a `surface_level_3` border. 
- **Tabs:** Segmented control style with a sliding background highlight.

### Cards & Stats
- **Stats Card:** Minimal padding (16px). Icon in top-left, large number in center, and trend/label at the bottom.
- **Border Treatment:** Use a subtle gradient border (Primary to Secondary) for "Featured" or "Active" items.

### List Items
- **Structure:** Horizontal layout with a 32px square avatar/icon on the left, primary text and subtext in the middle, and actions (View/Delete) on the right.
- **Hover:** Shift background from `base` to `surface_level_2`.

### Input Fields
- **Compact Styling:** 40px height, `surface_level_2` background, 1px border. Focus state changes border to Primary color with a 2px inner glow.

### Navigation Bar
- **Slim Sticky:** Height 56px. Logo on the left, horizontal nav links in the center, and user profile/logout on the right. Icons should be 20px for a refined look.
---
name: Oro y Negro Premium
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#eac249'
  on-secondary: '#3d2f00'
  secondary-container: '#b08c10'
  on-secondary-container: '#352800'
  tertiary: '#e2ce84'
  on-tertiary: '#3a3000'
  tertiary-container: '#c5b26b'
  on-tertiary-container: '#514406'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#ffe08b'
  secondary-fixed-dim: '#eac249'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#584400'
  tertiary-fixed: '#f7e296'
  tertiary-fixed-dim: '#dac67d'
  on-tertiary-fixed: '#221b00'
  on-tertiary-fixed-variant: '#534608'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
typography:
  headline-xl:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Sora
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Sora
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Sora
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Sora
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system is built upon a foundation of absolute luxury, prestige, and exclusivity. It targets a high-end audience that values craftsmanship, heritage, and modern sophistication. By pivoting from a vibrant motion aesthetic to a "Gold and Black" palette, the UI transitions from energetic to authoritative.

The style is a blend of **Minimalism** and **Glassmorphism**, utilizing deep, light-absorbing blacks contrasted against reflective metallic accents. The emotional response is one of trust, high-net-worth quality, and timeless elegance. Every interface element should feel like a physical luxury good—heavy, polished, and meticulously finished.

## Colors

The palette is strictly curated to evoke the "Oro y Negro" aesthetic.

- **Primary Gold (#D4AF37):** The standard metallic gold used for primary actions and brand identifiers.
- **Deep Gold (#C5A028):** Used for hover states and depth within gradients.
- **Champagne Highlight (#F9E498):** Used for shimmering effects, top-down lighting on components, and active interactive states.
- **The Void (#000000):** The primary background color to ensure maximum contrast and "pop" for the gold elements.
- **Midnight Navy (#051424):** Reserved for secondary surfaces, containers, and card backgrounds to provide subtle depth against the absolute black.

## Typography

This design system utilizes **Sora** to maintain its geometric precision while elevating it through specific styling.

- **Headlines:** Use tighter letter-spacing and heavier weights to create a sense of structural permanence.
- **Labels:** Small labels and captions should utilize uppercase styling with increased letter spacing to mimic the typography of luxury watchmaking and high-fashion branding.
- **Body Text:** Maintain generous line heights to ensure the dense black backgrounds remain legible and breathable.
- **Color Application:** Primary headlines may occasionally use the gold gradient for a "foil" effect, while body text should remain an off-white or light grey (e.g., #E0E0E0) to preserve readability.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model on desktop to enforce a sense of controlled, curated content.

- **Symmetry:** Layouts should prioritize centered compositions or perfectly balanced asymmetrical grids.
- **Whitespace:** Use "Luxury Whitespace" (in this case, "Blackspace"). Increase margins between sections (80px - 120px) to allow components to breathe and feel more like artifacts in a gallery.
- **Responsive Behavior:** On mobile, margins shrink to 16px, and multi-column grids collapse into a single column, ensuring the gold accents remain the focal point without overwhelming the small screen.

## Elevation & Depth

In this design system, depth is achieved through **Tonal Layers** and **Metallic Sheen** rather than traditional drop shadows.

- **Surfaces:** Level 0 is Absolute Black (#000000). Level 1 (Cards/Modals) is Midnight Navy (#051424).
- **Outlines:** Instead of shadows, use "Gold Filigree" borders—1px solid strokes using the Primary Gold at 20-40% opacity.
- **Glow:** For high-priority interactive elements, a very soft, diffused gold outer glow (color-burn or screen blend mode) can be used to simulate light reflecting off a polished metal surface.
- **Glass:** Modals should use a heavy backdrop blur (20px+) with a 10% opaque gold tint to create a "Smoked Gold" glass effect.

## Shapes

The design system adopts **Soft (0.25rem)** roundedness to maintain a sharp, professional, and architectural feel.

While rounded corners provide a modern touch, they are kept minimal to avoid appearing too "bubbly" or consumer-grade. The goal is to mimic the precision-cut edges of jewelry or premium electronics. Large containers like cards use `rounded-lg` (0.5rem) to subtly soften the layout without losing the "Oro y Negro" edge.

## Components

### Buttons
- **Primary:** Filled with the gold gradient (`accent_gradient`). Text is Absolute Black (#000000) for maximum legibility.
- **Secondary:** Transparent background with a 1.5px Primary Gold border and Gold text.
- **Hover States:** Primary buttons should shift to the Champagne Highlight (#F9E498) or increase in brightness. Secondary buttons should gain a subtle 10% gold background fill.

### Input Fields
- Dark backgrounds (#051424) with a subtle bottom-border in gold. On focus, the border becomes the full gold gradient and the label moves to a floating position in Primary Gold.

### Cards
- Use Midnight Navy backgrounds. Borders are 1px thick at 20% gold opacity. Headlines within cards are always bold.

### Chips & Tags
- Pill-shaped with a 1px Gold border. Text is set in `label-sm` uppercase.

### Interactive Elements
- **Checkboxes/Radios:** When active, they are filled with Gold.
- **Lists:** Selection states use a "Gold Bar" indicator (2px wide) on the left side of the list item, with the background shifting to a subtle navy-gold tint.
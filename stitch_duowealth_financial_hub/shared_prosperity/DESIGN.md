---
name: Shared Prosperity
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
  on-surface-variant: '#bbcabf'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#d0bcff'
  on-tertiary: '#3c0091'
  tertiary-container: '#b090ff'
  on-tertiary-container: '#4600a7'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is engineered for a high-trust, collaborative financial environment. It centers on the concept of "Shared Clarity," providing couples with a transparent and sophisticated lens through which to view their collective wealth. 

The aesthetic is **Modern Corporate with Glassmorphism accents**. It prioritizes data density without sacrificing legibility. The mood is calm, secure, and precise—utilizing a deep dark-mode foundation to reduce eye strain during evening budget reviews. Subtle translucency and blurred layers are used sparingly to denote depth and modern sophistication, ensuring the interface feels like a premium tool rather than a generic spreadsheet.

## Colors
The palette is rooted in a "Deep Slate" ecosystem to establish an environment of security and permanence. 

- **Primary (Mint Green):** Used exclusively for growth, success, positive balances, and primary calls to action. It provides a high-contrast pop against the dark background.
- **Secondary (Action Blue):** Reserved for interactive elements that are not "final" actions, such as navigation, filtering, or secondary buttons.
- **Surface & Borders:** We use a strict hierarchy of Slates. The background is the darkest layer, with surfaces sitting slightly lighter to create a natural sense of elevation. Borders are crisp and low-opacity to define structure without adding visual noise.

## Typography
This design system utilizes **Inter** for all UI and narrative elements due to its exceptional legibility and neutral, professional character. For financial figures, transaction IDs, and data points, we introduce **JetBrains Mono** to provide a technical, "monitored" feel that ensures numbers align perfectly in tables and lists.

- **Headlines:** Use tight letter spacing and bold weights to convey strength.
- **Financial Figures:** Always use the `label` roles to ensure clarity between currency symbols and numerical values.
- **Hierarchy:** Use color (Slate 400 vs White) rather than just size to distinguish between labels and primary data.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a 12-column structure for desktop and a 4-column structure for mobile. 

- **Rhythm:** All spacing is derived from a 4px base unit. 
- **Density:** Financial dashboards require high information density. Use `stack-sm` for related data points (e.g., a label and its value) and `stack-lg` to separate distinct functional sections.
- **Alignment:** Content should be strictly aligned to the grid to maintain a "data-driven" and organized aesthetic. Use generous horizontal margins on desktop to prevent data lines from becoming too long and unreadable.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Glassmorphism**. 

1. **Base:** Slate 900 (#0F172A).
2. **Surface:** Slate 800 (#1E293B) with a 1px solid border of Slate 700.
3. **Overlay/Glass:** For modals and dropdowns, use a semi-transparent Slate 800 (80% opacity) with a 20px Backdrop Blur and a subtle inner glow (white at 5% opacity).

**Shadows:** Shadows are rarely used. When necessary for high-priority modals, use a large, 40px blur with 30% opacity, tinted with the Primary Mint Green to create a "glow" effect rather than a traditional drop shadow.

## Shapes
The shape language is **Soft and Precise**. 

We avoid overly rounded "bubbly" corners to maintain a professional, banking-grade appearance. Standard components use a `0.25rem` (4px) radius. Larger containers like Dashboard Cards use `0.5rem` (8px). This subtle rounding provides a modern touch while keeping the interface feeling structured and serious. Interactive elements like buttons should never be fully pill-shaped; they must maintain the standard `0.25rem` radius for consistency.

## Components

- **Buttons:** Primary buttons are solid Mint Green with Dark Slate text. Secondary buttons are ghost-style with a Slate 700 border. 
- **Cards:** Cards are the primary container. They feature a Slate 800 background, a 1px Slate 700 border, and no shadow. For "Active" or "Highlighted" cards, use a subtle Mint Green top-border (2px).
- **Progress Bars:** Use a thick 8px track. The background track is Slate 700, and the fill is a gradient from Blue to Mint Green to visualize "completion" or "health."
- **Input Fields:** Fields are dark (Slate 900) with a Slate 700 border. Upon focus, the border transitions to Mint Green with a subtle outer glow.
- **Tabs:** Use a "Segmented Control" style. The container is Slate 900, and the active tab is a raised Slate 800 surface with White text.
- **Chips/Badges:** Small, high-contrast labels for categories. Use low-opacity fills of the primary/secondary colors (e.g., Mint Green at 10% opacity) with solid text of the same color for maximum readability.
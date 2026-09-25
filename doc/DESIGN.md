# SmartSender Extension UI/UX Redesign

## Goal
Improve the extension's interface to look modern, premium, and seamless. The UI should prioritize user efficiency with a high-end glassmorphism aesthetic suitable for professional dashboard environments.

## Typography
- **Primary Font**: `Inter` or `Outfit` (sans-serif, highly legible).
- **Scale**:
  - Headers/Titles: 16px - 24px, Font Weight 600-700
  - Body/Inputs: 14px, Font Weight 400-500
  - Labels/Badges: 11px - 12px, Font Weight 600, uppercase for badges

## Color Palette (Dark Theme Default)
- **Backgrounds**: 
  - Main Panel: `#1c1c1e` with 70% opacity + background blur (glassmorphism).
  - Component Backgrounds (Cards/Inputs): `#2c2c2e` with 60% opacity.
- **Borders**: Subtle `#ffffff` at 10% opacity.
- **Text**:
  - High Emphasis: `#ffffff`
  - Medium Emphasis: `#ebebf5` (opacity 60%)
  - Low Emphasis: `#ebebf5` (opacity 30%)
- **Accents**: 
  - Primary Action (Blue): `#0a84ff`
  - Hover State for Primary: `#007aff`
  - Success (Green): `#30d158`
  - Warning/Error (Red): `#ff453a`

## Layout & Components
- **Spacing**: Use a baseline grid of 4px/8px. Increased padding around elements (12px padding for cards, 8px gap between buttons) to prevent a cluttered feeling.
- **Cards**: Variables and Contacts should be displayed in rounded cards (`border-radius: 12px`) with hover elevation.
- **Inputs & Dropdowns**:
  - Seamless borders (`border-radius: 8px`).
  - Focus state must show a glowing focus ring (e.g., `box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.4)`).
  - Triangle/caret icons for dropdowns indicating selection.
- **Buttons**:
  - Icon buttons should be perfectly square or circular (`border-radius: 8px`).
  - Hover states should include micro-animations (e.g., scale up by `1.05` or subtle background lightening).
- **Feedback & Validation**:
  - Form validation states should clearly highlight the specific failing input field with a red border.
  - Success toasts should animate in from the top/bottom smoothly.

## Interaction & Motion
- **Transitions**: 0.2s ease-in-out for color and background changes. 0.3s cubic-bezier for panel slides.
- **Hover**: All clickable elements must react on hover (color change, slight lift, or opacity shift).
- **Focus**: Accessibility is key. Keyboard navigation should be obvious via focus rings.

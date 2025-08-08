# UI Component Library

A collection of reusable UI components with a dark, neon-themed design system.

## Theme System

### Color Palette

The theme uses a dark background with vibrant neon accents:

- **Dark Colors**: Background and surface colors for depth
  - `dark-bg`: #0f0f23 - Main background
  - `dark-surface`: #1a1b3a - Elevated surfaces
  - `dark-hover`: #262648 - Hover states
  - `dark-border`: #2d2e5f - Borders
  - `dark-text`: #e1e1e3 - Primary text
  - `dark-muted`: #9ca3af - Secondary text

- **Accent Colors**: Primary interactions
  - `accent-primary`: #7c3aed - Primary purple
  - `accent-hover`: #6d28d9 - Darker purple for hover
  - `accent-light`: #a78bfa - Light purple for highlights

- **Neon Colors**: Special effects and emphasis
  - `neon-blue`: #00d4ff - Bright cyan
  - `neon-purple`: #9333ea - Vibrant purple
  - `neon-pink`: #ec4899 - Hot pink

### Components

#### Button
Versatile button with multiple variants and states:
- **Variants**: primary, secondary, danger, success, ghost, neon
- **Sizes**: sm, md, lg
- **Features**: Loading states, icons, glow effects
- **Animations**: Scale on hover/click, glow animation

#### Input
Styled form input with dark theme:
- Transparent background with subtle borders
- Focus states with accent colors
- Error state styling
- Full width option

#### Form
Form wrapper with consistent spacing and styling:
- Dark surface background
- Proper spacing between form elements
- Shadow effects for depth

#### Modal
Popup modal with backdrop:
- Centered positioning
- Dark backdrop with blur
- Slide-up animation
- Close button with hover effects

#### Table
Data table with dark theme:
- Striped rows for readability
- Hover states on rows
- Responsive design
- Sorting indicators

#### LoadingSpinner
Animated loading indicator:
- Multiple sizes (sm, md, lg)
- Gradient animation
- Customizable colors

### Animations

Custom animations for enhanced UX:

- **glow**: Pulsing shadow effect for emphasis
- **slide-up**: Smooth entrance animation
- **fade-in**: Gentle opacity transition
- **pulse**: Subtle pulsing for neon elements

### Usage Examples

```tsx
// Primary button with glow
<Button variant="primary" glow>
  Save Changes
</Button>

// Neon button with icon
<Button variant="neon" leftIcon={<Icon />}>
  Connect
</Button>

// Loading state
<Button isLoading loadingText="Processing...">
  Submit
</Button>

// Form input
<Input 
  label="Email"
  type="email"
  error="Invalid email"
/>

// Modal
<Modal isOpen={open} onClose={handleClose}>
  <h2>Confirm Action</h2>
  <p>Are you sure?</p>
</Modal>
```

### Design Principles

1. **Dark-First**: All components designed for dark backgrounds
2. **High Contrast**: Clear text and interactive elements
3. **Smooth Animations**: Subtle transitions for better UX
4. **Consistent Spacing**: Uniform padding and margins
5. **Accessibility**: Focus states and keyboard navigation

### Customization

Components accept className props for additional styling:

```tsx
<Button 
  variant="primary"
  className="custom-class"
>
  Custom Button
</Button>
```

All components are built with TailwindCSS, allowing easy overrides and extensions through the config file.
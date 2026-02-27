# SKY UX Component Animation & Transition Usage Report

_Last generated: 2026-02-26_

This report catalogs all CSS animation and transition usage in `libs/components` (excluding `animations`).

---

## Shared/Reusable Animations

The theme library (`libs/components/theme`) owns central animation infrastructure consumed by components:

### Theme: `_animations.scss` mixins

#### `sky-animation-slide()` mixin

- **Mechanism:** `display: grid` / `grid-template-rows` height-collapse
- **Duration:** 150ms ease-in
- **Classes:** `.sky-animation-slide-down` (expanded), `.sky-animation-slide-up` (collapsed), `.sky-animation-disabled`
- **Consumers:** tiles/tile, lists/repeater-item, action-bars/summary-action-bar, tabs/vertical-tabset-group

#### `sky-animation-emerge()` mixin

- **Mechanism:** `opacity` + `transform: scale()` with `@starting-style` for DOM entry
- **Duration:** 300ms ease-in-out
- **Classes:** `.sky-animation-emerge-open`, `.sky-animation-emerge-closed`
- **Consumers:** toast

#### Global reduced-motion override

- `prefers-reduced-motion: reduce` collapses all `animation-duration` and `transition-duration` to `var(--sky-animation-duration-noop)` (0.01ms) — applied globally to `*, *::before, *::after`.

### Theme: Shared SCSS variables

| Variable                                 | Resolved value                                      | Consumers                                                        |
| ---------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------- |
| `$sky-transition-time-short`             | `150ms`                                             | ~10+ component SCSS files                                        |
| `$sky-transition-time-medium`            | `250ms`                                             | expansion-indicator, text-expand, flyout                         |
| `$sky-form-border-and-color-transitions` | `border-color 150ms, box-shadow 150ms, color 150ms` | input-box (×3), file-attachment, text-editor (×2), toggle-switch |

### Tabs (VerticalTabset, SectionedForm)

- **Keyframes:** `sky-vertical-tab-slide-in-left`, `sky-vertical-tab-slide-in-right`
- **Classes:** `.sky-vertical-tab-tabs-enter`, `.sky-vertical-tab-content-enter`
- **Duration:** 150ms
- **Easing:** ease-in
- **Usage:** Both components import a shared SCSS partial (`tabs/shared/_vertical-tab-animations.scss`) for slide-in tab/content animations.

---

## Component-Specific Animations

### Inline Form

- **Keyframes:** `sky-slide-dissolve-last-enter` (400ms, enter), `sky-slide-dissolve-last-leave` (200ms, leave via `.ng-leave`), `sky-slide-dissolve-first-enter` (100ms)
- **Classes:** `.sky-slide-dissolve-last` (enter), `.sky-slide-dissolve-last.ng-leave` (leave), `.sky-slide-dissolve-first` (enter)
- **Easing:** ease-in

### Indicators: Tokens

- **Keyframes:** `sky-token-enter-animation`, `sky-token-leave-animation`
- **Classes:** `.sky-token-enter`, `.sky-token-leave`
- **Duration:** 150ms (enter/leave)
- **Easing:** ease-in
- **Notes:** Uses `animation-duration: 1ms !important;` for instant transitions in some cases.

### Indicators: Wait

- **Keyframes:** `sk-bounce`
- **Classes:** Used for loading spinner
- **Duration:** 2s infinite
- **Easing:** ease-in-out
- **Notes:** Uses negative animation delay for staggered bounce.

### Forms: Form Error

- **Keyframes:** `sky-modal-error`
- **Usage:** Animation applied to `:host` for error pop-in
- **Duration:** 300ms
- **Easing:** ease-out

---

## Transition Usage (No Keyframes)

### Text Expand / Text Expand Repeater

- **Property:** `transition: max-height 250ms ease;`

### Split View

- **Property:** `transition: transform 150ms ease-in;` (applied to drawer and workspace containers via `.sky-split-view-animate` classes)
- **Notes:** Uses `@starting-style` for enter animations (drawer slides in from -100%, workspace from 100%)

### Flyout

- **Property:** `transition: transform 250ms ease-in;`
- **Notes:** Uses `@starting-style` to animate inward from `translateX(100%)` on open

### Phone Field

- **Property:** `transition: opacity 200ms ease-in;`

### Layout: Inline Delete

- **Property:** `transition: opacity 300ms ease-in-out;` (overlay), `transition: transform (scale) 300ms ease-in-out;` (content container)
- **Notes:** Uses `@starting-style` for enter animation on both opacity and scale

### Action Bars: Summary Action Bar

- **Property:** `transition-duration: 60ms;`, `transition-timing-function: ease-out;`

### Popovers: Dropdown/Popover

- **Property:** `transition: box-shadow 150ms;` (dropdown item), `transition: opacity 150ms ease-in;` (popover content)

### Lists: Repeater Item

- **Property:** `transition: box-shadow 150ms;` (row), `transition: background-color 150ms;` (selected state)

### Layout: Card

- **Property:** `transition: background-color 150ms;`

### Forms: Toggle Switch, Input Box, File Attachment

- **Property:** `transition: left 150ms;` (toggle thumb), `transition: $sky-form-border-and-color-transitions;` (border/color state changes)

### Miscellaneous

- **Help Inline:** `transition: color 150ms;`
- **Colorpicker:** `transition: none;` (override to suppress third-party transitions)
- **Text Editor:** `transition: $sky-form-border-and-color-transitions;` (border/color state changes)
- **Indicators: Expansion Indicator:** `transition: transform 250ms, left 250ms;` (`$sky-transition-time-medium`)

---

## Observations

- **Most common duration:** 150ms (for tabs, split-view, popover, etc.); `$sky-transition-time-short` = 150ms, `$sky-transition-time-medium` = 250ms
- **Easing:** `ease-in` and `ease-in-out` are most common
- **Shared patterns:** The theme's `_animations.scss` provides `sky-animation-slide()` (4 consumers) and `sky-animation-emerge()` (1 consumer currently). Tab animations use a shared SCSS partial. Most component-specific transitions use the shared timing variables but are not abstracted further.
- **`@starting-style` usage:** Split View, Flyout, Phone Field, and Inline Delete use the modern `@starting-style` CSS rule for enter animations in combination with `transition:`, avoiding the need for class toggling or JS. The `sky-animation-emerge()` mixin also uses `@starting-style`.
- **No Angular `trigger()` usage** remains; all animation is now CSS-based.
- **Transitions** are more common than keyframe animations for simple fades, color, or transform effects.
- **Standalone single-property transitions** (`box-shadow`, `background-color`, `color`) appear in multiple component SCSS files independently but already use the shared timing tokens — further abstraction would not add significant value.

---

## Recommendations

### Already well-centralized — no action needed

- `$sky-transition-time-short` / `$sky-transition-time-medium` are used consistently across components.
- `$sky-form-border-and-color-transitions` is already a shared variable for all form border/color state changes.
- `sky-animation-slide()` is adopted by 4 components and covers the expand/collapse use case cleanly.
- Global `prefers-reduced-motion` handling in `_animations.scss` covers all components automatically.

### Actionable opportunity: expand `sky-animation-emerge()` adoption

The `sky-animation-emerge()` mixin (opacity + scale + `@starting-style`) currently has only **one consumer** (toast) but was designed for reuse. Popover content uses an independent `opacity 150ms ease-in` fade that serves the same intent. Options:

1. **Align popover to the emerge spec** — switch `popover-content.component.scss` to use `sky-animation-emerge()` (accepts the 300ms duration and scale effect as the standard for overlay content appearance).
2. **Add an opacity-only variant** — add a `sky-animation-emerge-fade($duration)` overload to `_animations.scss` and have both popover and phone-field adopt it instead of their independent `opacity` transitions.

### Lower-priority: parameterize slide-in-from-side

Flyout (`translateX(100%)`, 250ms) and Split View (`translateX(-100%)`, 150ms) each define their own `@starting-style` + `transition: transform` slide-in pattern. A `sky-animation-slide-in($translate, $duration)` mixin in `_animations.scss` could unify these, but the intentional duration difference (`250ms` vs `150ms`) means this is purely a DRY/consistency win rather than a bug risk.

### Maintain

- Maintain 150ms as the standard duration for quick UI transitions.
- When adding new overlay/panel components, prefer `sky-animation-emerge()` or `sky-animation-slide()` over introducing new animation patterns.

# Migration Plan: `@angular/animations` → Native CSS

Replace `skyAnimationSlide` and `skyAnimationEmerge` triggers with native CSS transitions using class bindings.

## CSS Class Naming

- Prefix: `.sky-animation-`
- Slide: `.sky-animation-slide-down` / `.sky-animation-slide-up`
- Emerge: `.sky-animation-emerge-open` / `.sky-animation-emerge-closed`
- Disable: `.sky-animation-disabled`

## Shared CSS (animations library)

New reusable CSS replaces the exported TS triggers.

### `skyAnimationSlide` → CSS transition

- `height: *` → `grid-template-rows: 1fr` (with `0fr` for collapsed)
- `overflow`, `visibility` toggled via class
- Timing: `150ms ease-in`

### `skyAnimationEmerge` → CSS transition

- `opacity` + `transform: scale()` toggled via class
- `@starting-style` handles `void => *` (DOM entry)
- Timing: `300ms ease-in-out`

## Consumer Checklist

### `skyAnimationSlide` consumers

- [ ] **tiles** — `tile.component`
  - Remove `animations: [skyAnimationSlide]` and import
  - Replace `[@skyAnimationSlide]="isCollapsed ? 'up' : 'down'"` with class bindings
  - No callbacks — straightforward swap

- [ ] **lists** — `repeater-item.component`
  - Remove `animations: [skyAnimationSlide]` and import
  - Replace `[@.disabled]` + `[@skyAnimationSlide]` with class bindings + `.sky-animation-disabled`
  - No callbacks — straightforward swap

- [ ] **action-bars** — `summary-action-bar.component`
  - Remove `animations: [skyAnimationSlide]`, `AnimationEvent` import
  - Replace `[@skyAnimationSlide]`, `(@skyAnimationSlide.start)`, `(@skyAnimationSlide.done)` with class bindings + `(transitionstart)` + `(transitionend)`
  - Update `summaryTransitionEnd` to accept `TransitionEvent` instead of `AnimationEvent`

- [ ] **tabs** — `vertical-tabset-group.component`
  - Remove `animations: [skyAnimationSlide, skyVerticalTabsetPaddingAnimation]` and imports
  - Replace `[@skyAnimationSlide]` + `[@skyVerticalTabsetPaddingAnimation]` with class bindings
  - Migrate the local `skyVerticalTabsetPaddingAnimation` trigger to CSS (same `150ms ease-in` timing)
  - Handle the `void` state (tabs hidden/shown) via `.sky-animation-disabled`

### `skyAnimationEmerge` consumers

- [ ] **toast** — `toast.component`
  - Remove `animations: [skyAnimationEmerge]`, `AnimationEvent` import
  - Replace `[@skyAnimationEmerge]` + `(@skyAnimationEmerge.done)` with class bindings + `(transitionend)`
  - Use `@starting-style` for DOM entry animation
  - Update `onAnimationDone` to accept `TransitionEvent`, filter by `propertyName`

### Cleanup

- [ ] **animations library** — Remove `slide.ts`, `emerge.ts`, their specs, update `index.ts` exports
- [ ] **animations `package.json`** — Remove `@angular/animations` peer dependency
- [ ] **consumer `package.json` files** — Remove `@angular/animations` dependency where it was only used for these triggers

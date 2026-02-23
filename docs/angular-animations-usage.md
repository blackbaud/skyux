# `@angular/animations` Usage in `libs/components`

## Source Files (TypeScript)

| Library     | File                                                                             | Imports                                                                  |
| ----------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| action-bars | `action-bars/src/lib/modules/summary-action-bar/summary-action-bar.component.ts` | `AnimationEvent`                                                         |
| animations  | `animations/src/lib/slide.ts`                                                    | `animate, animateChild, group, query, state, style, transition, trigger` |
| animations  | `animations/src/lib/emerge.ts`                                                   | `animate, animateChild, group, query, state, style, transition, trigger` |
| flyout      | `flyout/src/lib/modules/flyout/flyout.component.ts`                              | animation utilities                                                      |
| indicators  | `indicators/src/lib/modules/tokens/tokens.component.ts`                          | `animate, style, transition, trigger`                                    |
| inline-form | `inline-form/src/lib/modules/inline-form/animations/slide-dissolve.ts`           | animation utilities                                                      |
| layout      | `layout/src/lib/modules/inline-delete/inline-delete.component.ts`                | animation utilities                                                      |
| layout      | `layout/src/lib/modules/text-expand/text-expand.component.ts`                    | animation utilities                                                      |
| layout      | `layout/src/lib/modules/text-expand-repeater/text-expand-repeater.component.ts`  | animation utilities                                                      |
| lookup      | `lookup/src/lib/modules/search/search.component.ts`                              | animation utilities                                                      |
| phone-field | `phone-field/src/lib/modules/phone-field/phone-field.component.ts`               | animation utilities                                                      |
| popovers    | `popovers/src/lib/modules/popover/popover-content.component.ts`                  | `AnimationEvent`                                                         |
| popovers    | `popovers/src/lib/modules/popover/popover-animation.ts`                          | animation utilities                                                      |
| split-view  | `split-view/src/lib/modules/split-view/split-view.component.ts`                  | animation utilities                                                      |
| tabs        | `tabs/src/lib/modules/sectioned-form/sectioned-form.component.ts`                | `animate, style, transition, trigger`                                    |
| tabs        | `tabs/src/lib/modules/vertical-tabset/vertical-tabset-group.component.ts`        | animation utilities                                                      |
| tabs        | `tabs/src/lib/modules/vertical-tabset/vertical-tabset.component.ts`              | `animate, style, transition, trigger`                                    |
| toast       | `toast/src/lib/modules/toast/toast.component.ts`                                 | `AnimationEvent`                                                         |

## Package Dependencies (`package.json`)

| Library     | Dependency Type | Version    |
| ----------- | --------------- | ---------- |
| action-bars | dependency      | `^21.1.2`  |
| animations  | dependency      | `^21.1.2`  |
| flyout      | dependency      | `^21.1.2`  |
| grids       | peerDependency  | `>=19.0.0` |
| indicators  | dependency      | `^21.1.2`  |
| inline-form | dependency      | `^21.1.2`  |
| layout      | dependency      | `^21.1.2`  |
| lists       | peerDependency  | `>=19.0.0` |
| lookup      | dependency      | `^21.1.2`  |
| phone-field | dependency      | `^21.1.2`  |
| popovers    | dependency      | `^21.1.2`  |
| split-view  | dependency      | `^21.1.2`  |
| tabs        | dependency      | `^21.1.2`  |
| tiles       | peerDependency  | `>=19.0.0` |
| toast       | dependency      | `^21.1.2`  |

## Summary

- **18 source files** across **13 libraries** import from `@angular/animations`
- **15 `package.json` files** declare it as a dependency or peer dependency

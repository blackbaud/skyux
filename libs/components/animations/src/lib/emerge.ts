import {
  AnimationTriggerMetadata,
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * @deprecated `skyAnimationEmerge` is deprecated. Use native CSS transitions with
 * `.sky-animation-emerge-open` / `.sky-animation-emerge-closed` classes instead.
 * See the Angular animations migration guide: https://angular.dev/guide/animations/migration
 *
 * Add the `.sky-animation-emerge` class to the element (or use the
 * `sky-animation-emerge()` SCSS mixin from `@skyux/theme`), then toggle the
 * state classes:
 *
 * @example
 * ```html
 * <div
 *   class="sky-animation-emerge"
 *   [class.sky-animation-emerge-open]="isOpen"
 *   [class.sky-animation-emerge-closed]="!isOpen"
 * >
 *   Content
 * </div>
 * ```
 *
 * To listen for the animation completing (e.g. to remove the element from
 * the DOM after it closes), use the native `transitionend` event:
 *
 * @example
 * ```html
 * <div
 *   class="sky-animation-emerge"
 *   [class.sky-animation-emerge-open]="isOpen"
 *   [class.sky-animation-emerge-closed]="!isOpen"
 *   (transitionend)="onTransitionEnd($event)"
 * >
 *   Content
 * </div>
 * ```
 *
 * ```typescript
 * public onTransitionEnd(event: TransitionEvent): void {
 *   if (event.propertyName === 'opacity' && !this.isOpen) {
 *     // Element has finished closing.
 *   }
 * }
 * ```
 */
export const skyAnimationEmerge: AnimationTriggerMetadata = trigger(
  'skyAnimationEmerge',
  [
    state(
      'open',
      style({
        opacity: 1,
        transform: 'scale(1)',
      }),
    ),
    state(
      'closed',
      style({
        opacity: 0,
        transform: 'scale(0.0)',
      }),
    ),
    transition('void => *', [
      style({
        opacity: 0,
        transform: 'scale(0.0)',
      }),
      animate('300ms ease-in-out'),
    ]),
    transition(`* <=> *`, animate('300ms ease-in-out')),
  ],
);

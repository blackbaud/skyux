import {
  AnimationTriggerMetadata,
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * @deprecated `skyAnimationSlide` is deprecated. Use native CSS transitions with
 * `.sky-animation-slide-down` / `.sky-animation-slide-up` classes instead.
 * See the Angular animations migration guide: https://angular.dev/guide/animations/migration
 *
 * Add the `.sky-animation-slide` class to the container element (or use the
 * `sky-animation-slide()` SCSS mixin from `@skyux/theme`), then toggle the
 * state classes:
 *
 * @example
 * ```html
 * <div
 *   class="sky-animation-slide"
 *   [class.sky-animation-slide-down]="expanded"
 *   [class.sky-animation-slide-up]="!expanded"
 * >
 *   <div>Collapsible content</div>
 * </div>
 * ```
 *
 * To disable the animation, add the `.sky-animation-disabled` class:
 *
 * @example
 * ```html
 * <div
 *   class="sky-animation-slide"
 *   [class.sky-animation-slide-down]="expanded"
 *   [class.sky-animation-slide-up]="!expanded"
 *   [class.sky-animation-disabled]="animationDisabled"
 * >
 *   <div>Collapsible content</div>
 * </div>
 * ```
 */
export const skyAnimationSlide: AnimationTriggerMetadata = trigger(
  'skyAnimationSlide',
  [
    state(
      'down',
      style({
        overflow: 'visible',
        visibility: 'visible',
        height: '*',
      }),
    ),
    state(
      'up',
      style({
        overflow: 'hidden',
        visibility: 'hidden',
        height: 0,
      }),
    ),
    transition('up <=> down', animate('150ms ease-in')),
  ],
);

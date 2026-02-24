import {
  AnimationTriggerMetadata,
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * @deprecated `skyAnimationSlide` is deprecated. Use native CSS transitions instead.
 * @see https://angular.dev/guide/animations/css
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

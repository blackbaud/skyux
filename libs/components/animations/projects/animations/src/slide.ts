import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const skyAnimationSlide: AnimationTriggerMetadata = trigger(
  'skyAnimationSlide',
  [
    state(
      'down',
      style({
        visibility: 'visible',
        height: '*',
      })
    ),
    state(
      'up',
      style({
        visibility: 'hidden',
        height: 0,
      })
    ),
    transition('up <=> down', animate('150ms ease-in')),
  ]
);

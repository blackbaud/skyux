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

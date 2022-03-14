import {
  AnimationTriggerMetadata,
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * @internal
 */
export const skyPopoverAnimation: AnimationTriggerMetadata = trigger(
  'skyPopoverAnimation',
  [
    state(
      'void',
      style({
        opacity: 0,
      })
    ),
    state(
      'open',
      style({
        opacity: 1,
      })
    ),
    state(
      'closed',
      style({
        opacity: 0,
      })
    ),
    transition('void => *', [animate('250ms')]),
    transition('open => closed', [animate('150ms')]),
    transition('closed => open', [animate('150ms')]),
  ]
);

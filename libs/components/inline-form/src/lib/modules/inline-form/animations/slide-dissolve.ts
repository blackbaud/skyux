import {
  animate,
  AnimationTriggerMetadata,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const skySlideDissolve: AnimationTriggerMetadata = trigger(
  'skySlideDissolve',
  [
    transition('* <=> *', [
      // Expand animations
      query(
        '.sky-slide-dissolve-last:enter',
        [
          style({ height: 0, opacity: 0 }),
          animate('200ms ease-in', style({ height: '*', opacity: 0 })),
        ],
        { optional: true }
      ),
      query(
        '.sky-slide-dissolve-last:enter',
        [
          style({ opacity: 0 }),
          animate('200ms ease-in', style({ opacity: 1 })),
        ],
        { optional: true }
      ),

      // Collapse animations
      // The expanded content should fade out immediately to prevent
      // any overlap with the read-only content that's returning to the screen.
      query(
        '.sky-slide-dissolve-last:leave',
        [animate('0ms', style({ opacity: 0 }))],
        { optional: true }
      ),

      group([
        query(
          '.sky-slide-dissolve-first:enter',
          [
            style({ opacity: 0, height: 0 }),
            animate('100ms ease-in', style({ opacity: 1, height: '*' })),
          ],
          { optional: true }
        ),
        query(
          '.sky-slide-dissolve-last:leave',
          [animate('200ms ease-in', style({ height: 0 }))],
          { optional: true }
        ),
      ]),
    ]),
  ]
);

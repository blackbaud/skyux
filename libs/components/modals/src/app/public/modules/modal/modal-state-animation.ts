import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

export const skyAnimationModalState = trigger('modalState', [
  state('in', style({ opacity: '1.0' })),
  state('out', style({ opacity: '0.0' })),
  transition('void => *', [
    style({ opacity: '0.0' }),
    animate(150)
  ]),
  transition('* => void', [
    animate(150, style({ opacity: '0.0' }))
  ])
]) as any;

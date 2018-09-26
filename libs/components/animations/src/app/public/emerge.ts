// #region imports
import {
  AnimationEntryMetadata
} from '@angular/core';

import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
// #endregion

export const skyAnimationEmerge = trigger('skyAnimationEmerge', [
  state('open', style({
    opacity: 1,
    transform: 'scale(1)'
  })),
  state('closed', style({
    opacity: 0,
    transform: 'scale(0.0)'
  })),
  transition('void => *', [
    style({
      opacity: 0,
      transform: 'scale(0.0)'
    }),
    animate('300ms ease-in-out')
  ]),
  transition(`* <=> *`, animate('300ms ease-in-out'))
]) as AnimationEntryMetadata;

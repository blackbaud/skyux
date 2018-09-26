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

export const skyAnimationSlide = trigger('skyAnimationSlide', [
  state('down', style({
    overflow: 'visible',
    height: '*'
  })),
  state('up', style({
    overflow: 'hidden',
    height: 0
  })),
  transition(
    'up <=> down',
    animate('150ms ease-in')
  )
]) as AnimationEntryMetadata;

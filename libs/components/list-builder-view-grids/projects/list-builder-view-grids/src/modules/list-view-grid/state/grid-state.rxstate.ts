import { Injectable } from '@angular/core';

import { StateDispatcher, StateOrchestrator } from '@skyux/list-builder-common';

import { GridStateAction } from './grid-state-action.type';

/**
 * @internal
 */
@Injectable()
export class GridStateDispatcher extends StateDispatcher<GridStateAction> {}

/**
 * @internal
 */
export class GridStateOrchestrator<T> extends StateOrchestrator<
  T,
  GridStateAction
> {}

import { Injectable } from '@angular/core';
import { StateDispatcher, StateOrchestrator } from 'microedge-rxstate/dist';
import { GridStateAction } from './grid-state-action.type';

@Injectable()
export class GridStateDispatcher extends StateDispatcher<GridStateAction> {
}

export class GridStateOrchestrator<T> extends StateOrchestrator<T, GridStateAction> {
}

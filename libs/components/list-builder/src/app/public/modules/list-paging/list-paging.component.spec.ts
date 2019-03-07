import {
  TestBed,
  async,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import {
  ListItemModel
} from '@skyux/list-builder-common';

import {
  ListState,
  ListStateDispatcher,
  ListStateModel
} from '../list/state';
import { SkyListPagingModule } from './';
import {
  ListPagingTestComponent
} from './fixtures/list-paging.component.fixture';
import { ListItemsLoadAction } from '../list/state/items/actions';
import {
  ListPagingSetItemsPerPageAction,
  ListPagingSetMaxPagesAction,
  ListPagingSetPageNumberAction
} from '../list/state/paging/actions';

import { AsyncList } from 'microedge-rxstate/dist';

describe('List Paging Component', () => {
  let state: ListState,
      dispatcher: ListStateDispatcher,
      fixture: any,
      element: DebugElement;

  beforeEach(async(() => {
    dispatcher = new ListStateDispatcher();
    state = new ListState(dispatcher);

    TestBed.configureTestingModule({
      declarations: [
        ListPagingTestComponent
      ],
      imports: [
        SkyListPagingModule
      ],
      providers: [
        { provide: ListState, useValue: state },
        { provide: ListStateDispatcher, useValue: dispatcher }
      ]
    });

    fixture = TestBed.createComponent(ListPagingTestComponent);
    element = fixture.debugElement as DebugElement;
    fixture.detectChanges();

    // always skip the first update to ListState, when state is ready
    // run detectChanges once more then begin tests
    state.skip(1).take(1).subscribe(() => fixture.detectChanges());
  }));

  function getPagingSelector(type: string) {
    if (type === 'next' || type === 'previous') {
      return '.sky-paging-btn[sky-cmp-id="' + type + '"]';
    } else {
      return '.sky-list-paging-link button[sky-cmp-id="' + type + '"]';
    }
  }

  describe('with 8 items', () => {
    beforeEach(async(() => {
      // add some base items to be paged
      dispatcher.next(new ListItemsLoadAction([
        new ListItemModel('1', {}),
        new ListItemModel('2', {}),
        new ListItemModel('3', {}),
        new ListItemModel('4', {}),
        new ListItemModel('5', {}),
        new ListItemModel('6', {}),
        new ListItemModel('7', {})
      ], true));

      fixture.detectChanges();
    }));

    describe('state changes', () => {
      it('responds to page size changes from state', () => {
        dispatcher.next( new ListPagingSetItemsPerPageAction(Number(4)));
        fixture.detectChanges();

        expect(element.query(
          By.css(getPagingSelector('2'))
        )).not.toBeNull();

        expect(element.query(
          By.css(getPagingSelector('3'))
        )).toBeNull();
      });

      it('responds to max pages changes from state', () => {
        dispatcher.next( new ListPagingSetMaxPagesAction(Number(4)));
        fixture.detectChanges();

         expect(element.query(
          By.css(getPagingSelector('4'))
        )).not.toBeNull();
      });

      it('responds to page number changes from state', () => {
        dispatcher.next( new ListPagingSetPageNumberAction(Number(2)));
        fixture.detectChanges();

         expect(element.query(
          By.css(getPagingSelector('2'))
        ).nativeElement.classList.contains('sky-paging-current')).toBe(true);

        expect(element.query(
          By.css(getPagingSelector('previous'))
        ).nativeElement.disabled).toBeFalsy();

        expect(element.query(
          By.css(getPagingSelector('next'))
        ).nativeElement.disabled).toBeFalsy();
      });

      it('does not respond to old item count changes from state', fakeAsync(() => {
        let newState = new ListStateModel();
        newState.items = new AsyncList<ListItemModel>(
          [
            new ListItemModel('1', {}),
            new ListItemModel('2', {})
          ],
          new Date('3/25/2016'),
          false,
          2
        );

        state.next(newState);

        expect(element.query(
          By.css(getPagingSelector('1'))
        )).not.toBeNull();
      }));
    });

    describe('component changes', () => {
      it('dispatches set page number action when page changes from component', fakeAsync(() => {
        fixture.detectChanges();
        element.query(
          By.css(getPagingSelector('3'))
        ).triggerEventHandler('click', undefined);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        state.take(1).subscribe(stateModel => {
          expect(stateModel.paging.pageNumber).toBe(3);
        });

        fixture.detectChanges();
      }));
    });
  });

});

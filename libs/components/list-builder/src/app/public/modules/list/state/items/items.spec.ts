import { ListItemModel } from './item.model';

import {
  ListItemsLoadAction,
  ListItemsSetLoadingAction
} from './actions';

import {
  ListState,
  ListStateDispatcher
} from '../';

import {
  fakeAsync,
  tick
} from '@angular/core/testing';

describe('list items', () => {
  describe('list item model', () => {
    it('should throw an error when initializing without an id', () => {
      expect(function () {
        return new ListItemModel(undefined, 'something');
      }).toThrow(new Error('All list item models require an ID'));
    });

    it('should not set data when data is undefined', () => {
      let item = new ListItemModel('id');
      expect(item.data).toBeUndefined();
    });
  });

  describe('loading and set loading action', () => {
    let state: ListState,
        dispatcher: ListStateDispatcher;

    beforeEach(fakeAsync(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);

      tick();

      // always skip the first update to ListState, when state is ready
      // run detectChanges once more then begin tests
      state.skip(1).take(1).subscribe(() => tick());

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

      tick();
    }));

    it('should set loading when action is dispatched and new items are loaded', fakeAsync (() => {

      state.take(1).subscribe(stateModel => {
        expect(stateModel.items.count).toBe(7);
        expect(stateModel.items.loading).toBe(false);
      });

      tick();

      dispatcher.next(new ListItemsSetLoadingAction(true));

      tick();

      state.take(1).subscribe(stateModel => {
        expect(stateModel.items.count).toBe(7);
        expect(stateModel.items.loading).toBe(true);
      });

      tick();

      // add some base items to be paged
      dispatcher.next(new ListItemsLoadAction([
        new ListItemModel('1', {}),
        new ListItemModel('2', {}),
        new ListItemModel('3', {}),
        new ListItemModel('4', {}),
        new ListItemModel('5', {}),
        new ListItemModel('6', {})
      ], true));

      tick();

      state.take(1).subscribe(stateModel => {
        expect(stateModel.items.count).toBe(6);
        expect(stateModel.items.loading).toBe(false);
      });

      tick();

      dispatcher.next(new ListItemsSetLoadingAction());

      tick();

      state.take(1).subscribe(stateModel => {
        expect(stateModel.items.count).toBe(6);
        expect(stateModel.items.loading).toBe(true);
      });
    }));

    it('should append data when refresh is false on load', fakeAsync (() => {

      state.take(1).subscribe(stateModel => {
        expect(stateModel.items.count).toBe(7);
      });

      tick();

      // add some base items to be paged
      dispatcher.next(new ListItemsLoadAction([
        new ListItemModel('8', {}),
        new ListItemModel('12', {}),
        new ListItemModel('34', {}),
        new ListItemModel('22', {}),
        new ListItemModel('11', {}),
        new ListItemModel('67', {})
      ], false));

      tick();

      state.take(1).subscribe(stateModel => {
        expect(stateModel.items.count).toBe(13);
      });

      tick();
    }));

    it('should allow manually setting count', fakeAsync (() => {

      state.take(1).subscribe(stateModel => {
        expect(stateModel.items.count).toBe(7);
      });

      tick();

      // add some base items to be paged
      dispatcher.next(new ListItemsLoadAction([
        new ListItemModel('8', {}),
        new ListItemModel('12', {}),
        new ListItemModel('34', {}),
        new ListItemModel('22', {}),
        new ListItemModel('11', {}),
        new ListItemModel('67', {})
      ], false, true, 3));

      tick();

      state.take(1).subscribe(stateModel => {
        expect(stateModel.items.count).toBe(3);
      });

      tick();
    }));

    it('should update lastUpdate appropriately', fakeAsync(() => {
      let lastUpdate: any;
      state.take(1).subscribe(stateModel => {
          lastUpdate = stateModel.items.lastUpdate;
      });

      tick();

      // add some base items to be paged
      dispatcher.next(new ListItemsLoadAction([
        new ListItemModel('8', {}),
        new ListItemModel('12', {}),
        new ListItemModel('34', {}),
        new ListItemModel('22', {}),
        new ListItemModel('11', {}),
        new ListItemModel('67', {})
      ], true));

      tick(1000);

      state.take(1).subscribe(stateModel => {
          lastUpdate = stateModel.items.lastUpdate;
      });

      tick();

      // add some base items to be paged
      dispatcher.next(new ListItemsLoadAction([
        new ListItemModel('8', {}),
        new ListItemModel('12', {}),
        new ListItemModel('34', {}),
        new ListItemModel('22', {}),
        new ListItemModel('11', {}),
        new ListItemModel('67', {})
      ], true, false));

      tick();

      state.take(1).subscribe(stateModel => {
          expect(lastUpdate).toEqual(stateModel.items.lastUpdate);
      });

      tick();

    }));

    it('can manually set things in the load action', fakeAsync(() => {
      state.take(1).subscribe(stateModel => {
        expect(stateModel.items.count).toBe(7);
      });

      tick();

      // add some base items to be paged
      dispatcher.next(new ListItemsLoadAction([
        new ListItemModel('8', {}),
        new ListItemModel('12', {}),
        new ListItemModel('34', {}),
        new ListItemModel('22', {}),
        new ListItemModel('11', {}),
        new ListItemModel('67', {})
      ]));

      tick();

      state.take(1).subscribe(stateModel => {
        expect(stateModel.items.count).toBe(13);
      });

      tick();

    }));
  });

});

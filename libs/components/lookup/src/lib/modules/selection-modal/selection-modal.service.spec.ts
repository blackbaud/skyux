import { StaticProvider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  SkyModalConfigurationInterface,
  SkyModalInstance,
  SkyModalService,
} from '@skyux/modals';

import { Subject } from 'rxjs';

import { SkyLookupAddClickEventArgs } from '../lookup/types/lookup-add-click-event-args';

import { SkySelectionModalComponent } from './selection-modal.component';
import { SkySelectionModalService } from './selection-modal.service';
import { SkySelectionModalContext } from './types/selection-modal-context';
import { SkySelectionModalOpenArgs } from './types/selection-modal-open-args';

describe('Selection modal service', () => {
  let mockModalSvc: jasmine.SpyObj<SkyModalService>;
  let selectionModalSvc: SkySelectionModalService;
  let mockModalInstance: SkyModalInstance;

  function getModalContext(): SkySelectionModalContext {
    const modalOpenArgs = mockModalSvc.open.calls.argsFor(0);
    const config = modalOpenArgs[1] as SkyModalConfigurationInterface;
    const context = (
      config.providers?.[0] as {
        useValue: SkySelectionModalContext;
      }
    ).useValue;

    return context;
  }

  function createTestOpenArgs(
    addClickSpy?: jasmine.Spy
  ): SkySelectionModalOpenArgs {
    const args: SkySelectionModalOpenArgs = {
      addClick: addClickSpy,
      descriptorProperty: 'name',
      idProperty: 'id',
      searchAsync: jasmine.createSpy('searchAsync'),
      selectMode: 'single',
    };

    return args;
  }

  beforeEach(() => {
    mockModalSvc = jasmine.createSpyObj<SkyModalService>('MockModalService', [
      'open',
    ]);

    mockModalSvc.open.and.callFake(() => {
      mockModalInstance = new SkyModalInstance();

      mockModalInstance.componentInstance = {
        addClick: new Subject<void>(),
        addItem: jasmine.createSpy('addItem'),
      };

      return mockModalInstance;
    });

    TestBed.configureTestingModule({
      providers: [
        {
          provide: SkyModalService,
          useValue: mockModalSvc,
        },
      ],
    });

    selectionModalSvc = TestBed.inject(SkySelectionModalService);
  });

  afterEach(() => {
    mockModalInstance = undefined;
  });

  it('should open a modal with the expected parameters', () => {
    const args: SkySelectionModalOpenArgs = {
      descriptorProperty: 'name',
      idProperty: 'id',
      searchAsync: jasmine.createSpy('searchAsync'),
      selectMode: 'single',
      initialSearch: 'abc',
      showAddButton: true,
      title: 'Test title',
      value: ['1'],
    };

    selectionModalSvc.open(args);

    expect(mockModalSvc.open).toHaveBeenCalledOnceWith(
      SkySelectionModalComponent,
      jasmine.objectContaining<SkyModalConfigurationInterface>({
        providers: jasmine.arrayWithExactContents([
          jasmine.objectContaining<StaticProvider>({
            provide: SkySelectionModalContext,
            useValue: jasmine.objectContaining<SkySelectionModalContext>({
              descriptorProperty: args.descriptorProperty,
              idProperty: args.idProperty,
              initialSearch: args.initialSearch,
              initialValue: args.value,
              searchAsync: jasmine.any(Function),
              selectMode: args.selectMode,
              showAddButton: args.showAddButton,
              userConfig: jasmine.objectContaining({
                title: args.title,
              }),
            }),
          }),
        ]),
        size: 'large',
      })
    );
  });

  it('should specify default values for optional args', () => {
    selectionModalSvc.open(createTestOpenArgs());

    expect(mockModalSvc.open).toHaveBeenCalledOnceWith(
      SkySelectionModalComponent,
      jasmine.objectContaining<SkyModalConfigurationInterface>({
        providers: jasmine.arrayWithExactContents([
          jasmine.objectContaining<StaticProvider>({
            provide: SkySelectionModalContext,
            useValue: jasmine.objectContaining<SkySelectionModalContext>({
              initialSearch: '',
              initialValue: [],
              showAddButton: false,
            }),
          }),
        ]),
      })
    );
  });

  it('should call the specified searchAsync() callback', () => {
    const args = createTestOpenArgs();

    selectionModalSvc.open(args);

    const context = getModalContext();

    context.searchAsync({
      continuationData: 'bar',
      displayType: 'modal',
      offset: 10,
      searchText: 'foo',
    });

    expect(args.searchAsync).toHaveBeenCalledOnceWith({
      continuationData: 'bar',
      offset: 10,
      searchText: 'foo',
    });
  });

  it("should call the selection modal component's addItem() method when an item is added", () => {
    const instance = selectionModalSvc.open(createTestOpenArgs());

    instance.addItem({
      name: 'test name',
    });

    expect(
      mockModalInstance.componentInstance.addItem
    ).toHaveBeenCalledOnceWith({
      name: 'test name',
    });
  });

  it('should handle cancel', async () => {
    const instance = selectionModalSvc.open(createTestOpenArgs());

    const closePromise = instance.closed.toPromise();

    mockModalInstance.close(undefined, 'cancel');

    const result = await closePromise;

    expect(result.reason).toBe('cancel');
  });

  it('should handle save', async () => {
    const selectedItem = { id: 1, name: 'item name' };

    const instance = selectionModalSvc.open(createTestOpenArgs());

    const closePromise = instance.closed.toPromise();

    mockModalInstance.close(
      [
        {
          itemData: selectedItem,
        },
      ],
      'save'
    );

    const result = await closePromise;

    expect(result.reason).toBe('save');
    expect(result.selectedItems).toEqual(
      jasmine.arrayWithExactContents([selectedItem])
    );
  });

  it('should treat other closed reasons as "close"', async () => {
    const instance = selectionModalSvc.open(createTestOpenArgs());

    const closePromise = instance.closed.toPromise();

    mockModalInstance.close(undefined, 'close');

    const result = await closePromise;

    expect(result.reason).toBe('close');
  });

  it('should handle add button click events', () => {
    const addClickSpy = jasmine.createSpy('addClick');
    const args = createTestOpenArgs(addClickSpy);

    selectionModalSvc.open(args);

    mockModalInstance.componentInstance.addClick.next();

    const addArgs: SkyLookupAddClickEventArgs = addClickSpy.calls.argsFor(0)[0];

    const newItem = {
      id: 1,
      name: 'new name',
    };

    addArgs.itemAdded({
      item: newItem,
    });

    expect(
      mockModalInstance.componentInstance.addItem
    ).toHaveBeenCalledOnceWith(newItem);
  });
});

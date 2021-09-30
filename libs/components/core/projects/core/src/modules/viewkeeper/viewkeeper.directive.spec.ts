import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  By
} from '@angular/platform-browser';

import {
  MutationObserverService
} from '../mutation/mutation-observer-service';

import {
  SkyViewkeeperModule
} from './viewkeeper.module';

import {
 SkyViewkeeperService
} from './viewkeeper.service';

import {
  ViewkeeperTestComponent
} from './fixtures/viewkeeper-test.component';

import {
  ViewkeeperEmptyTestComponent
} from './fixtures/viewkeeper-empty-test.component';

describe('Viewkeeper directive', () => {
  let mockViewkeeperSvc: any;
  let mockMutationObserverSvc: any;
  let mutationCallbacks: any[];
  let mockMutationObserver: any;

  function getBoundaryEl(fixture: ComponentFixture<ViewkeeperTestComponent>): void {
    return fixture.debugElement.query(By.css('.boundary-el')).nativeElement;
  }

  function validateViewkeepersCreated(fixture: ComponentFixture<ViewkeeperTestComponent>): void {
    const boundaryEl = getBoundaryEl(fixture);

    let expectedCallCount = 2;

    if (fixture.componentInstance.showEl3) {
      expectedCallCount++;
    }

    if (fixture.componentInstance.showEl4) {
      expectedCallCount++;
    }

    expect(mockViewkeeperSvc.create).toHaveBeenCalledTimes(expectedCallCount);

    expect(mockViewkeeperSvc.create).toHaveBeenCalledWith({
      boundaryEl,
      el: document.querySelector('.el1'),
      setWidth: true,
      verticalOffsetEl: undefined
    });

    expect(mockViewkeeperSvc.create).toHaveBeenCalledWith({
      boundaryEl,
      el: document.querySelector('.el2'),
      setWidth: true,
      verticalOffsetEl: document.querySelector('.el1')
    });

    if (fixture.componentInstance.showEl3) {
      expect(mockViewkeeperSvc.create).toHaveBeenCalledWith({
        boundaryEl,
        el: document.querySelector('.el3'),
        setWidth: true,
        verticalOffsetEl: document.querySelector('.el2')
      });
    }

    if (fixture.componentInstance.showEl4) {
      expect(mockViewkeeperSvc.create).toHaveBeenCalledWith({
        boundaryEl,
        el: document.querySelector('.el4'),
        setWidth: true,
        verticalOffsetEl: document.querySelector(
          fixture.componentInstance.showEl3 ?
          '.el3' :
          '.el2'
        )
      });
    }
  }

  function triggerMutationChange(): void {
    for (const mutationCallback of mutationCallbacks) {
      mutationCallback();
    }
  }

  beforeEach(() => {
    mutationCallbacks = [];

    mockViewkeeperSvc = {
      create: jasmine.createSpy('create'),
      destroy: jasmine.createSpy('destroy')
    };

    mockMutationObserver = {
      observe: jasmine.createSpy('observe'),
      disconnect: jasmine.createSpy('disconnect')
    };

    mockMutationObserverSvc = {
      create: jasmine.createSpy('create').and.callFake((callback: any) => {
        mutationCallbacks.push(callback);
        return mockMutationObserver;
      })
    };

    TestBed.configureTestingModule({
      declarations: [
        ViewkeeperTestComponent,
        ViewkeeperEmptyTestComponent
      ],
      imports: [
        SkyViewkeeperModule
      ],
      providers: [
        {
          provide: SkyViewkeeperService,
          useValue: mockViewkeeperSvc
        },
        {
          provide: MutationObserverService,
          useValue: mockMutationObserverSvc
        }
      ]
    });
  });

  afterEach(() => {
    mutationCallbacks = undefined;
  });

  it('should create viewkeeper objects for each matching element', () => {
    const fixture = TestBed.createComponent(ViewkeeperTestComponent);

    fixture.detectChanges();
    triggerMutationChange();

    expect(mockMutationObserver.observe).toHaveBeenCalledWith(
      getBoundaryEl(fixture),
      {
        childList: true,
        subtree: true
      }
    );

    validateViewkeepersCreated(fixture);

    expect(mockMutationObserver.disconnect).not.toHaveBeenCalled();

    fixture.destroy();

    expect(mockMutationObserver.disconnect).toHaveBeenCalled();
  });

  it('should create viewkeeper objects for elements that appear after initial render', () => {
    const fixture = TestBed.createComponent(ViewkeeperTestComponent);

    fixture.detectChanges();
    triggerMutationChange();

    validateViewkeepersCreated(fixture);

    mockViewkeeperSvc.create.calls.reset();

    // Add a new matching element.
    fixture.componentInstance.showEl3 = true;

    fixture.detectChanges();
    triggerMutationChange();

    validateViewkeepersCreated(fixture);

    expect(mockViewkeeperSvc.destroy).toHaveBeenCalledTimes(2);

    mockViewkeeperSvc.create.calls.reset();
    mockViewkeeperSvc.destroy.calls.reset();

    triggerMutationChange();

    expect(mockViewkeeperSvc.create).not.toHaveBeenCalled();
    expect(mockViewkeeperSvc.destroy).not.toHaveBeenCalled();

    // Remove a matching element and add another.
    fixture.componentInstance.showEl3 = false;
    fixture.componentInstance.showEl4 = true;

    fixture.detectChanges();
    triggerMutationChange();

    validateViewkeepersCreated(fixture);

    expect(mockViewkeeperSvc.destroy).toHaveBeenCalledTimes(3);

    // Remove all matching elements.
    mockViewkeeperSvc.create.calls.reset();

    fixture.componentInstance.showEl1 = false;
    fixture.componentInstance.showEl2 = false;
    fixture.componentInstance.showEl3 = false;
    fixture.componentInstance.showEl4 = false;

    fixture.detectChanges();
    triggerMutationChange();

    expect(mockViewkeeperSvc.create).not.toHaveBeenCalled();
  });

  it('should handle an empty viewkeeper attribute value', () => {
    const fixture = TestBed.createComponent(ViewkeeperEmptyTestComponent);

    fixture.detectChanges();
    triggerMutationChange();

    expect(mockViewkeeperSvc.create).not.toHaveBeenCalled();

    triggerMutationChange();

    expect(mockViewkeeperSvc.create).not.toHaveBeenCalled();
  });

});

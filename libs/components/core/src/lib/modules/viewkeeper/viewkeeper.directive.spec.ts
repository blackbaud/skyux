import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { SkyMutationObserverService } from '../mutation/mutation-observer-service';

import { ViewkeeperEmptyTestComponent } from './fixtures/viewkeeper-empty-test.component';
import { ViewkeeperTestComponent } from './fixtures/viewkeeper-test.component';
import { SkyViewkeeperModule } from './viewkeeper.module';
import { SkyViewkeeperService } from './viewkeeper.service';

describe('Viewkeeper directive', () => {
  let mockViewkeeperSvc: any;
  let mockMutationObserverSvc: any;
  let mutationCallbacks: any[] = [];
  let mockMutationObserver: any;

  function getBoundaryEl(
    fixture: ComponentFixture<ViewkeeperTestComponent>,
  ): HTMLElement {
    return fixture.debugElement.query(By.css('.boundary-el')).nativeElement;
  }

  function getScrollableHostEl(
    fixture: ComponentFixture<ViewkeeperTestComponent>,
  ): HTMLElement | undefined {
    return fixture.debugElement.query(By.css('.scrollable-host'))
      ?.nativeElement;
  }

  function validateViewkeepersCreated(
    fixture: ComponentFixture<ViewkeeperTestComponent>,
  ): void {
    const boundaryEl = getBoundaryEl(fixture);
    const scrollableHost = getScrollableHostEl(fixture);

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
      scrollableHost: scrollableHost !== undefined ? scrollableHost : undefined,
      verticalOffsetEl: undefined,
    });

    expect(mockViewkeeperSvc.create).toHaveBeenCalledWith({
      boundaryEl,
      el: document.querySelector('.el2'),
      setWidth: true,
      scrollableHost: scrollableHost !== undefined ? scrollableHost : undefined,
      verticalOffsetEl: document.querySelector('.el1'),
    });

    if (fixture.componentInstance.showEl3) {
      expect(mockViewkeeperSvc.create).toHaveBeenCalledWith({
        boundaryEl,
        el: document.querySelector('.el3'),
        setWidth: true,
        scrollableHost:
          scrollableHost !== undefined ? scrollableHost : undefined,
        verticalOffsetEl: document.querySelector('.el2'),
      });
    }

    if (fixture.componentInstance.showEl4) {
      expect(mockViewkeeperSvc.create).toHaveBeenCalledWith({
        boundaryEl,
        el: document.querySelector('.el4'),
        setWidth: true,
        scrollableHost:
          scrollableHost !== undefined ? scrollableHost : undefined,
        verticalOffsetEl: document.querySelector(
          fixture.componentInstance.showEl3 ? '.el3' : '.el2',
        ),
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
      destroy: jasmine.createSpy('destroy'),
    };

    mockMutationObserver = {
      observe: jasmine.createSpy('observe'),
      disconnect: jasmine.createSpy('disconnect'),
    };

    mockMutationObserverSvc = {
      create: jasmine.createSpy('create').and.callFake((callback) => {
        mutationCallbacks.push(callback);
        return mockMutationObserver;
      }),
    };

    TestBed.configureTestingModule({
      declarations: [ViewkeeperTestComponent, ViewkeeperEmptyTestComponent],
      imports: [SkyViewkeeperModule],
      providers: [
        {
          provide: SkyViewkeeperService,
          useValue: mockViewkeeperSvc,
        },
        {
          provide: SkyMutationObserverService,
          useValue: mockMutationObserverSvc,
        },
      ],
    });
  });

  afterEach(() => {
    mutationCallbacks = [];
  });

  it('should maintain a shadow element', fakeAsync(() => {
    const fixture = TestBed.createComponent(ViewkeeperTestComponent);
    fixture.componentInstance.scrollableHost = true;
    fixture.detectChanges();
    triggerMutationChange();
    validateViewkeepersCreated(fixture);

    expect(
      fixture.nativeElement.querySelectorAll('.sky-viewkeeper-shadow'),
    ).toHaveSize(1);
    expect(fixture.nativeElement.querySelectorAll('.el1')).toHaveSize(1);
    expect(fixture.nativeElement.querySelectorAll('.el2')).toHaveSize(1);

    const shadowEl = fixture.nativeElement.querySelector(
      '.sky-viewkeeper-shadow',
    );
    expect(shadowEl).toBeTruthy();
    const el1 = fixture.nativeElement.querySelector('.el1');
    SkyAppTestUtility.fireDomEvent(el1, 'afterViewkeeperSync');
    tick(16);
    expect(shadowEl.classList).toContain('sky-viewkeeper-shadow--active');

    fixture.componentInstance.showEl1 = false;
    fixture.detectChanges();
    triggerMutationChange();
    const el2 = fixture.nativeElement.querySelector('.el2');
    SkyAppTestUtility.fireDomEvent(el2, 'afterViewkeeperSync');
    tick(16);
    expect(shadowEl.classList).not.toContain('sky-viewkeeper-shadow--active');
  }));

  it('should create viewkeeper objects for each matching element', () => {
    const fixture = TestBed.createComponent(ViewkeeperTestComponent);

    fixture.detectChanges();
    triggerMutationChange();

    expect(mockMutationObserver.observe).toHaveBeenCalledWith(
      getBoundaryEl(fixture),
      {
        childList: true,
        subtree: true,
      },
    );

    validateViewkeepersCreated(fixture);

    // Disconnect is called four times from the scrollable host service when we watch for scrollable parents.
    expect(mockMutationObserver.disconnect).toHaveBeenCalledTimes(4);

    mockMutationObserver.disconnect.calls.reset();

    fixture.destroy();

    // Called twice from the scrollable host service when we unsubscribe from the observable and once for the viewkeepers own mutation observer.
    expect(mockMutationObserver.disconnect).toHaveBeenCalledTimes(3);
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

  it('should create viewkeeper objects for each matching element when inside a scrollable parent', () => {
    const fixture = TestBed.createComponent(ViewkeeperTestComponent);
    fixture.componentInstance.scrollableHost = true;

    fixture.detectChanges();
    triggerMutationChange();

    expect(mockMutationObserver.observe).toHaveBeenCalledWith(
      getBoundaryEl(fixture),
      {
        childList: true,
        subtree: true,
      },
    );

    validateViewkeepersCreated(fixture);

    // Disconnect is called four times from the scrollable host service when we watch for scrollable parents.
    expect(mockMutationObserver.disconnect).toHaveBeenCalledTimes(4);

    mockMutationObserver.disconnect.calls.reset();

    fixture.destroy();

    // Called twice from the scrollable host service when we unsubscribe from the observable and once for the viewkeepers own mutation observer.
    expect(mockMutationObserver.disconnect).toHaveBeenCalledTimes(3);
  });
});

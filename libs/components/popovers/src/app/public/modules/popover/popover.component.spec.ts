import {
  ElementRef
} from '@angular/core';

import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  async
} from '@angular/core/testing';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  SkyLibResourcesTestService
} from '@skyux/i18n/testing';

import {
  SkyPopoverModule,
  SkyPopoverComponent,
  SkyPopoverAdapterService
} from './index';

class MockPopoverAdapterService {
  public isPopoverLargerThanParent(): boolean {
    return false;
  }
  public getPopoverPosition(): any {
    return {
      top: 0,
      left: 0,
      arrowLeft: 0,
      arrowRight: 0,
      placement: 'above',
      alignment: undefined
    };
  }
  public hidePopover() {}
  public showPopover() {}
  public getParentScrollListeners() {}
}

describe('SkyPopoverComponent', () => {
  let fixture: ComponentFixture<SkyPopoverComponent>;
  let component: SkyPopoverComponent;
  let mockAdapterService: MockPopoverAdapterService;

  beforeEach(() => {
    mockAdapterService = new MockPopoverAdapterService();

    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        SkyPopoverModule
      ],
      providers: [
        {
          provide: SkyLibResourcesService,
          useClass: SkyLibResourcesTestService
        }
      ]
    });

    TestBed.overrideComponent(SkyPopoverComponent, {
      set: {
        providers: [
          { provide: SkyPopoverAdapterService, useValue: mockAdapterService }
        ]
      }
    });

    fixture = TestBed.createComponent(SkyPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should call the adapter service to position the popover', fakeAsync(() => {
    const caller = new ElementRef({});
    const spy = spyOn(mockAdapterService, 'getPopoverPosition').and.returnValue({
      top: 0,
      left: 0,
      arrowLeft: 0,
      arrowRight: 0,
      placement: 'above',
      alignment: undefined
    });
    component.positionNextTo(caller, 'above');
    tick();
    expect(spy).toHaveBeenCalled();
  }));

  it('should call the adapter service with a default position', fakeAsync(() => {
    const caller = new ElementRef({});
    const spy = spyOn(mockAdapterService, 'getPopoverPosition').and.returnValue({
      top: 0,
      left: 0,
      arrowLeft: 0,
      arrowRight: 0,
      placement: undefined,
      alignment: undefined
    });
    component.alignment = undefined;
    component.placement = undefined;
    component.positionNextTo(caller, undefined, undefined);
    tick();
    expect(spy.calls.argsFor(0)[1]).toEqual('above');
    expect(spy.calls.argsFor(0)[2]).toEqual('center');
  }));

  it('should not call the adapter service if a caller is not defined', () => {
    const spy = spyOn(mockAdapterService, 'getPopoverPosition');
    component.positionNextTo(undefined, 'above');
    expect(spy).not.toHaveBeenCalled();
  });

  it('should close a popover', () => {
    component.isOpen = true;
    component.animationState = undefined;
    component.close();
    expect(component.animationState).toEqual('hidden');
  });

  it('should remove a CSS classname before the animation starts', () => {
    const spy = spyOn(mockAdapterService, 'showPopover').and.returnValue(undefined);

    component.onAnimationStart({
      fromState: 'hidden',
      toState: 'visible',
      totalTime: 0,
      phaseName: '',
      element: {},
      triggerName: ''
    });

    expect(spy).toHaveBeenCalledWith(component.popoverContainer);

    // Handle 'else' path:
    spy.calls.reset();
    component.onAnimationStart({
      fromState: 'visible',
      toState: 'hidden',
      totalTime: 0,
      phaseName: '',
      element: {},
      triggerName: ''
    });

    expect(spy).not.toHaveBeenCalled();
  });

  it('should add a CSS classname when the animation stops', () => {
    const spy = spyOn(mockAdapterService, 'hidePopover').and.returnValue(undefined);

    component.onAnimationDone({
      fromState: 'visible',
      toState: 'hidden',
      totalTime: 0,
      phaseName: '',
      element: {},
      triggerName: ''
    });

    expect(spy).toHaveBeenCalledWith(component.popoverContainer);
  });

  it('should emit an event when the popover is opened', () => {
    const spy = spyOn(component.popoverOpened, 'emit').and.returnValue(0);

    component.onAnimationDone({
      fromState: 'hidden',
      toState: 'visible',
      totalTime: 0,
      phaseName: '',
      element: {},
      triggerName: ''
    });

    expect(spy).toHaveBeenCalledWith(component);
  });

  it('should emit an event when the popover is closed', () => {
    const spy = spyOn(component.popoverClosed, 'emit').and.returnValue(0);

    component.onAnimationDone({
      fromState: 'visible',
      toState: 'hidden',
      totalTime: 0,
      phaseName: '',
      element: {},
      triggerName: ''
    });

    expect(spy).toHaveBeenCalledWith(component);
  });

  it('should capture mouse enter and mouse leave events', fakeAsync(() => {
    const caller = new ElementRef({});
    expect(component['isMouseEnter']).toEqual(false);
    component.positionNextTo(caller, 'above');
    tick();
    SkyAppTestUtility.fireDomEvent(fixture.nativeElement, 'mouseenter');
    expect(component['isMouseEnter']).toEqual(true);
    SkyAppTestUtility.fireDomEvent(fixture.nativeElement, 'mouseleave');
    expect(component['isMouseEnter']).toEqual(false);
  }));

  it('should close the popover when the escape key is pressed', fakeAsync(() => {
    const spy = spyOn(fixture.componentInstance, 'close');
    const caller = new ElementRef({ focus() {} });
    component.positionNextTo(caller, 'above');
    tick();

    fixture.componentInstance.isOpen = true;

    SkyAppTestUtility.fireDomEvent(fixture.nativeElement, 'keyup', {
      keyboardEventInit: { key: 'Escape' }
    });
    expect(spy).toHaveBeenCalledWith();

    spy.calls.reset();

    // Should ignore other key events.
    SkyAppTestUtility.fireDomEvent(fixture.nativeElement, 'keyup', {
      keyboardEventInit: { key: 'Backspace' }
    });
    expect(spy).not.toHaveBeenCalled();
  }));

  it('should reposition the popover on window scroll', fakeAsync(() => {
    const spy = spyOn(fixture.componentInstance as any, 'positionPopover');

    const caller = new ElementRef({});
    component.positionNextTo(caller, 'above');
    tick();

    component.isOpen = true;
    SkyAppTestUtility.fireDomEvent(window, 'scroll');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  }));

  it('should reposition the popover on window resize', fakeAsync(() => {
    const spy = spyOn(fixture.componentInstance, 'reposition');
    const caller = new ElementRef({});
    component.positionNextTo(caller, 'above');
    tick();

    component.isOpen = true;
    SkyAppTestUtility.fireDomEvent(window, 'resize');
    tick();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  }));

  it('should close the popover when the document is clicked', fakeAsync(() => {
    spyOn(component, 'close');

    const caller = new ElementRef({});
    component.positionNextTo(caller, 'above');
    tick();

    component.isOpen = true;
    SkyAppTestUtility.fireDomEvent(document, 'click');
    SkyAppTestUtility.fireDomEvent(document, 'focusin');
    tick();
    fixture.detectChanges();

    expect(component.close).toHaveBeenCalled();
  }));

  it('should allow disabling of closing the popover when the document is clicked', fakeAsync(() => {
    const caller = new ElementRef({});
    component.positionNextTo(caller, 'above');
    tick();

    spyOn(component, 'close');

    component.isOpen = true;
    component.isMouseEnter = false;
    component.dismissOnBlur = false;
    SkyAppTestUtility.fireDomEvent(document, 'click');

    fixture.detectChanges();
    expect(component.close).not.toHaveBeenCalled();
  }));

  it('should not close the popover if the popover is clicked', () => {
    spyOn(component, 'close');

    component.isOpen = true;
    component['isMouseEnter'] = true;
    SkyAppTestUtility.fireDomEvent(document, 'click');

    fixture.detectChanges();
    expect(component.close).not.toHaveBeenCalled();
  });

  it('should close the popover on mouseleave if it has been marked for close', fakeAsync(() => {
    const spy = spyOn(component, 'close');
    const caller = new ElementRef({});
    component.positionNextTo(caller, 'above');
    tick();
    component.markForCloseOnMouseLeave();
    SkyAppTestUtility.fireDomEvent(fixture.nativeElement, 'mouseleave');
    expect(spy).toHaveBeenCalledWith();
    expect(component['isMarkedForCloseOnMouseLeave']).toEqual(false);
  }));

  it('should not reposition fullscreen popovers', fakeAsync(() => {
    const caller = new ElementRef({});
    spyOn(mockAdapterService, 'isPopoverLargerThanParent').and.returnValue(true);
    component.positionNextTo(caller, 'above');
    tick();
    fixture.detectChanges();
    expect(component.placement).toEqual('fullscreen');

    const spy = spyOn(mockAdapterService, 'getPopoverPosition').and.callThrough();

    component.reposition();
    tick();

    expect(spy).not.toHaveBeenCalled();
  }));

  it('should expose a method to return the placement to the preferred placement', fakeAsync(() => {
    const spy = spyOn(mockAdapterService, 'getPopoverPosition').and.returnValue({
      top: 0,
      left: 0,
      arrowLeft: 0,
      arrowRight: 0,
      placement: 'right',
      alignment: undefined
    });

    const caller = new ElementRef({});
    component.positionNextTo(caller, 'above');
    tick();
    fixture.detectChanges();

    expect(component.placement).toEqual('right');

    component.reposition();
    expect(spy.calls.argsFor(1)[1]).toEqual('above');
  }));

  it('should hide the popover if its top or bottom boundaries leave its scrollable parent', fakeAsync(() => {
    const caller = new ElementRef({});
    const repositionSpy = spyOn(component as any, 'reposition').and.callThrough();

    let result = false;
    spyOn(mockAdapterService, 'getParentScrollListeners').and.callFake((elem: any, callback: any) => {
      callback(result);
    });

    component.positionNextTo(caller, 'above');
    tick();

    let popover = fixture.nativeElement.querySelector('.sky-popover-container');
    expect(repositionSpy).toHaveBeenCalled();
    expect(component.isVisible).toEqual(false);
    expect(popover.style.visibility).toEqual('hidden');
    repositionSpy.calls.reset();

    result = true;
    component.positionNextTo(caller, 'above');
    tick();

    expect(component.isVisible).toEqual(true);
    expect(repositionSpy).toHaveBeenCalled();
  }));

  it('should listeners to scrollable parents', fakeAsync(() => {
    const caller = new ElementRef({});
    let called = false;

    spyOn(mockAdapterService, 'getParentScrollListeners').and.returnValue([
      () => {
        called = true;
      }
    ]);

    component.positionNextTo(caller, 'above');
    tick();
    component.close();
    tick();

    expect(called).toEqual(true);
  }));

  it('should pass accessibility', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});

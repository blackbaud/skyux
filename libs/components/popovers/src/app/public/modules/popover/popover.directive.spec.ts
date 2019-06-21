import {
  DebugElement
} from '@angular/core';

import {
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
  async
} from '@angular/core/testing';

import {
  By
} from '@angular/platform-browser';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyWindowRefService
} from '@skyux/core';

import {
  SkyPopoverTestComponent
} from './fixtures/popover.component.fixture';

import {
  SkyPopoverModule
} from './popover.module';

import {
  SkyPopoverMessageType
} from './types/popover-message-type';

import {
  SkyPopoverDirective
} from './popover.directive';

import {
  SkyPopoverAdapterService
} from './popover-adapter.service';

class MockWindowService {
  public getWindow(): any {
    return {
      setTimeout(callback: Function) {
        callback();
      }
    };
  }
}

describe('SkyPopoverDirective', () => {
  let fixture: ComponentFixture<SkyPopoverTestComponent>;
  let directiveElements: DebugElement[];
  let mockWindowService: MockWindowService;

  function validateTriggerOpensPopover(
    elIndex: number,
    openTrigger: string,
    closeTrigger: string
  ) {
    const caller = directiveElements[elIndex];
    const callerInstance = caller.injector.get(SkyPopoverDirective);

    const positionNextToSpy = spyOn(callerInstance.skyPopover, 'positionNextTo');
    const closeSpy = spyOn(callerInstance.skyPopover, 'close');

    // The popover should only execute hover events if it is set to 'mouseenter'.
    if (openTrigger !== 'mouseenter') {
      SkyAppTestUtility.fireDomEvent(caller.nativeElement, 'mouseenter');
      expect(positionNextToSpy).not.toHaveBeenCalled();
    }

    SkyAppTestUtility.fireDomEvent(caller.nativeElement, openTrigger);
    expect(positionNextToSpy).toHaveBeenCalled();

    callerInstance.skyPopover.isOpen = true;

    // The popover should only execute hover events if it is set to 'mouseenter'.
    if (closeTrigger !== 'mouseleave') {
      SkyAppTestUtility.fireDomEvent(caller.nativeElement, 'mouseleave');
      expect(closeSpy).not.toHaveBeenCalled();
    }

    SkyAppTestUtility.fireDomEvent(caller.nativeElement, closeTrigger);
    expect(closeSpy).toHaveBeenCalled();

    // Make sure close isn't called again when the popover is already closed.
    closeSpy.calls.reset();
    callerInstance.skyPopover.isOpen = false;

    SkyAppTestUtility.fireDomEvent(caller.nativeElement, closeTrigger);
    expect(closeSpy).not.toHaveBeenCalled();
  }

  beforeEach(() => {
    mockWindowService = new MockWindowService();
    let mockAdapterService = {};

    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        SkyPopoverModule
      ],
      declarations: [
        SkyPopoverTestComponent
      ],
      providers: [
        { provide: SkyPopoverAdapterService, useValue: mockAdapterService },
        { provide: SkyWindowRefService, useValue: mockWindowService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SkyPopoverTestComponent);
    directiveElements = fixture.debugElement.queryAll(By.directive(SkyPopoverDirective));
    fixture.detectChanges();
  });

  it('should ask the popover to position itself accordingly', () => {
    const caller = directiveElements[0];
    const callerInstance = caller.injector.get(SkyPopoverDirective);
    const spy = spyOn(callerInstance.skyPopover, 'positionNextTo');
    caller.nativeElement.click();
    expect(spy).toHaveBeenCalledWith(callerInstance['elementRef'], undefined, undefined);
  });

  it('should ask the popover to close itself if the button is clicked again', () => {
    const caller = directiveElements[0];
    const callerInstance = caller.injector.get(SkyPopoverDirective);
    const spy = spyOn(callerInstance.skyPopover, 'close');
    callerInstance.skyPopover.isOpen = true;
    caller.nativeElement.click();
    expect(spy).toHaveBeenCalledWith();
  });

  it('should pass along the placement', () => {
    const caller = directiveElements[1];
    const callerInstance = caller.injector.get(SkyPopoverDirective);
    const spy = spyOn(callerInstance.skyPopover, 'positionNextTo');
    caller.nativeElement.click();
    expect(spy).toHaveBeenCalledWith(callerInstance['elementRef'], 'below', undefined);
  });

  it('should allow click to display the popover', () => {
    validateTriggerOpensPopover(1, 'click', 'click');
  });

  it('should allow mouseenter to display the popover', () => {
    validateTriggerOpensPopover(2, 'mouseenter', 'mouseleave');
  });

  it('should mark the popover to close on mouseleave', () => {
    const caller = directiveElements[2];
    const callerInstance = caller.injector.get(SkyPopoverDirective);
    const closeSpy = spyOn((callerInstance as any), 'closePopover').and.callThrough();
    const markForCloseSpy = spyOn((callerInstance as any).skyPopover, 'markForCloseOnMouseLeave').and.callThrough();

    callerInstance.skyPopover.isOpen = true;

    SkyAppTestUtility.fireDomEvent(caller.nativeElement, 'mouseleave');
    expect(closeSpy).toHaveBeenCalled();
    expect(markForCloseSpy).not.toHaveBeenCalled();

    closeSpy.calls.reset();
    markForCloseSpy.calls.reset();

    // Else path, popover has mouseenter.
    callerInstance.skyPopover.isOpen = false;
    SkyAppTestUtility.fireDomEvent(caller.nativeElement, 'mouseleave');
    callerInstance.skyPopover.isMouseEnter = true;
    callerInstance.skyPopover.popoverOpened.emit();
    expect(closeSpy).not.toHaveBeenCalled();
    expect(markForCloseSpy).toHaveBeenCalled();
  });

  it('should close the popover when the escape key is pressed', () => {
    const caller = directiveElements[3];
    const callerInstance = caller.injector.get(SkyPopoverDirective);
    const spy = spyOn(callerInstance.skyPopover, 'close');

    callerInstance.skyPopover.isOpen = true;

    SkyAppTestUtility.fireDomEvent(caller.nativeElement, 'keyup', {
      keyboardEventInit: { key: 'Escape' }
    });
    expect(spy).toHaveBeenCalledWith();

    spy.calls.reset();

    // Should ignore other key events.
    SkyAppTestUtility.fireDomEvent(caller.nativeElement, 'keyup', {
      keyboardEventInit: { key: 'Backspace' }
    });
    expect(spy).not.toHaveBeenCalled();
  });

  it('should focus the caller element after being closed', () => {
    const caller = directiveElements[3];
    const callerInstance = caller.injector.get(SkyPopoverDirective);
    const spy = spyOn(callerInstance['elementRef'].nativeElement, 'focus').and.callThrough();

    callerInstance.skyPopover.isOpen = true;

    SkyAppTestUtility.fireDomEvent(caller.nativeElement, 'keyup', {
      keyboardEventInit: { key: 'Escape' }
    });
    expect(spy).toHaveBeenCalledWith();
  });

  it('should handle asynchronous popover references', () => {
    const caller = directiveElements[4];
    const callerInstance = caller.injector.get(SkyPopoverDirective);
    const eventListenerSpy = spyOn(callerInstance as any, 'addEventListeners').and.callThrough();

    caller.nativeElement.click();
    fixture.detectChanges();

    expect(callerInstance.skyPopover).toBeUndefined();
    expect(eventListenerSpy).not.toHaveBeenCalled();

    eventListenerSpy.calls.reset();

    fixture.componentInstance.attachAsyncPopover();
    fixture.detectChanges();

    expect(callerInstance.skyPopover).toBeDefined();
    expect(eventListenerSpy).toHaveBeenCalled();
  });

  it('should remove event listeners before adding them again', () => {
    const caller = directiveElements[4];
    const callerInstance = caller.injector.get(SkyPopoverDirective);
    const addEventSpy = spyOn(callerInstance as any, 'addEventListeners').and.callThrough();
    const removeEventSpy = spyOn(callerInstance as any, 'removeEventListeners').and.callThrough();

    fixture.componentInstance.attachAsyncPopover();
    fixture.detectChanges();

    fixture.componentInstance.attachAnotherAsyncPopover();
    fixture.detectChanges();

    expect(callerInstance.skyPopover).toBeDefined();
    expect(addEventSpy.calls.count()).toEqual(2);
    expect(removeEventSpy.calls.count()).toEqual(2);
  });

  it('should not add listeners to undefined popovers', () => {
    const caller = directiveElements[4];
    const callerInstance = caller.injector.get(SkyPopoverDirective);

    fixture.componentInstance.attachAsyncPopover();
    fixture.detectChanges();

    const addEventSpy = spyOn(callerInstance as any, 'addEventListeners').and.callThrough();
    const removeEventSpy = spyOn(callerInstance as any, 'removeEventListeners').and.callThrough();

    fixture.componentInstance.asyncPopoverRef = undefined;
    fixture.detectChanges();

    expect(callerInstance.skyPopover).toBeUndefined();
    expect(addEventSpy).not.toHaveBeenCalled();
    expect(removeEventSpy).toHaveBeenCalled();
  });

  describe('message stream', () => {
    it('should allow opening and closing the menu', fakeAsync(() => {
      const caller = directiveElements[5];
      const callerInstance = caller.injector.get(SkyPopoverDirective);
      const openSpy = spyOn(callerInstance.skyPopover, 'positionNextTo').and.stub();
      const closeSpy = spyOn(callerInstance.skyPopover, 'close').and.stub();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      let component = fixture.componentInstance;
      component.sendMessage(SkyPopoverMessageType.Open);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(openSpy).toHaveBeenCalled();

      component.sendMessage(SkyPopoverMessageType.Close);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(closeSpy).toHaveBeenCalled();

      fixture.destroy();
    }));
  });

  it('should pass accessibility', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});

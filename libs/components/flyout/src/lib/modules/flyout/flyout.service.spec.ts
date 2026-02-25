import { ApplicationRef } from '@angular/core';
import { TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { expect } from '@skyux-sdk/testing';
import { SkyAppWindowRef, SkyDynamicComponentService } from '@skyux/core';

import { SkyFlyoutFixturesModule } from './fixtures/flyout-fixtures.module';
import { SkyFlyoutHostsTestComponent } from './fixtures/flyout-hosts.component.fixture';
import { SkyFlyoutAdapterService } from './flyout-adapter.service';
import { SkyFlyoutService } from './flyout.service';

describe('Flyout service', () => {
  let service: SkyFlyoutService;
  let applicationRef: ApplicationRef;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyFlyoutFixturesModule],
      providers: [SkyAppWindowRef, SkyFlyoutAdapterService],
    });

    service = TestBed.inject(SkyFlyoutService);

    // Needed in order to fix an odd timing issue in IE
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(1100);
  });

  beforeEach(inject(
    [ApplicationRef, Router],
    (_applicationRef: ApplicationRef, _router: Router) => {
      applicationRef = _applicationRef;
      router = _router;
    },
  ));

  function completeFlyoutTransition(): void {
    const flyoutEl = document.querySelector('.sky-flyout');
    if (flyoutEl) {
      flyoutEl.dispatchEvent(
        new TransitionEvent('transitionend', { propertyName: 'transform' }),
      );
    }
  }

  it('should only create a single host component', () => {
    service.open(SkyFlyoutHostsTestComponent);
    service.open(SkyFlyoutHostsTestComponent);

    expect(document.querySelectorAll('sky-flyout').length).toEqual(1);
  });

  it('should return an instance with a close method', () => {
    const flyout = service.open(SkyFlyoutHostsTestComponent);
    expect(typeof flyout.close).toEqual('function');
  });

  it('should expose a method to remove the flyout from the DOM', fakeAsync(() => {
    spyOn(window as any, 'setTimeout').and.callFake((fun: any) => {
      fun();
      return 0;
    });
    service.open(SkyFlyoutHostsTestComponent);
    applicationRef.tick();
    const dynamicService = TestBed.inject(SkyDynamicComponentService);
    const spy = spyOn(dynamicService, 'removeComponent').and.callThrough();
    service.close();
    applicationRef.tick();
    completeFlyoutTransition();
    tick();
    expect(spy).toHaveBeenCalled();
  }));

  it('should respect ignoring the before close handler when closing the flyout', fakeAsync(() => {
    spyOn(window as any, 'setTimeout').and.callFake((fun: any) => {
      fun();
      return 0;
    });
    const instance = service.open(SkyFlyoutHostsTestComponent);
    instance.beforeClose.subscribe(() => {
      fail('Should not have fired the beforeClose event if ignoring it');
      return;
    });
    applicationRef.tick();
    const dynamicService = TestBed.inject(SkyDynamicComponentService);
    const spy = spyOn(dynamicService, 'removeComponent').and.callThrough();
    service.close({ ignoreBeforeClose: true });
    applicationRef.tick();
    completeFlyoutTransition();
    tick();
    expect(spy).toHaveBeenCalled();
  }));

  it('should dispose of any open host if the service is destroyed', () => {
    spyOn(window as any, 'setTimeout').and.callFake((fun: any) => {
      fun();
      return 0;
    });
    service.open(SkyFlyoutHostsTestComponent);
    applicationRef.tick();
    const dynamicService = TestBed.inject(SkyDynamicComponentService);
    const spy = spyOn(dynamicService, 'removeComponent').and.callThrough();
    // Note: Calling the lifecycle function directly as there is no way to destroy the service
    // as it would be in the wild.
    service.ngOnDestroy();
    applicationRef.tick();
    expect(spy).toHaveBeenCalled();
  });

  it('should close when the user navigates through history', fakeAsync(async () => {
    service.open(SkyFlyoutHostsTestComponent);
    const closeSpy = spyOn(service, 'close').and.callThrough();
    tick();
    applicationRef.tick();

    await router.navigate(['/']);

    tick();
    applicationRef.tick();

    expect(closeSpy).toHaveBeenCalled();
  }));

  it('should remove the host after close when the user navigates through history', fakeAsync(async () => {
    service.open(SkyFlyoutHostsTestComponent);
    const dynamicService = TestBed.inject(SkyDynamicComponentService);
    const removeComponentSpy = spyOn(
      dynamicService,
      'removeComponent',
    ).and.callThrough();

    tick();
    applicationRef.tick();

    await router.navigate(['/']);

    tick();
    applicationRef.tick();

    expect(removeComponentSpy).toHaveBeenCalledTimes(1);
  }));

  it('should remove the host when the user navigates through history if no closed event is fired in 500ms - sanity check', fakeAsync(async () => {
    const instance = service.open(SkyFlyoutHostsTestComponent);
    const dynamicService = TestBed.inject(SkyDynamicComponentService);
    const removeComponentSpy = spyOn(
      dynamicService,
      'removeComponent',
    ).and.callThrough();
    spyOn(instance.closed, 'emit');

    tick();
    applicationRef.tick();

    await router.navigate(['/']);

    tick();
    applicationRef.tick();

    expect(removeComponentSpy).toHaveBeenCalled();
  }));

  it('should not close on route change if it is already closed', fakeAsync(async () => {
    service.open(SkyFlyoutHostsTestComponent);
    const closeSpy = spyOn(service, 'close').and.callThrough();

    tick();
    applicationRef.tick();

    service.close();

    tick();
    applicationRef.tick();
    completeFlyoutTransition();

    expect(closeSpy).toHaveBeenCalled();
    closeSpy.calls.reset();

    await router.navigate(['/']);
    tick();

    expect(closeSpy).not.toHaveBeenCalled();

    applicationRef.tick();
  }));
});

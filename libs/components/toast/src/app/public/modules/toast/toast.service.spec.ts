// #region imports
import {
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@blackbaud/skyux-builder/runtime/testing/browser';

import {
  SkyDynamicComponentService
} from '@skyux/core';

import 'rxjs/add/operator/take';

import {
  SkyToastType
} from './types';

import {
  SkyToast
} from './toast';

import {
  SkyToastService
} from './toast.service';
// #endregion

describe('Toast service', () => {
  let toastService: SkyToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SkyToastService,
        {
          provide: SkyDynamicComponentService,
          useValue: {
            createComponent() {
              return {
                instance: {
                  closeAll() {}
                }
              };
            },
            removeComponent() {}
          }
        }
      ]
    });

    toastService = TestBed.get(SkyToastService);
  });

  it('should only create a single host component', () => {
    const spy = spyOn(toastService as any, 'createHostComponent').and.callThrough();
    toastService.openMessage('message');
    toastService.openMessage('message');
    expect(spy.calls.count()).toEqual(1);
  });

  it('should return an instance with a close method', () => {
    const toast = toastService.openMessage('message');
    expect(typeof toast.close).toEqual('function');
  });

  it('should only remove the host element if it exists', () => {
    toastService.openMessage('message');
    const dynamicService = TestBed.get(SkyDynamicComponentService);
    const spy = spyOn(dynamicService, 'removeComponent').and.callThrough();
    toastService['removeHostComponent']();
    toastService['removeHostComponent']();
    expect(spy.calls.count()).toEqual(1);
  });

  it('should expose a method to remove the toast from the DOM', () => {
    toastService.openMessage('message');
    const spy = spyOn(toastService['host'].instance, 'closeAll').and.callFake(() => {});
    toastService.ngOnDestroy();
    expect(spy).toHaveBeenCalledWith();
  });

  describe('openMessage() method', () => {
    it('should open a toast with the given message and configuration', function() {
      const instance = toastService.openMessage('Real message', {
        type: SkyToastType.Danger
      });

      expect(instance).toBeTruthy();
      expect(instance.close).toBeTruthy();

      let isClosedCalled = false;
      instance.closed.subscribe(() => isClosedCalled = true);

      expect(isClosedCalled).toEqual(false);
      instance.close();
      expect(isClosedCalled).toEqual(true);
    });

    it('should remove message from queue when the message is closed', () => {
      const instance = toastService.openMessage('My message');

      let isClosedCalled = false;
      instance.closed.subscribe(() => isClosedCalled = true);

      instance.close();

      toastService.toastStream.take(1).subscribe((value) => {
        expect(value.length).toEqual(0);
        expect(isClosedCalled).toBeTruthy();
      });
    });

    it('should complete the instance closed emitter', () => {
      const instance = toastService.openMessage('My message');
      let numTimesCalled = 0;
      instance.closed.subscribe(() => {
        numTimesCalled++;
      });
      instance.close();
      instance.close();
      instance.close();
      expect(numTimesCalled).toEqual(1);
    });
  });

  describe('openComponent() method', () => {
    class TestContext {
      public message: string;
    }

    class TestComponent { }

    it('should open a custom toast with the given component type and configuration', () => {
      const context = new TestContext();
      context.message = 'Hello!';

      const providers = {
        provide: TestContext,
        useValue: context
      };

      const instance = toastService.openComponent(
        TestComponent,
        {
          type: SkyToastType.Danger
        },
        [providers]
      );

      toastService.toastStream.take(1).subscribe((toasts: SkyToast[]) => {
        expect(toasts[0].bodyComponentProviders[0]).toEqual(providers);
      });

      expect(instance).toBeTruthy();
      expect(instance.close).toBeTruthy();

      let isClosedCalled = false;
      instance.closed.subscribe(() => isClosedCalled = true);

      expect(isClosedCalled).toEqual(false);
      instance.close();
      expect(isClosedCalled).toEqual(true);
    });

    it('should handle empty providers', () => {
      toastService.openComponent(TestComponent, {
        type: SkyToastType.Danger
      });

      toastService.toastStream.take(1).subscribe((toasts: SkyToast[]) => {
        expect(toasts[0].bodyComponentProviders.length).toEqual(1);
      });
    });
  });
});

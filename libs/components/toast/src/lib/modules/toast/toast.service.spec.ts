// #region imports
import { TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyDynamicComponentService } from '@skyux/core';

import { take } from 'rxjs/operators';

import { SkyToast } from './toast';
import { SkyToastService } from './toast.service';
import { SkyToasterComponent } from './toaster.component';
import { SkyToastType } from './types/toast-type';

// #endregion

interface MockComponentRef {
  instance: {
    closeAll: jasmine.Spy;
  };
}

describe('Toast service', () => {
  let toastSvc: SkyToastService;
  let mockSkyDynamicComponentSvc: jasmine.SpyObj<{
    createComponent(): MockComponentRef;
    removeComponent(): void;
  }>;

  let fakeToasterCompRef: MockComponentRef;

  beforeEach(() => {
    fakeToasterCompRef = {
      instance: {
        closeAll: jasmine.createSpy('closeAll'),
      },
    };

    mockSkyDynamicComponentSvc = jasmine.createSpyObj(
      'mockSkyDynamicComponentSvc',
      ['createComponent', 'removeComponent']
    );

    mockSkyDynamicComponentSvc.createComponent.and.returnValue(
      fakeToasterCompRef
    );

    TestBed.configureTestingModule({
      providers: [
        SkyToastService,
        {
          provide: SkyDynamicComponentService,
          useValue: mockSkyDynamicComponentSvc,
        },
      ],
    });

    toastSvc = TestBed.inject(SkyToastService);
  });

  it('should only create a single host component', () => {
    toastSvc.openMessage('message');
    toastSvc.openMessage('message');
    expect(mockSkyDynamicComponentSvc.createComponent).toHaveBeenCalledOnceWith(
      SkyToasterComponent
    );
  });

  it('should return an instance with a close method', () => {
    const toast = toastSvc.openMessage('message');
    expect(typeof toast.close).toEqual('function');
  });

  it('should only remove the host element if it exists', () => {
    const instance = toastSvc.openMessage('message');
    instance.close();

    expect(mockSkyDynamicComponentSvc.removeComponent).toHaveBeenCalledOnceWith(
      fakeToasterCompRef
    );
  });

  it('should expose a method to remove the toast from the DOM', () => {
    toastSvc.openMessage('message');
    toastSvc.ngOnDestroy();
    expect(fakeToasterCompRef.instance.closeAll).toHaveBeenCalledWith();
  });

  describe('openMessage() method', () => {
    it('should open a toast with the given message and configuration', function () {
      const instance = toastSvc.openMessage('Real message', {
        type: SkyToastType.Danger,
      });

      expect(instance).toBeTruthy();
      expect(instance.close).toBeTruthy();

      let isClosedCalled = false;
      instance.closed.subscribe(() => (isClosedCalled = true));

      expect(isClosedCalled).toEqual(false);
      instance.close();
      expect(isClosedCalled).toEqual(true);
    });

    it('should remove message from queue when the message is closed', () => {
      const instance = toastSvc.openMessage('My message');

      let isClosedCalled = false;
      instance.closed.subscribe(() => (isClosedCalled = true));

      instance.close();

      toastSvc.toastStream.pipe(take(1)).subscribe((value) => {
        expect(value.length).toEqual(0);
        expect(isClosedCalled).toBeTruthy();
      });
    });

    it('should complete the instance closed emitter', () => {
      const instance = toastSvc.openMessage('My message');
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
      public message: string | undefined;
    }

    class TestComponent {}

    it('should open a custom toast with the given component type and configuration', () => {
      const context = new TestContext();
      context.message = 'Hello!';

      const providers = {
        provide: TestContext,
        useValue: context,
      };

      const instance = toastSvc.openComponent(
        TestComponent,
        {
          type: SkyToastType.Danger,
        },
        [providers]
      );

      toastSvc.toastStream.pipe(take(1)).subscribe((toasts: SkyToast[]) => {
        expect(toasts[0].bodyComponentProviders[0]).toEqual(providers);
      });

      expect(instance).toBeTruthy();
      expect(instance.close).toBeTruthy();

      let isClosedCalled = false;
      instance.closed.subscribe(() => (isClosedCalled = true));

      expect(isClosedCalled).toEqual(false);
      instance.close();
      expect(isClosedCalled).toEqual(true);
    });

    it('should handle empty providers', () => {
      toastSvc.openComponent(TestComponent, {
        type: SkyToastType.Danger,
      });

      toastSvc.toastStream.pipe(take(1)).subscribe((toasts: SkyToast[]) => {
        expect(toasts[0].bodyComponentProviders.length).toEqual(1);
      });
    });
  });
});

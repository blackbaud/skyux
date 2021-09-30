import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyToastFixturesModule
} from './fixtures/toast-fixtures.module';

import {
  SkyToastTestComponent
} from './fixtures/toast.component.fixture';

import {
  SkyToastWithToasterServiceTestComponent
} from './fixtures/toast-with-toaster-service.component.fixture';

import {
  SkyToastComponent
} from './toast.component';

import {
  SkyToastService
} from './toast.service';

import {
  SkyToasterService
} from './toaster.service';

import {
  SkyToastType
} from './types/toast-type';

describe('Toast component', () => {
  let fixture: ComponentFixture<SkyToastTestComponent>;
  let component: SkyToastTestComponent;
  let toastComponent: SkyToastComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyToastFixturesModule
      ]
    });

    TestBed.overrideComponent(
      SkyToastWithToasterServiceTestComponent,
      {
        add: {
          providers: [
            SkyToasterService
          ]
        }
      }
    );

    fixture = TestBed.createComponent(SkyToastTestComponent);
  });

  afterEach(() => {
    TestBed.get(SkyToastService).ngOnDestroy();
    fixture.detectChanges();
    fixture.destroy();
  });

  function verifyType(type?: SkyToastType) {
    component.toastType = type;
    fixture.detectChanges();

    let className: string;
    if (SkyToastType[type]) {
      className = `sky-toast-${SkyToastType[type].toLowerCase()}`;
    } else {
      className = `sky-toast-info`;
    }

    expect(className).toEqual(toastComponent.classNames);
  }

  function setupTest(): void {
    fixture.detectChanges();
    component = fixture.componentInstance;
    toastComponent = component.toastComponent;
  }

  it('should set defaults', () => {
    setupTest();
    expect(toastComponent.toastType).toEqual(SkyToastType.Info);
  });

  it('should allow setting the toast type', () => {
    setupTest();
    verifyType(); // default
    verifyType(SkyToastType.Info);
    verifyType(SkyToastType.Success);
    verifyType(SkyToastType.Warning);
    verifyType(SkyToastType.Danger);
  });

  it('should close the toast when clicking close button', () => {
    setupTest();
    fixture.detectChanges();
    expect(toastComponent['isOpen']).toEqual(true);
    expect(toastComponent.animationState).toEqual('open');
    fixture.nativeElement.querySelector('.sky-toast-btn-close').click();
    fixture.detectChanges();
    expect(toastComponent['isOpen']).toEqual(false);
    expect(toastComponent.animationState).toEqual('closed');
  });

  it('should set aria attributes', () => {
    setupTest();
    expect(toastComponent.ariaLive).toEqual('polite');
    expect(toastComponent.ariaRole).toEqual(undefined);
    fixture.componentInstance.toastType = SkyToastType.Danger;
    fixture.detectChanges();
    expect(toastComponent.ariaLive).toEqual('assertive');
    expect(toastComponent.ariaRole).toEqual('alert');
  });

  it('should pass accessibility', async(() => {
    setupTest();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));

  describe('auto-close option', () => {
    function waitForAutoClose() {
      tick(7000);
    }

    it('should auto-close the toast if set to true', fakeAsync(() => {
      fixture.componentInstance.autoClose = true;

      setupTest();

      expect(toastComponent['isOpen']).toBe(true);

      waitForAutoClose();

      expect(toastComponent['isOpen']).toBe(false);
    }));

    describe('with toaster service', () => {
      let withServiceFixture: ComponentFixture<SkyToastWithToasterServiceTestComponent>;
      let withServiceComponent: SkyToastWithToasterServiceTestComponent;
      let withServiceToastComponent: SkyToastComponent;

      function validateToastOpen(open: boolean) {
        expect(withServiceToastComponent['isOpen']).toBe(open);
      }

      beforeEach(() => {
        withServiceFixture = TestBed.createComponent(SkyToastWithToasterServiceTestComponent);
        fixture.detectChanges();
        withServiceComponent = withServiceFixture.componentInstance;
        withServiceToastComponent = withServiceComponent.toastComponent;
      });

      it(
        'should not auto-close when the toaster service reports the cursor is over the toast area', fakeAsync(() => {
          withServiceComponent.autoClose = true;

          withServiceFixture.detectChanges();

          withServiceComponent.toasterService.mouseOver.next(true);

          waitForAutoClose();

          validateToastOpen(true);

          withServiceComponent.toasterService.mouseOver.next(false);

          waitForAutoClose();

          validateToastOpen(false);
        })
      );

      it('should not auto-close when the toaster service reports focus is in the toast area',
        fakeAsync(() => {
          withServiceComponent.autoClose = true;

          withServiceFixture.detectChanges();

          withServiceComponent.toasterService.focusIn.next(true);

          waitForAutoClose();

          validateToastOpen(true);

          withServiceComponent.toasterService.focusIn.next(false);

          waitForAutoClose();

          validateToastOpen(false);
        })
      );
    });
  });
});

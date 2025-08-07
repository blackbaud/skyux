import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyToastFixturesModule } from './fixtures/toast-fixtures.module';
import { SkyToastWithToasterServiceTestComponent } from './fixtures/toast-with-toaster-service.component.fixture';
import { SkyToastTestComponent } from './fixtures/toast.component.fixture';
import { SkyToastComponent } from './toast.component';
import { SkyToastService } from './toast.service';
import { SkyToasterService } from './toaster.service';
import { SkyToastType } from './types/toast-type';

describe('Toast component', () => {
  let fixture: ComponentFixture<SkyToastTestComponent>;
  let component: SkyToastTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyToastFixturesModule],
    });

    TestBed.overrideComponent(SkyToastWithToasterServiceTestComponent, {
      add: {
        providers: [SkyToasterService],
      },
    });

    fixture = TestBed.createComponent(SkyToastTestComponent);
  });

  afterEach(() => {
    TestBed.inject(SkyToastService).ngOnDestroy();
    fixture.detectChanges();
    fixture.destroy();
  });

  function verifyType(type?: SkyToastType) {
    if (component) {
      component.toastType = type;
    }

    fixture.detectChanges();

    let className: string;
    if (type !== undefined && SkyToastType[type]) {
      className = `sky-toast-${SkyToastType[type].toLowerCase()}`;
    } else {
      className = `sky-toast-info`;
    }

    expect(component.toastComponent?.classNames).toEqual(className);
  }

  function validateIcon(
    type: SkyToastType | undefined,
    expectedIcon: string,
  ): void {
    if (type) {
      component.toastType = type;
    }

    fixture.detectChanges();

    const toastEl = document.querySelector('sky-toast');

    const iconEl = toastEl?.querySelector('sky-icon-svg');

    expect(iconEl?.getAttribute('data-sky-icon')).toBe(expectedIcon);
  }

  function setupTest(): void {
    fixture.detectChanges();
    component = fixture.componentInstance;
  }

  it('should allow setting the toast type', () => {
    setupTest();
    verifyType(); // default
    verifyType(SkyToastType.Info);
    verifyType(SkyToastType.Success);
    verifyType(SkyToastType.Warning);
    verifyType(SkyToastType.Danger);
  });

  it('should show the correct icon based on the icon type', () => {
    setupTest();
    validateIcon(undefined, 'info'); // default
    validateIcon(SkyToastType.Info, 'info');
    validateIcon(SkyToastType.Success, 'success');
    validateIcon(SkyToastType.Warning, 'warning');
    validateIcon(SkyToastType.Danger, 'warning');
  });

  it('should close the toast when clicking close button', () => {
    setupTest();
    fixture.detectChanges();
    expect(component.toastComponent?.isOpen).toEqual(true);
    fixture.nativeElement.querySelector('.sky-toast-btn-close').click();
    fixture.detectChanges();
    expect(component.toastComponent?.isOpen).toEqual(false);
  });

  it('should pass accessibility', async () => {
    setupTest();
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  describe('auto-close option', () => {
    function waitForAutoClose() {
      tick(7000);
    }

    it('should auto-close the toast if set to true', fakeAsync(() => {
      fixture.componentInstance.autoClose = true;

      setupTest();

      expect(component.toastComponent?.isOpen).toBe(true);

      waitForAutoClose();

      expect(component.toastComponent?.isOpen).toBe(false);
    }));

    describe('with toaster service', () => {
      let withServiceFixture: ComponentFixture<SkyToastWithToasterServiceTestComponent>;
      let withServiceComponent: SkyToastWithToasterServiceTestComponent;
      let withServiceToastComponent: SkyToastComponent | undefined;

      function validateToastOpen(open: boolean) {
        expect(withServiceToastComponent?.isOpen).toBe(open);
      }

      beforeEach(() => {
        withServiceFixture = TestBed.createComponent(
          SkyToastWithToasterServiceTestComponent,
        );
        fixture.detectChanges();
        withServiceComponent = withServiceFixture.componentInstance;
        withServiceToastComponent = withServiceComponent.toastComponent;
      });

      it('should not auto-close when the toaster service reports the cursor is over the toast area', fakeAsync(() => {
        withServiceComponent.autoClose = true;

        withServiceFixture.detectChanges();

        withServiceComponent.toasterService.mouseOver.next(true);

        waitForAutoClose();

        validateToastOpen(true);

        withServiceComponent.toasterService.mouseOver.next(false);

        waitForAutoClose();

        validateToastOpen(false);
      }));

      it('should not auto-close when the toaster service reports focus is in the toast area', fakeAsync(() => {
        withServiceComponent.autoClose = true;

        withServiceFixture.detectChanges();

        withServiceComponent.toasterService.focusIn.next(true);

        waitForAutoClose();

        validateToastOpen(true);

        withServiceComponent.toasterService.focusIn.next(false);

        waitForAutoClose();

        validateToastOpen(false);
      }));
    });
  });
});

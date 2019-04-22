import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyToastFixturesModule,
  SkyToastTestComponent
} from './fixtures';

import {
  SkyToastComponent
} from './toast.component';

import {
  SkyToastService
} from './toast.service';

import {
  SkyToastType
} from './types';

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

    fixture = TestBed.createComponent(SkyToastTestComponent);
    component = fixture.componentInstance;
    toastComponent = component.toastComponent;
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

  it('should set defaults', () => {
    expect(toastComponent.toastType).toEqual(SkyToastType.Info);
  });

  it('should allow setting the toast type', () => {
    verifyType(); // default
    verifyType(SkyToastType.Info);
    verifyType(SkyToastType.Success);
    verifyType(SkyToastType.Warning);
    verifyType(SkyToastType.Danger);
  });

  it('should close the toast when clicking close button', () => {
    fixture.detectChanges();
    expect(toastComponent['isOpen']).toEqual(true);
    expect(toastComponent.animationState).toEqual('open');
    fixture.nativeElement.querySelector('.sky-toast-btn-close').click();
    fixture.detectChanges();
    expect(toastComponent['isOpen']).toEqual(false);
    expect(toastComponent.animationState).toEqual('closed');
  });

  it('should set aria attributes', () => {
    expect(toastComponent.ariaLive).toEqual('polite');
    expect(toastComponent.ariaRole).toEqual(undefined);
    fixture.componentInstance.toastType = SkyToastType.Danger;
    fixture.detectChanges();
    expect(toastComponent.ariaLive).toEqual('assertive');
    expect(toastComponent.ariaRole).toEqual('alert');
  });

  it('should pass accessibility', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});

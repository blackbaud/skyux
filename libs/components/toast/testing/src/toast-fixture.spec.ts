import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyToastModule, SkyToastType } from '@skyux/toast';

import { SkyToastFixture } from './toast-fixture';

//#region Test component
@Component({
  selector: 'sky-toast-test',
  template: `
    <sky-toast
      data-sky-id="test-toast"
      [toastType]="toastTypeValue"
      (closed)="onClosed()"
    >
      This is a sample toast.
    </sky-toast>
  `,
})
class TestComponent {
  public set toastType(value: string) {
    switch (value) {
      case 'danger':
        this.toastTypeValue = SkyToastType.Danger;
        break;
      case 'info':
        this.toastTypeValue = SkyToastType.Info;
        break;
      case 'success':
        this.toastTypeValue = SkyToastType.Success;
        break;
      case 'warning':
        this.toastTypeValue = SkyToastType.Warning;
        break;
      default:
        this.toastTypeValue = undefined;
        break;
    }
  }

  public toastTypeValue: SkyToastType;

  public onClosed(): void {}
}
//#endregion Test component

describe('Toast fixture', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyToastModule, NoopAnimationsModule],
    });
  });

  it('should expose the expected properties', () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    const toast = new SkyToastFixture(fixture, 'test-toast');

    expect(toast.text).toBe('This is a sample toast.');

    const validToastTypes = ['info', 'success', 'warning', 'danger'];

    for (const validToastType of validToastTypes) {
      fixture.componentInstance.toastType = validToastType;

      fixture.detectChanges();

      expect(toast.toastType).toBe(validToastType);
    }

    fixture.componentInstance.toastType = 'invalid';

    fixture.detectChanges();

    expect(toast.toastType).toBe('info');
  });

  it("should provide a method for clicking the toast's close button", (done) => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    const toast = new SkyToastFixture(fixture, 'test-toast');

    spyOn(fixture.componentInstance, 'onClosed').and.callFake(() => {
      done();
    });

    toast.clickCloseButton();

    fixture.detectChanges();
  });
});

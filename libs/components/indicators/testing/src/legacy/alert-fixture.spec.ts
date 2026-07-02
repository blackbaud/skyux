import { Component, model } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkyAlertModule } from '@skyux/indicators';

import { SkyAlertFixture } from './alert-fixture';

//#region Test component
@Component({
  selector: 'sky-alert-test',
  template: `
    <sky-alert
      [alertType]="alertType()"
      [closeable]="closeable()"
      [closed]="closed()"
      (closedChange)="closedChange()"
      data-sky-id="test-alert"
    >
      This is a sample alert.
    </sky-alert>
  `,
  standalone: false,
})
class TestComponent {
  public alertType = model('warning');

  public closeable = model(true);

  public closed = model(false);

  public closedChange() {}
}
//#endregion Test component

describe('Alert fixture', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyAlertModule],
    });
  });

  it('should expose the expected properties', () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    const alert = new SkyAlertFixture(fixture, 'test-alert');

    expect(alert.closeable).toBe(true);
    expect(alert.closed).toBe(false);
    expect(alert.text).toBe('This is a sample alert.');

    const validAlertTypes = ['info', 'success', 'warning', 'danger'];

    for (const validAlertType of validAlertTypes) {
      fixture.componentRef.setInput('alertType', validAlertType);

      fixture.detectChanges();

      expect(alert.alertType).toBe(validAlertType);
    }

    fixture.componentRef.setInput('alertType', 'invalid');

    fixture.detectChanges();

    expect(alert.alertType).toBeUndefined();
  });

  it('should provide a method for closing the alert', () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.componentRef.setInput('closeable', false);

    fixture.detectChanges();

    const alert = new SkyAlertFixture(fixture, 'test-alert');

    expect(() => alert.close()).toThrowError('The alert is not closeable.');

    fixture.componentRef.setInput('closeable', true);

    fixture.detectChanges();

    expect(alert.closed).toBe(false);

    const closedChangeSpy = spyOn(fixture.componentInstance, 'closedChange');

    alert.close();

    fixture.detectChanges();

    expect(closedChangeSpy).toHaveBeenCalled();
    expect(alert.closed).toBe(true);
  });
});

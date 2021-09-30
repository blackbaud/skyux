import {
  TestBed
} from '@angular/core/testing';

import {
  Component
} from '@angular/core';

import {
  SkyAlertModule
} from '@skyux/indicators';

import {
  SkyAlertFixture
} from './alert-fixture';

//#region Test component
@Component({
  selector: 'alert-test',
  template: `
<sky-alert
  [alertType]="alertType"
  [closeable]="closeable"
  [closed]="closed"
  (closedChange)="closedChange()"
  data-sky-id="test-alert"
>
  This is a sample alert.
</sky-alert>
  `
})
class TestComponent {
  public alertType = 'warning';

  public closeable = true;

  public closed = false;

  public closedChange() { }
}
//#endregion Test component

describe('Alert fixture', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent
      ],
      imports: [
        SkyAlertModule
      ]
    });
  });

  it('should expose the expected properties', () => {
    const fixture = TestBed.createComponent(
      TestComponent
    );

    fixture.detectChanges();

    const alert = new SkyAlertFixture(
      fixture,
      'test-alert'
    );

    expect(alert.closeable).toBe(true);
    expect(alert.closed).toBe(false);
    expect(alert.text).toBe('This is a sample alert.');

    const validAlertTypes = [
      'info',
      'success',
      'warning',
      'danger'
    ];

    for (const validAlertType of validAlertTypes) {
      fixture.componentInstance.alertType = validAlertType;

      fixture.detectChanges();

      expect(alert.alertType).toBe(validAlertType);
    }

    fixture.componentInstance.alertType = 'invalid';

    fixture.detectChanges();

    expect(alert.alertType).toBeUndefined();
  });

  it('should provide a method for closing the alert', () => {
    const fixture = TestBed.createComponent(
      TestComponent
    );

    fixture.componentInstance.closeable = false;

    fixture.detectChanges();

    const alert = new SkyAlertFixture(
      fixture,
      'test-alert'
    );

    expect(() => alert.close()).toThrowError('The alert is not closeable.');

    fixture.componentInstance.closeable = true;

    fixture.detectChanges();

    expect(alert.closed).toBe(false);

    const closedChangeSpy = spyOn(fixture.componentInstance, 'closedChange');

    alert.close();

    fixture.detectChanges();

    expect(closedChangeSpy).toHaveBeenCalled();
    expect(alert.closed).toBe(true);
  });

});

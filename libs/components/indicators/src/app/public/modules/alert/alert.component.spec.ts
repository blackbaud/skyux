import {
  async,
  TestBed
} from '@angular/core/testing';

import { BrowserModule } from '@angular/platform-browser';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyAppResourcesService
} from '@skyux/i18n';

import {
  SkyAppResourcesTestService
} from '@skyux/i18n/testing';

import { AlertTestComponent } from './fixtures/alert.component.fixture';
import { SkyAlertModule } from '../alert/alert.module';

describe('Alert component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AlertTestComponent
      ],
      imports: [
        BrowserModule,
        SkyAlertModule
      ],
      providers: [
        {
          provide: SkyAppResourcesService,
          useClass: SkyAppResourcesTestService
        }
      ]
    });
  });

  it('should hide the close button if it is not cloesable', async(() => {
    let fixture = TestBed.createComponent(AlertTestComponent);
    let cmp = fixture.componentInstance as AlertTestComponent;
    let el = fixture.nativeElement as HTMLElement;

    cmp.closeable = true;

    fixture.detectChanges();

    let closeAttrs: any = el.querySelector('.sky-alert-close').attributes;

    expect(closeAttrs['hidden']).toBe(undefined);

    cmp.closeable = false;
    fixture.detectChanges();

    expect(closeAttrs['hidden']).not.toBeNull();
    expect(fixture.nativeElement).toBeAccessible();
  }));

  it('should be hidden when the close button is clicked', async(() => {
    let fixture = TestBed.createComponent(AlertTestComponent);
    let cmp = fixture.componentInstance as AlertTestComponent;
    let el = fixture.nativeElement;

    cmp.closeable = true;

    fixture.detectChanges();

    el.querySelector('.sky-alert-close').click();

    expect(el.querySelector('.sky-alert').attributes.hidden).not.toBeNull();
    expect(cmp.closed).toBe(true);
    expect(fixture.nativeElement).toBeAccessible();
  }));

  it('should allow the screen reader text for the close button to be localizable', async(() => {
    let fixture = TestBed.createComponent(AlertTestComponent);
    let cmp = fixture.componentInstance as AlertTestComponent;
    let el = fixture.nativeElement as HTMLElement;
    let closeEl: any;

    cmp.closeable = true;

    fixture.detectChanges();

    closeEl = el.querySelector('.sky-alert-close');

    expect(closeEl.getAttribute('aria-label')).toBe('Close the alert');
    expect(fixture.nativeElement).toBeAccessible();
  }));

  it('should add the appropriate styling when an alert type is specified', async(() => {
    let fixture = TestBed.createComponent(AlertTestComponent);
    let cmp = fixture.componentInstance as AlertTestComponent;
    let el = fixture.nativeElement as HTMLElement;

    cmp.alertType = 'success';

    fixture.detectChanges();

    let alertEl = el.querySelector('.sky-alert');

    expect(alertEl.classList.contains('sky-alert-success')).toBe(true);
    expect(fixture.nativeElement).toBeAccessible();
  }));

  it('should default to "warning" when no alert type is specified', async(() => {
    let fixture = TestBed.createComponent(AlertTestComponent);
    let cmp = fixture.componentInstance as AlertTestComponent;
    let el = fixture.nativeElement as HTMLElement;

    cmp.alertType = undefined;

    fixture.detectChanges();

    let alertEl = el.querySelector('.sky-alert');

    expect(alertEl.classList.contains('sky-alert-warning')).toBe(true);
    expect(fixture.nativeElement).toBeAccessible();
  }));

  it('should have a role of "alert"', async(() => {
    let fixture = TestBed.createComponent(AlertTestComponent);
    let cmp = fixture.componentInstance as AlertTestComponent;
    let el = fixture.nativeElement as HTMLElement;

    cmp.alertType = undefined;

    fixture.detectChanges();

    let alertEl = el.querySelector('.sky-alert');

    expect(alertEl.getAttribute('role')).toBe('alert');
    expect(fixture.nativeElement).toBeAccessible();
  }));
});

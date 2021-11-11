import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@skyux-sdk/testing';

import { StatusIndicatorTestComponent } from './fixtures/status-indicator.component.fixture';

import { SkyStatusIndicatorModule } from './status-indicator.module';

describe('Status indicator component', () => {
  function getStatusIndicatorEl(
    fixture: ComponentFixture<StatusIndicatorTestComponent>
  ): HTMLDivElement {
    return fixture.nativeElement.querySelector('.sky-status-indicator');
  }

  function validateIconWrapperClass(
    statusIndicatorEl: HTMLElement,
    indicatorType: string
  ): void {
    const iconWrapperEl = statusIndicatorEl.querySelector(
      '.sky-status-indicator-icon'
    );

    expect(iconWrapperEl).toHaveCssClass(
      `sky-status-indicator-icon-${indicatorType || 'warning'}`
    );
  }

  function validateIcon(
    fixture: ComponentFixture<StatusIndicatorTestComponent>,
    indicatorType: string,
    expectedIcon: string
  ): void {
    fixture.componentInstance.indicatorType = indicatorType;

    fixture.detectChanges();

    const statusIndicatorEl = getStatusIndicatorEl(fixture);

    validateIconWrapperClass(statusIndicatorEl, indicatorType);

    const iconEl = statusIndicatorEl.querySelector('.sky-icon');

    expect(iconEl).toHaveCssClass(`fa-${expectedIcon}`);
  }

  function validateDescription(
    fixture: ComponentFixture<StatusIndicatorTestComponent>,
    descriptionType: string,
    expectedDescription?: string
  ): void {
    fixture.componentInstance.descriptionType = descriptionType;

    fixture.detectChanges();

    const statusIndicatorEl = getStatusIndicatorEl(fixture);

    const descriptionEl = statusIndicatorEl.querySelector(
      '.sky-status-indicator-message-wrapper .sky-screen-reader-only'
    );

    if (expectedDescription) {
      expect(descriptionEl).toHaveText(expectedDescription);
    } else {
      expect(descriptionEl).not.toExist();
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatusIndicatorTestComponent],
      imports: [SkyStatusIndicatorModule],
    });
  });

  it('should not display the status indicator if `descriptionType` is not specified', () => {
    const fixture = TestBed.createComponent(StatusIndicatorTestComponent);

    fixture.detectChanges();

    expect(getStatusIndicatorEl(fixture)).not.toExist();
  });

  it('should display the expected text', () => {
    const fixture = TestBed.createComponent(StatusIndicatorTestComponent);
    fixture.componentInstance.descriptionType = 'none';

    fixture.detectChanges();

    const statusIndicatorEl = getStatusIndicatorEl(fixture);

    const messageEl = statusIndicatorEl.querySelector(
      '.sky-status-indicator-message'
    );

    expect(messageEl).toHaveText('Indicator text');
  });

  it('should display the expected icon', () => {
    const fixture = TestBed.createComponent(StatusIndicatorTestComponent);
    fixture.componentInstance.descriptionType = 'none';

    validateIcon(fixture, undefined, 'warning');

    validateIcon(fixture, 'danger', 'warning');
    validateIcon(fixture, 'info', 'exclamation-circle');
    validateIcon(fixture, 'success', 'check');
    validateIcon(fixture, 'warning', 'warning');
  });

  it('should add the expected screen reader description based on `descriptionType`', () => {
    const fixture = TestBed.createComponent(StatusIndicatorTestComponent);
    fixture.componentInstance.customDescription = 'Custom description';

    validateDescription(fixture, 'completed', 'Completed:');
    validateDescription(
      fixture,
      'custom',
      fixture.componentInstance.customDescription
    );
    validateDescription(fixture, 'error', 'Error:');
    validateDescription(fixture, 'important-info', 'Important information:');
    validateDescription(fixture, 'none');
    validateDescription(fixture, 'warning', 'Warning:');
  });

  it('should be accessible', () => {
    const fixture = TestBed.createComponent(StatusIndicatorTestComponent);
    fixture.componentInstance.customDescription = 'Custom description';
    fixture.componentInstance.descriptionType = 'custom';

    fixture.detectChanges();

    expect(fixture.nativeElement).toBeAccessible();
  });

  describe('when modern theme', () => {
    function validateIconStack(
      fixture: ComponentFixture<StatusIndicatorTestComponent>,
      indicatorType: string,
      expectedBaseIcon: string,
      expectedTopIcon: string
    ): void {
      fixture.componentInstance.indicatorType = indicatorType;

      fixture.detectChanges();

      const statusIndicatorEl = getStatusIndicatorEl(fixture);

      validateIconWrapperClass(statusIndicatorEl, indicatorType);

      const iconStackEl = statusIndicatorEl.querySelector('.sky-icon-stack');

      const baseIconEl = iconStackEl.querySelector('.fa-stack-2x');
      const topIconEl = iconStackEl.querySelector('.fa-stack-1x');

      expect(baseIconEl).toHaveCssClass(`sky-i-${expectedBaseIcon}`);
      expect(topIconEl).toHaveCssClass(`sky-i-${expectedTopIcon}`);
    }

    it('should display the expected icon', () => {
      const fixture = TestBed.createComponent(StatusIndicatorTestComponent);
      fixture.componentInstance.descriptionType = 'none';

      validateIconStack(fixture, undefined, 'triangle-solid', 'exclamation');
      validateIconStack(fixture, 'danger', 'triangle-solid', 'exclamation');
      validateIconStack(fixture, 'info', 'circle-solid', 'help-i');
      validateIconStack(fixture, 'success', 'circle-solid', 'check');
      validateIconStack(fixture, 'warning', 'triangle-solid', 'exclamation');
    });
  });
});

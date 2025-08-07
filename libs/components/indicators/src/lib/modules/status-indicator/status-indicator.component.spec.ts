import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { StatusIndicatorTestComponent } from './fixtures/status-indicator.component.fixture';
import { SkyStatusIndicatorModule } from './status-indicator.module';

describe('Status indicator component', () => {
  function getStatusIndicatorEl(
    fixture: ComponentFixture<StatusIndicatorTestComponent>,
  ): HTMLDivElement {
    return fixture.nativeElement.querySelector(
      '#status-indicator-with-indicator-type .sky-status-indicator',
    );
  }

  function getStatusIndicatorElWithoutIndicatorType(
    fixture: ComponentFixture<StatusIndicatorTestComponent>,
  ): HTMLDivElement {
    return fixture.nativeElement.querySelector(
      '#status-indicator-without-indicator-type .sky-status-indicator',
    );
  }

  function validateIconWrapperClass(
    statusIndicatorEl: HTMLElement,
    indicatorType: string | undefined,
  ): void {
    const iconWrapperEl = statusIndicatorEl.querySelector(
      '.sky-status-indicator-icon',
    );

    expect(iconWrapperEl).toHaveCssClass(
      `sky-status-indicator-icon-${indicatorType || 'warning'}`,
    );
  }

  function validateIcon(
    fixture: ComponentFixture<StatusIndicatorTestComponent>,
    indicatorType: string | undefined,
    expectedIcon: string,
  ): void {
    let statusIndicatorEl;
    if (indicatorType) {
      fixture.componentInstance.indicatorType = indicatorType;

      fixture.detectChanges();

      statusIndicatorEl = getStatusIndicatorEl(fixture);
    } else {
      fixture.detectChanges();

      statusIndicatorEl = getStatusIndicatorElWithoutIndicatorType(fixture);
    }

    validateIconWrapperClass(statusIndicatorEl, indicatorType);

    const iconEl = statusIndicatorEl.querySelector('sky-icon-svg');

    expect(iconEl?.getAttribute('data-sky-icon')).toBe(expectedIcon);
  }

  function validateDescription(
    fixture: ComponentFixture<StatusIndicatorTestComponent>,
    descriptionType: string,
    expectedDescription?: string,
  ): void {
    fixture.componentInstance.descriptionType = descriptionType;

    fixture.detectChanges();

    const statusIndicatorEl = getStatusIndicatorEl(fixture);

    const descriptionEl = statusIndicatorEl.querySelector(
      '.sky-status-indicator-message-wrapper .sky-screen-reader-only',
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
      '.sky-status-indicator-message',
    );

    // Check exact text content here to ensure it has been trimmed by the skyTrim directive.
    expect(messageEl?.textContent).toBe('Indicator text');
  });

  it('should display the expected icon', () => {
    const fixture = TestBed.createComponent(StatusIndicatorTestComponent);
    fixture.componentInstance.descriptionType = 'none';

    validateIcon(fixture, undefined, 'warning');

    validateIcon(fixture, 'danger', 'warning');
    validateIcon(fixture, 'info', 'info');
    validateIcon(fixture, 'success', 'success');
    validateIcon(fixture, 'warning', 'warning');
  });

  it('should display the expected inline help', () => {
    const fixture = TestBed.createComponent(StatusIndicatorTestComponent);
    fixture.componentInstance.descriptionType = 'none';
    fixture.componentInstance.showHelp = true;

    fixture.detectChanges();

    const statusIndicatorEl = getStatusIndicatorEl(fixture);

    const helpEl = statusIndicatorEl.querySelector(
      '.sky-control-help-container .sky-control-help',
    );

    expect(helpEl).toHaveText('Help inline');

    // Ensure the markup in status-indicator.component.html is not altered to introduce
    // space between the indicator text and the help inline content.
    expect(statusIndicatorEl).toHaveText('Indicator textHelp inline');
  });

  it('should add the expected screen reader description based on `descriptionType`', () => {
    const fixture = TestBed.createComponent(StatusIndicatorTestComponent);
    fixture.componentInstance.customDescription = 'Custom description';

    validateDescription(fixture, 'completed', 'Completed:');
    validateDescription(
      fixture,
      'custom',
      fixture.componentInstance.customDescription,
    );
    validateDescription(fixture, 'error', 'Error:');
    validateDescription(fixture, 'important-info', 'Important information:');
    validateDescription(fixture, 'none');
    validateDescription(fixture, 'warning', 'Warning:');
    validateDescription(fixture, 'important-warning', 'Important warning:');
    validateDescription(fixture, 'danger', 'Danger:');
    validateDescription(fixture, 'caution', 'Caution:');
    validateDescription(fixture, 'success', 'Success:');
    validateDescription(fixture, 'attention', 'Attention:');
  });

  it('should be accessible', async () => {
    const fixture = TestBed.createComponent(StatusIndicatorTestComponent);
    fixture.componentInstance.customDescription = 'Custom description';
    fixture.componentInstance.descriptionType = 'custom';

    fixture.detectChanges();

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});

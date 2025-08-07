import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyAlertModule,
  SkyIndicatorDescriptionType,
  SkyIndicatorIconType,
} from '@skyux/indicators';

import { SkyAlertHarness } from './alert-harness';

//#region Test component
@Component({
  selector: 'sky-alert-test',
  template: `
    <sky-alert
      [alertType]="alertType"
      [closeable]="closeable"
      [closed]="closed"
      [customDescription]="customDescription"
      [descriptionType]="descriptionType"
      (closedChange)="closedChange()"
      data-sky-id="test-alert"
    >
      This is a sample alert.
    </sky-alert>
    <sky-alert data-sky-id="alert-2"> This is another alert. </sky-alert>
  `,
  standalone: false,
})
class TestComponent {
  public alertType = 'warning';

  public closeable = true;

  public closed = false;

  public customDescription: string | undefined;

  public descriptionType: SkyIndicatorDescriptionType | undefined;

  public closedChange(): void {
    // Only exists for the spy.
  }
}
//#endregion Test component

async function validateAlertType(
  alertHarness: SkyAlertHarness,
  fixture: ComponentFixture<TestComponent>,
  alertType: SkyIndicatorIconType,
): Promise<void> {
  fixture.componentInstance.alertType = alertType;
  fixture.detectChanges();
  await expectAsync(alertHarness.getAlertType()).toBeResolvedTo(alertType);
}

async function validateDescriptionType(
  alertHarness: SkyAlertHarness,
  fixture: ComponentFixture<TestComponent>,
  descriptionType: SkyIndicatorDescriptionType,
  customDescription?: string,
): Promise<void> {
  fixture.componentInstance.descriptionType = descriptionType;
  fixture.componentInstance.customDescription = customDescription;
  fixture.detectChanges();

  const componentDescriptionType = await alertHarness.getDescriptionType();

  expect(componentDescriptionType).toEqual(descriptionType);
}

describe('Alert harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    alertHarness: SkyAlertHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyAlertModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    let alertHarness: SkyAlertHarness;

    if (options.dataSkyId) {
      alertHarness = await loader.getHarness(
        SkyAlertHarness.with({
          dataSkyId: options.dataSkyId,
        }),
      );
    } else {
      alertHarness = await loader.getHarness(SkyAlertHarness);
    }

    return { alertHarness, fixture, loader };
  }

  it('should close the alert', async () => {
    const { alertHarness, fixture } = await setupTest();

    const closedChangeSpy = spyOn(fixture.componentInstance, 'closedChange');

    await expectAsync(alertHarness.isClosed()).toBeResolvedTo(false);

    await alertHarness.close();

    expect(closedChangeSpy).toHaveBeenCalled();
    await expectAsync(alertHarness.isClosed()).toBeResolvedTo(true);
  });

  it('should return the expected closeable value', async () => {
    const { alertHarness, fixture } = await setupTest();

    fixture.componentInstance.closeable = false;
    fixture.detectChanges();

    await expectAsync(alertHarness.isCloseable()).toBeResolvedTo(false);

    fixture.componentInstance.closeable = true;
    fixture.detectChanges();

    await expectAsync(alertHarness.isCloseable()).toBeResolvedTo(true);
  });

  it('should throw an error when closing a non-closeable alert', async () => {
    const { alertHarness, fixture } = await setupTest();

    fixture.componentInstance.closeable = false;
    fixture.detectChanges();

    await expectAsync(alertHarness.close()).toBeRejectedWithError(
      'The alert is not closeable.',
    );
  });

  it('should return the expected alert type', async () => {
    const { alertHarness, fixture } = await setupTest();

    await validateAlertType(alertHarness, fixture, 'danger');
    await validateAlertType(alertHarness, fixture, 'info');
    await validateAlertType(alertHarness, fixture, 'success');
    await validateAlertType(alertHarness, fixture, 'warning');
  });

  it('should return the expected description type', async () => {
    const { alertHarness, fixture } = await setupTest();
    await validateDescriptionType(alertHarness, fixture, 'attention');
    await validateDescriptionType(alertHarness, fixture, 'caution');
    await validateDescriptionType(alertHarness, fixture, 'completed');
    await validateDescriptionType(alertHarness, fixture, 'danger');
    await validateDescriptionType(alertHarness, fixture, 'error');
    await validateDescriptionType(alertHarness, fixture, 'important-info');
    await validateDescriptionType(alertHarness, fixture, 'important-warning');
    await validateDescriptionType(alertHarness, fixture, 'success');
    await validateDescriptionType(alertHarness, fixture, 'warning');
    await validateDescriptionType(alertHarness, fixture, 'none');
    await validateDescriptionType(
      alertHarness,
      fixture,
      'custom',
      'custom text',
    );
  });

  it('should return the custom description when `descriptionType` is custom', async () => {
    const { fixture, alertHarness } = await setupTest();
    const description = 'Custom description:';

    fixture.componentInstance.descriptionType = 'custom';
    fixture.componentInstance.customDescription = description;

    fixture.detectChanges();

    const componentDescription = await alertHarness.getCustomDescription();

    expect(componentDescription).toEqual(description);
  });

  it('should return an empty string when `descriptionType` is not custom', async () => {
    const { fixture, alertHarness } = await setupTest();

    fixture.componentInstance.descriptionType = 'attention';

    fixture.detectChanges();

    const componentDescription = await alertHarness.getCustomDescription();

    expect(componentDescription).toEqual('');
  });

  it('should return the expected text', async () => {
    const { alertHarness } = await setupTest();
    await expectAsync(alertHarness.getText()).toBeResolvedTo(
      'This is a sample alert.',
    );
  });

  it('should get an alert by its data-sky-id property', async () => {
    const { alertHarness } = await setupTest({ dataSkyId: 'alert-2' });
    await expectAsync(alertHarness.getText()).toBeResolvedTo(
      'This is another alert.',
    );
  });
});

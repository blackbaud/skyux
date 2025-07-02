import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyIndicatorDescriptionType,
  SkyIndicatorIconType,
  SkyStatusIndicatorModule,
} from '@skyux/indicators';

import { SkyStatusIndicatorHarness } from './status-indicator-harness';

@Component({
  selector: 'sky-status-indicator-test',
  imports: [SkyStatusIndicatorModule],
  template: `
    <sky-status-indicator
      data-sky-id="test-status-indicator"
      [indicatorType]="indicatorType"
      [customDescription]="customDescription"
      [descriptionType]="descriptionType"
      [helpPopoverContent]="helpPopoverContent"
      [helpPopoverTitle]="helpPopoverTitle"
    >
      This is a sample status indicator.
    </sky-status-indicator>
    <sky-status-indicator
      descriptionType="none"
      data-sky-id="status-indicator-2"
      >This is another status indicator.</sky-status-indicator
    >
    <sky-status-indicator data-sky-id="status-indicator-no-description-type"
      >I will not render.</sky-status-indicator
    >
  `,
})
class TestComponent {
  public indicatorType = 'warning';
  public customDescription: string | undefined;
  public descriptionType: SkyIndicatorDescriptionType = 'warning';
  public helpPopoverContent = '';
  public helpPopoverTitle = '';
}

describe('Status indicator harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    component: TestComponent;
    harness: SkyStatusIndicatorHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [TestComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const component = fixture.componentInstance;

    const loader = TestbedHarnessEnvironment.loader(fixture);

    let harness: SkyStatusIndicatorHarness;

    if (options.dataSkyId) {
      harness = await loader.getHarness(
        SkyStatusIndicatorHarness.with({
          dataSkyId: options.dataSkyId,
        }),
      );
    } else {
      harness = await loader.getHarness(SkyStatusIndicatorHarness);
    }

    return { component, harness, fixture };
  }

  it('should return the expected status indicator type', async () => {
    const { component, harness, fixture } = await setupTest();

    async function validate(
      indicatorType: SkyIndicatorIconType,
    ): Promise<void> {
      component.indicatorType = indicatorType;
      fixture.detectChanges();

      await expectAsync(harness.getIndicatorType()).toBeResolvedTo(
        indicatorType,
      );
    }

    await validate('danger');
    await validate('info');
    await validate('success');
    await validate('warning');
  });

  it('should return the expected description type', async () => {
    const { component, harness, fixture } = await setupTest();

    async function validate(
      descriptionType: SkyIndicatorDescriptionType,
      customDescription?: string,
    ): Promise<void> {
      component.descriptionType = descriptionType;
      component.customDescription = customDescription;
      fixture.detectChanges();

      await expectAsync(harness.getDescriptionType()).toBeResolvedTo(
        descriptionType,
      );
    }

    await validate('attention');
    await validate('caution');
    await validate('completed');
    await validate('danger');
    await validate('error');
    await validate('important-info');
    await validate('important-warning');
    await validate('success');
    await validate('warning');
    await validate('none');
    await validate('custom', 'custom text');
  });

  it('should return the custom description when `descriptionType` is custom', async () => {
    const { component, fixture, harness } = await setupTest();
    const description = 'Custom description:';

    component.descriptionType = 'custom';
    component.customDescription = description;

    fixture.detectChanges();

    const componentDescription = await harness.getCustomDescription();

    expect(componentDescription).toEqual(description);
  });

  it('should return an empty string when `descriptionType` is not custom', async () => {
    const { component, fixture, harness } = await setupTest();

    component.descriptionType = 'attention';

    fixture.detectChanges();

    const componentDescription = await harness.getCustomDescription();

    expect(componentDescription).toEqual('');
  });

  it('should return the expected text', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getText()).toBeResolvedTo(
      'This is a sample status indicator.',
    );
  });

  it('should get a status indicator by its data-sky-id property', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'status-indicator-2',
    });

    await expectAsync(harness.getText()).toBeResolvedTo(
      'This is another status indicator.',
    );
  });

  it('should throw a meaningful error if no text was found', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'status-indicator-no-description-type',
    });

    await expectAsync(harness.getText()).toBeRejectedWithError(
      'Status indicator text was not found. Did you set the descriptionType input?',
    );
  });

  it('should throw an error if there is no help inline', async () => {
    const { harness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(harness.clickHelpInline()).toBeRejectedWithError(
      'No help inline found.',
    );
  });

  it('should open help inline popover when clicked', async () => {
    const { harness, fixture } = await setupTest();

    fixture.componentInstance.helpPopoverContent = 'This is a status';
    fixture.detectChanges();

    await harness.clickHelpInline();

    await expectAsync(harness.getHelpPopoverContent()).toBeResolved();
  });
});

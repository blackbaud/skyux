import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import type {
  SkyIndicatorDescriptionType,
  SkyLabelType,
} from '@skyux/indicators';

import { LabelHarnessTestComponent } from './fixtures/label-harness-test.component';
import { LabelHarnessTestModule } from './fixtures/label-harness-test.module';
import { SkyLabelHarness } from './label-harness';

async function setupTest(options: { dataSkyId: string }) {
  await TestBed.configureTestingModule({
    imports: [LabelHarnessTestModule],
  }).compileComponents();

  const fixture = TestBed.createComponent(LabelHarnessTestComponent);
  const loader = TestbedHarnessEnvironment.loader(fixture);

  const labelHarness = await loader.getHarness(
    SkyLabelHarness.with({ dataSkyId: options.dataSkyId }),
  );

  return { fixture, labelHarness };
}

function testGetLabelType(dataSkyId: string, labelType?: SkyLabelType) {
  it('should return the label type', async () => {
    const { fixture, labelHarness } = await setupTest({ dataSkyId });

    if (labelType) {
      fixture.componentInstance.labelType = labelType;
      fixture.detectChanges();
    }

    const componentLabelType = await labelHarness.getLabelType();

    if (labelType) {
      expect(componentLabelType).toEqual(labelType);
    } else {
      expect(componentLabelType).toEqual('info');
    }
  });
}

function testGetDescriptionType(
  dataSkyId: string,
  descriptionType: SkyIndicatorDescriptionType,
  customDescription?: string,
) {
  it('should return the description type', async () => {
    const { fixture, labelHarness } = await setupTest({ dataSkyId });

    fixture.componentInstance.descriptionType = descriptionType;
    fixture.componentInstance.customDescription = customDescription;
    fixture.detectChanges();

    const componentDescriptionType = await labelHarness.getDescriptionType();

    expect(componentDescriptionType).toEqual(descriptionType);
  });
}

describe('Label harness', () => {
  describe('getLabelType', () => {
    describe('success label', () =>
      testGetLabelType('label-with-label-type', 'success'));
    describe('danger label', () =>
      testGetLabelType('label-with-label-type', 'danger'));
    describe('warning label', () =>
      testGetLabelType('label-with-label-type', 'warning'));
    describe('info label', () =>
      testGetLabelType('label-with-label-type', 'info'));
    describe('default label type', () =>
      testGetLabelType('label-without-label-type'));
  });

  describe('getDescriptionType', () => {
    describe('attention', () =>
      testGetDescriptionType('label-with-label-type', 'attention'));
    describe('caution', () =>
      testGetDescriptionType('label-with-label-type', 'caution'));
    describe('completed', () =>
      testGetDescriptionType('label-with-label-type', 'completed'));
    describe('danger', () =>
      testGetDescriptionType('label-with-label-type', 'danger'));
    describe('error', () =>
      testGetDescriptionType('label-with-label-type', 'error'));
    describe('important info', () =>
      testGetDescriptionType('label-with-label-type', 'important-info'));
    describe('important warning', () =>
      testGetDescriptionType('label-with-label-type', 'important-warning'));
    describe('success', () =>
      testGetDescriptionType('label-with-label-type', 'success'));
    describe('warning', () =>
      testGetDescriptionType('label-with-label-type', 'warning'));
    describe('none', () =>
      testGetDescriptionType('label-with-label-type', 'none'));
    describe('custom', () =>
      testGetDescriptionType('label-with-label-type', 'custom', 'custom text'));
  });

  describe('getLabelText', () => {
    it('should return the label text', async () => {
      const { labelHarness } = await setupTest({
        dataSkyId: 'label-with-label-type',
      });

      await expectAsync(labelHarness.getLabelText()).toBeResolvedTo(
        'Test label',
      );
    });
  });

  describe('getCustomDescription', () => {
    it('should return the custom description when `descriptionType` is custom', async () => {
      const { fixture, labelHarness } = await setupTest({
        dataSkyId: 'label-with-label-type',
      });
      const description = 'Custom description:';

      fixture.componentInstance.descriptionType = 'custom';
      fixture.componentInstance.customDescription = description;

      fixture.detectChanges();

      const componentDescription = await labelHarness.getCustomDescription();

      expect(componentDescription).toEqual(description);
    });

    it('should return an empty string when `descriptionType` is not custom', async () => {
      const { fixture, labelHarness } = await setupTest({
        dataSkyId: 'label-with-label-type',
      });

      fixture.componentInstance.descriptionType = 'attention';

      fixture.detectChanges();

      const componentDescriptionType =
        await labelHarness.getCustomDescription();

      expect(componentDescriptionType).toEqual('');
    });
  });
});

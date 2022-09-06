import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyLabelType } from '@skyux/indicators';

import { LabelHarnessTestComponent } from './fixtures/label-harness-test.component';
import { LabelHarnessTestModule } from './fixtures/label-harness-test.module';
import { SkyLabelHarness } from './label-harness';

async function setupTest(options: { dataSkyId: string }) {
  await TestBed.configureTestingModule({
    imports: [LabelHarnessTestModule],
  }).compileComponents();

  const fixture = TestBed.createComponent(LabelHarnessTestComponent);
  const loader = TestbedHarnessEnvironment.loader(fixture);

  const labelHarness: SkyLabelHarness = await loader.getHarness(
    SkyLabelHarness.with({ dataSkyId: options.dataSkyId })
  );

  return { fixture, labelHarness };
}

function testLabelType(dataSkyId: string, labelType?: SkyLabelType) {
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

describe('Label harness', () => {
  describe('getLabelType', () => {
    describe('success label', () =>
      testLabelType('label-with-label-type', 'success'));
    describe('danger label', () =>
      testLabelType('label-with-label-type', 'danger'));
    describe('warning label', () =>
      testLabelType('label-with-label-type', 'warning'));
    describe('info label', () =>
      testLabelType('label-with-label-type', 'info'));
    describe('default label type', () =>
      testLabelType('label-without-label-type'));
  });

  describe('getLabelText', () => {
    it('returns the label text', async () => {
      const { labelHarness } = await setupTest({
        dataSkyId: 'label-with-label-type',
      });

      await expectAsync(labelHarness.getLabelText()).toBeResolvedTo(
        'Test label'
      );
    });
  });

  describe('getScreenReaderText', async () => {
    it('returns the text read by screen readers in place of an icon', async () => {
      const { fixture, labelHarness } = await setupTest({
        dataSkyId: 'label-with-label-type',
      });

      fixture.componentInstance.descriptionType = 'attention';
      fixture.detectChanges();

      await expectAsync(labelHarness.getScreenReaderText()).toBeResolvedTo(
        'Attention:'
      );
    });
  });
});

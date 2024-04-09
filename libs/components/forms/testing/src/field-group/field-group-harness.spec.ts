import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyFieldGroupHarness } from './field-group-harness';
import { FieldGroupComponent } from './fixtures/field-group.component.fixture';

async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
  fieldGroupHarness: SkyFieldGroupHarness;
  fixture: ComponentFixture<FieldGroupComponent>;
}> {
  await TestBed.configureTestingModule({
    imports: [FieldGroupComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(FieldGroupComponent);
  const loader = TestbedHarnessEnvironment.loader(fixture);

  const fieldGroupHarness: SkyFieldGroupHarness = options.dataSkyId
    ? await loader.getHarness(
        SkyFieldGroupHarness.with({
          dataSkyId: options.dataSkyId,
        }),
      )
    : await loader.getHarness(SkyFieldGroupHarness);

  return { fieldGroupHarness, fixture };
}

describe('Field group harness', () => {
  it('should get the label text', async () => {
    const { fieldGroupHarness } = await setupTest();

    await expectAsync(fieldGroupHarness.getLabelText()).toBeResolvedTo(
      'Label text',
    );
  });

  it('should get the label text when label text is hidden', async () => {
    const { fieldGroupHarness, fixture } = await setupTest({
      dataSkyId: 'field-group',
    });

    fixture.componentInstance.labelHidden = true;
    fixture.detectChanges();

    await expectAsync(fieldGroupHarness.getLabelText()).toBeResolvedTo(
      'Label text',
    );
  });

  it('should indicate the label is not hidden', async () => {
    const { fieldGroupHarness } = await setupTest();

    await expectAsync(fieldGroupHarness.getLabelHidden()).toBeResolvedTo(false);
  });

  it('should indicate the label is hidden', async () => {
    const { fieldGroupHarness, fixture } = await setupTest();

    fixture.componentInstance.labelHidden = true;
    fixture.detectChanges();

    await expectAsync(fieldGroupHarness.getLabelHidden()).toBeResolvedTo(true);
  });

  it('should indicate the component is stacked', async () => {
    const { fieldGroupHarness, fixture } = await setupTest();

    fixture.componentInstance.stacked = true;
    fixture.detectChanges();

    await expectAsync(fieldGroupHarness.getStacked()).toBeResolvedTo(true);
  });
  it('should indicate the component is not stacked', async () => {
    const { fieldGroupHarness } = await setupTest();

    await expectAsync(fieldGroupHarness.getStacked()).toBeResolvedTo(false);
  });

  it('should return the heading level', async () => {
    const { fieldGroupHarness, fixture } = await setupTest();

    fixture.componentInstance.headingLevel = 3;
    fixture.detectChanges();

    await expectAsync(fieldGroupHarness.getHeadingLevel()).toBeResolvedTo(3);

    fixture.componentInstance.headingLevel = 4;
    fixture.detectChanges();

    await expectAsync(fieldGroupHarness.getHeadingLevel()).toBeResolvedTo(4);
  });

  it('should return the heading style', async () => {
    const { fieldGroupHarness, fixture } = await setupTest();

    fixture.componentInstance.headingLevel = 3;
    fixture.componentInstance.headingStyle = 4;
    fixture.detectChanges();

    await expectAsync(fieldGroupHarness.getHeadingLevel()).toBeResolvedTo(3);
    await expectAsync(fieldGroupHarness.getHeadingStyle()).toBeResolvedTo(4);

    fixture.componentInstance.headingLevel = 4;
    fixture.componentInstance.headingStyle = 3;
    fixture.detectChanges();

    await expectAsync(fieldGroupHarness.getHeadingLevel()).toBeResolvedTo(4);
    await expectAsync(fieldGroupHarness.getHeadingStyle()).toBeResolvedTo(3);
  });
});

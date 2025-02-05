import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyColorpickerHarness } from '@skyux/colorpicker/testing';

import { ColorpickerBasicExampleComponent } from './example.component';

describe('Basic colorpicker example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyColorpickerHarness;
    fixture: ComponentFixture<ColorpickerBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(ColorpickerBasicExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyColorpickerHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ColorpickerBasicExampleComponent],
    });
  });

  it('should have the initial values set', async () => {
    const { harness } = await setupTest({ dataSkyId: 'favorite-color' });

    await expectAsync(harness.getLabelText()).toBeResolvedTo(
      'What is your favorite color?',
    );
    await expectAsync(harness.getHintText()).toBeResolvedTo(
      'Pick a color with at least 80% opacity.',
    );
  });

  it('should throw an error if a low opacity color is selected', async () => {
    const { harness, fixture } = await setupTest({
      dataSkyId: 'favorite-color',
    });

    await harness.clickColorpickerButton();
    await expectAsync(harness.isColorpickerOpen()).toBeResolvedTo(true);

    const dropdown = await harness.getColorpickerDropdown();

    await dropdown.setAlphaValue('.2');
    await dropdown.clickApplyButton();
    fixture.detectChanges();

    await expectAsync(harness.hasError('opaque')).toBeResolvedTo(true);
  });
});

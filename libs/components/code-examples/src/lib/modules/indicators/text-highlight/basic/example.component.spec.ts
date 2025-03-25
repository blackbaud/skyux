import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyCheckboxHarness, SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyTextHighlightHarness } from '@skyux/indicators/testing';

import { IndicatorsTextHighlightBasicExampleComponent } from './example.component';

describe('Text highlight example', () => {
  async function setupTest(options?: { dataSkyId: string }): Promise<{
    textHighlightHarness: SkyTextHighlightHarness;
    fixture: ComponentFixture<IndicatorsTextHighlightBasicExampleComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [IndicatorsTextHighlightBasicExampleComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      IndicatorsTextHighlightBasicExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const textHighlightHarness = options?.dataSkyId
      ? await loader.getHarness(
          SkyTextHighlightHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyTextHighlightHarness);

    return { textHighlightHarness, fixture, loader };
  }

  it('should set up the component', async () => {
    const { textHighlightHarness, fixture, loader } = await setupTest();

    const inputEl = await (
      await loader.getHarness(SkyInputBoxHarness)
    ).querySelector('input');

    const checkboxHarness = await loader.getHarness(SkyCheckboxHarness);

    await inputEl?.sendKeys('text');
    await inputEl?.blur();
    fixture.detectChanges();
    await fixture.whenStable();

    let highlights = await textHighlightHarness.getHighlights();
    expect(highlights.length).toBe(1);

    await checkboxHarness.check();
    fixture.detectChanges();
    await fixture.whenStable();

    await inputEl?.clear();
    await inputEl?.sendKeys('is');
    await inputEl?.blur();
    fixture.detectChanges();
    await fixture.whenStable();

    highlights = await textHighlightHarness.getHighlights();
    expect(highlights.length).toBe(3);
  });
});

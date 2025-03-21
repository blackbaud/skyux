import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';
import { SkyCheckboxHarness } from '@skyux/forms/testing';
import { SkyTextHighlightHarness } from '@skyux/indicators/testing';

import { DemoComponent } from './demo.component';

describe('Text highlight demo', () => {
  async function setupTest(options?: { dataSkyId: string }): Promise<{
    textHighlightHarness: SkyTextHighlightHarness;
    fixture: ComponentFixture<DemoComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [DemoComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(DemoComponent);
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

    const inputEl = document.querySelector<HTMLInputElement>('input')!;

    const checkboxHarness = await loader.getHarness(SkyCheckboxHarness);

    inputEl.value = 'text';
    SkyAppTestUtility.fireDomEvent(inputEl, 'input');
    SkyAppTestUtility.fireDomEvent(inputEl, 'blur');
    fixture.detectChanges();
    await fixture.whenStable();

    let highlights = await textHighlightHarness.getHighlights();
    expect(highlights.length).toBe(1);

    await checkboxHarness.check();
    fixture.detectChanges();
    await fixture.whenStable();

    inputEl.value = 'is';
    SkyAppTestUtility.fireDomEvent(inputEl, 'input');
    SkyAppTestUtility.fireDomEvent(inputEl, 'blur');
    fixture.detectChanges();
    await fixture.whenStable();

    highlights = await textHighlightHarness.getHighlights();
    expect(highlights.length).toBe(3);
  });
});

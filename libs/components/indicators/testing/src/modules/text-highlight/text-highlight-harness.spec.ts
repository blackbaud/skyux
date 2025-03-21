import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextHighlightHarnessTestComponent } from './fixtures/text-highlight-harness-test.component';
import { SkyTextHighlightHarness } from './text-highlight-harness';

describe('Text highlight harness', () => {
  async function setupTest(options?: { dataSkyId: string }): Promise<{
    textHighlightHarness: SkyTextHighlightHarness;
    fixture: ComponentFixture<TextHighlightHarnessTestComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [TextHighlightHarnessTestComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TextHighlightHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const textHighlightHarness = options?.dataSkyId
      ? await loader.getHarness(
          SkyTextHighlightHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyTextHighlightHarness);

    return { textHighlightHarness, fixture };
  }

  it('should get a text highlight by data-sky-id and return the matching text', async () => {
    const { textHighlightHarness, fixture } = await setupTest({
      dataSkyId: 'text-highlight',
    });

    fixture.componentRef.setInput('searchTerm', 'text');
    fixture.detectChanges();
    await fixture.whenStable();

    let highlights = await textHighlightHarness.getHighlights();
    expect(highlights.length).toBe(1);

    fixture.componentRef.setInput('showAdditionalContent', true);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentRef.setInput('searchTerm', 'is');
    fixture.detectChanges();
    await fixture.whenStable();

    highlights = await textHighlightHarness.getHighlights();
    expect(highlights.length).toBe(3);
  });
});

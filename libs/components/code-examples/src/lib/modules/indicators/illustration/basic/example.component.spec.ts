import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyIllustrationHarness } from '@skyux/indicators/testing';

import { IndicatorsIllustrationBasicExampleComponent } from './example.component';

describe('Basic illustration', () => {
  async function setupTest(): Promise<{
    illustrationHarness: SkyIllustrationHarness;
    fixture: ComponentFixture<IndicatorsIllustrationBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      IndicatorsIllustrationBasicExampleComponent,
    );

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const illustrationHarness = await loader.getHarness(
      SkyIllustrationHarness.with({ dataSkyId: 'illustration-example' }),
    );

    return { illustrationHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IndicatorsIllustrationBasicExampleComponent],
    });
  });

  it('should display a medium-size analytics graph illustration', async () => {
    const { illustrationHarness } = await setupTest();

    await expectAsync(illustrationHarness.getName()).toBeResolvedTo(
      'analytics-graph',
    );

    await expectAsync(illustrationHarness.getSize()).toBeResolvedTo('md');
  });
});

import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyIllustrationHarness } from '@skyux/indicators/testing';

import { DemoComponent } from './demo.component';

describe('Basic illustration', () => {
  async function setupTest(): Promise<{
    illustrationHarness: SkyIllustrationHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const illustrationHarness = await loader.getHarness(
      SkyIllustrationHarness.with({ dataSkyId: 'illustration-demo' }),
    );

    return { illustrationHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent],
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

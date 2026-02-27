import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkySearchHarness } from '@skyux/lookup/testing';

import { LookupSearchBasicExampleComponent } from './example.component';

describe('Basic search example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkySearchHarness;
    fixture: ComponentFixture<LookupSearchBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(LookupSearchBasicExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkySearchHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LookupSearchBasicExampleComponent],
    });
  });

  it('should setup search component', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'example-search',
    });

    await expectAsync(harness.getAriaLabel()).toBeResolvedTo(
      'Search reminders',
    );
    await expectAsync(harness.getPlaceholderText()).toBeResolvedTo(
      'Search through reminders.',
    );
  });

  it('should interact with search function', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'example-search',
    });

    await harness.enterText('Send');
    await expectAsync(harness.getValue()).toBeResolvedTo('Send');

    await harness.clickClearButton();
    await expectAsync(harness.getValue()).toBeResolvedTo('');
  });
});

import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkySearchHarness } from '@skyux/lookup/testing';

import { DemoComponent } from './demo.component';

describe('Basic search demo', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkySearchHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
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
      imports: [NoopAnimationsModule, DemoComponent],
    });
  });

  it('should setup search component', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'demo-search',
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
      dataSkyId: 'demo-search',
    });

    await harness.enterText('Send');
    await expectAsync(harness.getValue()).toBeResolvedTo('Send');

    await harness.clickClearButton();
    await expectAsync(harness.getValue()).toBeResolvedTo('');
  });
});

import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkySummaryActionBarHarness } from '@skyux/action-bars/testing';
import { SkyKeyInfoHarness } from '@skyux/indicators/testing';

import { ActionBarsSummaryActionBarErrorExampleComponent } from './example.component';

describe('Error summary action bar example', () => {
  async function setupTest(): Promise<{
    harness: SkySummaryActionBarHarness;
    fixture: ComponentFixture<ActionBarsSummaryActionBarErrorExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      ActionBarsSummaryActionBarErrorExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkySummaryActionBarHarness.with({ dataSkyId: 'donation-summary' }),
    );

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ActionBarsSummaryActionBarErrorExampleComponent,
        NoopAnimationsModule,
      ],
    });
  });

  it('should add an error on clicking secondary action button to add single error', async () => {
    const { harness } = await setupTest();

    const secondaryActions = await harness.getSecondaryActions();
    const singleErrorAction = await secondaryActions.getAction({
      dataSkyId: 'single-error-action',
    });

    await singleErrorAction.click();

    await expectAsync(
      harness.hasError({ message: 'Monthly donation is missing.' }),
    ).toBeResolvedTo(true);
  });

  it('should add errors on clicking secondary action button to add multiple errors', async () => {
    const { harness } = await setupTest();

    const secondaryActions = await harness.getSecondaryActions();
    const singleErrorAction = await secondaryActions.getActions();

    await singleErrorAction[1].click();

    const errors = await harness.getErrors();
    expect(errors.length).toBe(2);
  });

  it('should set up the summary', async () => {
    const { harness } = await setupTest();

    const summary = await harness.getSummary();
    const keyInfos = await summary.queryHarnesses(SkyKeyInfoHarness);
    expect(keyInfos.length).toBe(3);
  });
});

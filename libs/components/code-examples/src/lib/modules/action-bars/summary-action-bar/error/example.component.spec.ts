import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkySummaryActionBarHarness } from '@skyux/action-bars/testing';
import { SkyKeyInfoHarness } from '@skyux/indicators/testing';

import { ActionBarsSummaryActionBarErrorExampleComponent } from './example.component';

fdescribe('Error summary action bar example', () => {
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

  it('should set up primary action', async () => {
    const { harness, fixture } = await setupTest();

    const primaryActionHarness = await harness.getPrimaryAction();
    await expectAsync(primaryActionHarness.getText()).toBeResolvedTo(
      'Primary action',
    );

    const spy = spyOn(fixture.componentInstance, 'onPrimaryActionClick');
    await primaryActionHarness.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should add an error on clicking secondary action button to add single error', async () => {
    const { harness, fixture } = await setupTest();

    const secondaryActions = await harness.getSecondaryActions();
    const singleErrorAction = await secondaryActions.getAction({
      dataSkyId: 'single-error-action',
    });

    const spy = spyOn(fixture.componentInstance, 'singleError');

    await singleErrorAction.click();
    expect(spy).toHaveBeenCalled();
    fixture.detectChanges();

    await expectAsync(
      harness.hasError({ message: 'This is an error.' }),
    ).toBeResolvedTo(true);
  });

  it('should set up the summary', async () => {
    const { harness } = await setupTest();

    const summary = await harness.getSummary();
    const keyInfos = await summary.queryHarnesses(SkyKeyInfoHarness);
    expect(keyInfos.length).toBe(3);
  });
});

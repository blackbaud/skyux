import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkySummaryActionBarHarness } from '@skyux/action-bars/testing';
import { SkyKeyInfoHarness } from '@skyux/indicators/testing';

import { ActionBarsSummaryActionBarBasicExampleComponent } from './example.component';

describe('Basic summary action bar example', () => {
  async function setupTest(): Promise<{
    harness: SkySummaryActionBarHarness;
    fixture: ComponentFixture<ActionBarsSummaryActionBarBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      ActionBarsSummaryActionBarBasicExampleComponent,
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
        ActionBarsSummaryActionBarBasicExampleComponent],
    });
  });

  it('should set up primary actions', async () => {
    const { harness, fixture } = await setupTest();

    const primaryActionHarness = await harness.getPrimaryAction();
    await expectAsync(primaryActionHarness.getText()).toBeResolvedTo(
      'Primary action',
    );

    const spy = spyOn(fixture.componentInstance, 'onPrimaryActionClick');
    await primaryActionHarness.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should set up secondary actions', async () => {
    const { harness, fixture } = await setupTest();

    const secondaryActions = await harness.getSecondaryActions();
    const actions = await secondaryActions.getActions();
    expect(actions.length).toBe(2);

    const spy1 = spyOn(fixture.componentInstance, 'onSecondaryActionClick');
    const spy2 = spyOn(fixture.componentInstance, 'onSecondaryAction2Click');

    await actions[1].click();
    expect(spy2).toHaveBeenCalled();

    const secondaryAction = await secondaryActions.getAction({
      dataSkyId: 'secondary-action',
    });
    await secondaryAction.click();
    expect(spy1).toHaveBeenCalled();
  });

  it('should set up the summary', async () => {
    const { harness } = await setupTest();

    const summary = await harness.getSummary();
    const keyInfos = await summary.queryHarnesses(SkyKeyInfoHarness);
    expect(keyInfos.length).toBe(3);
  });
});

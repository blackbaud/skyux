import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAlertHarness } from '@skyux/indicators/testing';

import { IndicatorsAlertBasicExampleComponent } from './example.component';

describe('Basic alert', () => {
  async function setupTest(options?: { days?: number }): Promise<{
    alertHarness: SkyAlertHarness;
    fixture: ComponentFixture<IndicatorsAlertBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      IndicatorsAlertBasicExampleComponent,
    );

    if (options?.days !== undefined) {
      fixture.componentInstance.days = options.days;
    }

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const alertHarness = await loader.getHarness(
      SkyAlertHarness.with({ dataSkyId: 'alert-example' }),
    );

    return { alertHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IndicatorsAlertBasicExampleComponent],
    });
  });

  it('should show the expected alert when the number of days is 8 or more', async () => {
    const { alertHarness, fixture } = await setupTest({ days: 8 });
    fixture.detectChanges();

    await expectAsync(alertHarness.getAlertType()).toBeResolvedTo('warning');
    await expectAsync(alertHarness.getText()).toBeResolvedTo(
      'Your password expires in 8 day(s)!',
    );
    await expectAsync(alertHarness.isCloseable()).toBeResolvedTo(true);
  });

  it('should show the expected alert when the number of days is 7 or fewer', async () => {
    const { alertHarness, fixture } = await setupTest({ days: 7 });
    fixture.detectChanges();

    await expectAsync(alertHarness.getAlertType()).toBeResolvedTo('danger');
    await expectAsync(alertHarness.getText()).toBeResolvedTo(
      'Your password expires in 7 day(s)!',
    );
    await expectAsync(alertHarness.isCloseable()).toBeResolvedTo(false);
  });
});

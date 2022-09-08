import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyAlertHarness } from '@skyux/indicators/testing';

import { AlertDemoComponent } from './alert-demo.component';
import { AlertDemoModule } from './alert-demo.module';

describe('Basic alert', () => {
  async function setupTest(days: number) {
    const fixture = TestBed.createComponent(AlertDemoComponent);

    fixture.componentInstance.days = days;
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const alertHarness = await loader.getHarness(
      SkyAlertHarness.with({ dataSkyId: 'alert-demo' })
    );

    return { alertHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AlertDemoModule],
    });
  });

  it('should show the expected alert when the number of days is 8 or more', async () => {
    const { alertHarness } = await setupTest(8);

    await expectAsync(alertHarness.getAlertType()).toBeResolvedTo('warning');
    await expectAsync(alertHarness.getText()).toBeResolvedTo(
      'Your password expires in 8 day(s)!'
    );
    await expectAsync(alertHarness.isCloseable()).toBeResolvedTo(true);
  });

  it('should show the expected alert when the number of days is 7 or fewer', async () => {
    const { alertHarness } = await setupTest(7);

    await expectAsync(alertHarness.getAlertType()).toBeResolvedTo('danger');
    await expectAsync(alertHarness.getText()).toBeResolvedTo(
      'Your password expires in 7 day(s)!'
    );
    await expectAsync(alertHarness.isCloseable()).toBeResolvedTo(false);
  });
});

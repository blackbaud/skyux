import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAlertHarness } from '@skyux/indicators/testing';

import { AlertDemoComponent } from './alert-demo.component';
import { AlertDemoModule } from './alert-demo.module';

describe('Basic alert', () => {
  async function setupTest(days: number) {
    fixture = TestBed.createComponent(AlertDemoComponent);
    cmp = fixture.componentInstance;

    cmp.days = days;
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);

    alertHarness = await loader.getHarness(
      SkyAlertHarness.with({ dataSkyId: 'alert-demo' })
    );
  }

  let alertHarness: SkyAlertHarness;
  let cmp: AlertDemoComponent;
  let fixture: ComponentFixture<AlertDemoComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AlertDemoModule],
    });
  });

  it('should show the proper alert when the number of days is 8 or more', async () => {
    await setupTest(8);

    const alertType = await alertHarness.getAlertType();
    expect(alertType).toBe('warning');

    const alertText = await alertHarness.getText();
    expect(alertText).toBe('Your password expires in 8 day(s)!');

    await expectAsync(alertHarness.isCloseable()).toBeResolvedTo(true);
  });

  it('should show the proper alert when the number of days is 7 or fewer', async () => {
    await setupTest(7);

    const alertType = await alertHarness.getAlertType();
    expect(alertType).toBe('danger');

    const alertText = await alertHarness.getText();
    expect(alertText).toBe('Your password expires in 7 day(s)!');

    await expectAsync(alertHarness.isCloseable()).toBeResolvedTo(false);
  });
});

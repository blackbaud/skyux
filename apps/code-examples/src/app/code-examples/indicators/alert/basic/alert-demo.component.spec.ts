import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAlertHarness } from '@skyux/indicators/testing';

import { AlertDemoComponent } from './alert-demo.component';
import { AlertDemoModule } from './alert-demo.module';

describe('Basic alert', () => {
  let alertHarness: SkyAlertHarness;
  let fixture: ComponentFixture<AlertDemoComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AlertDemoModule],
    });
    fixture = TestBed.createComponent(AlertDemoComponent);
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);

    alertHarness = await loader.getHarness(
      SkyAlertHarness.with({ dataSkyId: 'alert-demo' })
    );
  });

  it('should show an alert', async () => {
    expect(alertHarness).toBeDefined();
    const host = await alertHarness.host();
    expect(host).toBeDefined();
  });

  it('should show an alert of type `info`', async () => {
    const alertType = await alertHarness.getAlertType();
    expect(alertType).toBe('info');
  });

  it('should show the correct text', async () => {
    const alertText = await alertHarness.getText();
    expect(alertText).toBe('Info alert message');
  });

  it('should close the alert correctly', async () => {
    spyOn(window, 'alert').and.stub();

    await expectAsync(alertHarness.isCloseable()).toBeResolvedTo(true);
    await expectAsync(alertHarness.isClosed()).toBeResolvedTo(false);
    await alertHarness.close();
    await expectAsync(alertHarness.isClosed()).toBeResolvedTo(true);
  });
});

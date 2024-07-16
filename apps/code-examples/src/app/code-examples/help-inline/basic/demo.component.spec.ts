import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpInlineHarness } from '@skyux/indicators/testing';

import { DemoComponent } from './demo.component';

describe('Basic help inline', () => {
  async function setupTest(): Promise<{
    helpInlineHarness: SkyHelpInlineHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const helpInlineHarness = await loader.getHarness(
      SkyHelpInlineHarness.with({
        dataSkyId: 'help-inline-demo',
      }),
    );

    return { helpInlineHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent],
    });
  });

  it('should click the help inline button', async () => {
    const { helpInlineHarness, fixture } = await setupTest();
    fixture.detectChanges();

    const clickSpy = spyOn(fixture.componentInstance, 'onActionClick');
    await helpInlineHarness.click();
    expect(clickSpy).toHaveBeenCalled();
  });
});

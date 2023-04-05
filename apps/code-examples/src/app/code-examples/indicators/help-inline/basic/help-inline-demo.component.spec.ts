import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpInlineHarness } from '@skyux/indicators/testing';

import { HelpInlineDemoComponent } from './help-inline-demo.component';
import { HelpInlineDemoModule } from './help-inline-demo.module';

describe('Basic help inline', async () => {
  async function setupTest(): Promise<{
    helpInlineHarness: SkyHelpInlineHarness;
    fixture: ComponentFixture<HelpInlineDemoComponent>;
  }> {
    const fixture = TestBed.createComponent(HelpInlineDemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const helpInlineHarness = await loader.getHarness(
      SkyHelpInlineHarness.with({
        dataSkyId: 'help-inline-demo',
      })
    );

    return { helpInlineHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HelpInlineDemoModule],
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

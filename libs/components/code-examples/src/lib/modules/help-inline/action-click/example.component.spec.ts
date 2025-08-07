import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { HelpInlineActionClickExampleComponent } from './example.component';

describe('Help inline with action click', () => {
  async function setupTest(): Promise<{
    helpInlineHarness: SkyHelpInlineHarness;
    fixture: ComponentFixture<HelpInlineActionClickExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      HelpInlineActionClickExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const helpInlineHarness = await loader.getHarness(
      SkyHelpInlineHarness.with({
        dataSkyId: 'help-inline-example',
      }),
    );

    return { fixture, helpInlineHarness };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HelpInlineActionClickExampleComponent],
    });
  });

  it('should click the help inline button', async () => {
    const { fixture, helpInlineHarness } = await setupTest();
    fixture.detectChanges();

    const clickSpy = spyOn(fixture.componentInstance, 'onActionClick');
    await helpInlineHarness.click();
    expect(clickSpy).toHaveBeenCalled();
  });
});

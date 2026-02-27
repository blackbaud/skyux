import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { HelpInlinePopoverExampleComponent } from './example.component';

describe('Help inline with popover', () => {
  async function setupTest(): Promise<{
    helpInlineHarness: SkyHelpInlineHarness;
    fixture: ComponentFixture<HelpInlinePopoverExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(HelpInlinePopoverExampleComponent);
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
      imports: [HelpInlinePopoverExampleComponent],
      providers: [],
    });
  });

  it('should launch a popover', async () => {
    const { fixture, helpInlineHarness } = await setupTest();

    fixture.detectChanges();

    await helpInlineHarness.click();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(helpInlineHarness.getPopoverContent()).toBeResolvedTo(
      'The estimated income expected for the current year.',
    );

    await expectAsync(helpInlineHarness.getPopoverTitle()).toBeResolvedTo(
      'Projected revenue',
    );
  });
});

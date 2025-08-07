import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { HelpInlineHelpKeyExampleComponent } from './example.component';

describe('Help inline with help key', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<HelpInlineHelpKeyExampleComponent>;
    helpController: SkyHelpTestingController;
    helpInlineHarness: SkyHelpInlineHarness;
  }> {
    const fixture = TestBed.createComponent(HelpInlineHelpKeyExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const helpInlineHarness = await loader.getHarness(
      SkyHelpInlineHarness.with({
        dataSkyId: 'help-inline-example',
      }),
    );

    const helpController = TestBed.inject(SkyHelpTestingController);

    return { fixture, helpController, helpInlineHarness };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HelpInlineHelpKeyExampleComponent, SkyHelpTestingModule],
      providers: [provideNoopAnimations()],
    });
  });

  it('should have a help key', async () => {
    const { fixture, helpController, helpInlineHarness } = await setupTest();

    fixture.detectChanges();

    await helpInlineHarness.click();

    helpController.expectCurrentHelpKey('projected-revenue');
  });
});

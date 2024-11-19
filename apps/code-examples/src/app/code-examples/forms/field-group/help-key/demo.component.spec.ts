import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';
import { SkyFieldGroupHarness } from '@skyux/forms/testing';

import { DemoComponent } from './demo.component';

describe('Field group', () => {
  async function setupTest(): Promise<{
    fieldGroupHarness: SkyFieldGroupHarness;
    fixture: ComponentFixture<DemoComponent>;
    helpController: SkyHelpTestingController;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const fieldGroupHarness = await loader.getHarness(SkyFieldGroupHarness);
    const helpController = TestBed.inject(SkyHelpTestingController);

    return { fieldGroupHarness, fixture, helpController };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent, SkyHelpTestingModule],
    });
  });

  it('should have the correct help key', async () => {
    const { fieldGroupHarness, helpController } = await setupTest();

    await fieldGroupHarness.clickHelpInline();

    helpController.expectCurrentHelpKey('address-help');
  });
});

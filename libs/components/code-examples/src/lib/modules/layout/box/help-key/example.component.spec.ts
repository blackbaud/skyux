import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';
import { SkyBoxHarness } from '@skyux/layout/testing';

import { LayoutBoxHelpKeyExampleComponent } from './example.component';

describe('Basic box', () => {
  async function setupTest(): Promise<{
    boxHarness: SkyBoxHarness;
    fixture: ComponentFixture<LayoutBoxHelpKeyExampleComponent>;
    helpController: SkyHelpTestingController;
  }> {
    const fixture = TestBed.createComponent(LayoutBoxHelpKeyExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const boxHarness = await loader.getHarness(
      SkyBoxHarness.with({
        dataSkyId: 'box-example',
      }),
    );

    const helpController = TestBed.inject(SkyHelpTestingController);

    return { boxHarness, fixture, helpController };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutBoxHelpKeyExampleComponent, SkyHelpTestingModule],
    });
  });

  it('should display the correct box', async () => {
    const { boxHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(boxHarness.getAriaLabel()).toBeResolvedTo('Box header');
  });

  it('should have the correct help key', async () => {
    const { boxHarness, helpController } = await setupTest();

    await boxHarness.clickHelpInline();

    helpController.expectCurrentHelpKey('box-help');
  });
});

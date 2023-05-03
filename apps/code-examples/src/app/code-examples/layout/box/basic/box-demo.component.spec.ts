import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyBoxHarness } from '@skyux/layout/testing';

import { BoxDemoComponent } from './box-demo.component';
import { BoxDemoModule } from './box-demo.module';

describe('Basic box', async () => {
  async function setupTest(): Promise<{
    boxHarness: SkyBoxHarness;
    fixture: ComponentFixture<BoxDemoComponent>;
  }> {
    const fixture = TestBed.createComponent(BoxDemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const boxHarness = await loader.getHarness(
      SkyBoxHarness.with({
        dataSkyId: 'box-demo',
      })
    );

    return { boxHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BoxDemoModule],
    });
  });

  it('should display the correct box', async () => {
    const { boxHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(boxHarness.getAriaLabel()).toBeResolvedTo('boxDemo');
  });
});

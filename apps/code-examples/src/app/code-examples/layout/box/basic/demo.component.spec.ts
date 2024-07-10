import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyBoxHarness } from '@skyux/layout/testing';

import { DemoComponent } from './demo.component';

describe('Basic box', () => {
  async function setupTest(): Promise<{
    boxHarness: SkyBoxHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const boxHarness = await loader.getHarness(
      SkyBoxHarness.with({
        dataSkyId: 'box-demo',
      }),
    );

    return { boxHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent],
    });
  });

  it('should display the correct box', async () => {
    const { boxHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(boxHarness.getAriaLabel()).toBeResolvedTo('boxDemo');
  });
});

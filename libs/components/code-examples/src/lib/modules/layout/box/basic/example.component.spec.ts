import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyBoxHarness } from '@skyux/layout/testing';

import { LayoutBoxBasicExampleComponent } from './example.component';

describe('Basic box', () => {
  async function setupTest(): Promise<{
    boxHarness: SkyBoxHarness;
    fixture: ComponentFixture<LayoutBoxBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(LayoutBoxBasicExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const boxHarness = await loader.getHarness(
      SkyBoxHarness.with({
        dataSkyId: 'box-example',
      }),
    );

    return { boxHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutBoxBasicExampleComponent],
    });
  });

  it('should display the correct box', async () => {
    const { boxHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(boxHarness.getAriaLabel()).toBeResolvedTo('Box header');
  });
});

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyFluidGridHarness } from '@skyux/layout/testing';

import { LayoutFluidGridInsetExampleComponent } from './example.component';

describe('Fluid grid with inset margins', () => {
  async function setupTest(): Promise<{
    fluidGridHarness: SkyFluidGridHarness;
    fixture: ComponentFixture<LayoutFluidGridInsetExampleComponent>;
    loader: HarnessLoader;
  }> {
    const fixture = TestBed.createComponent(
      LayoutFluidGridInsetExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const fluidGridHarness = await loader.getHarness(
      SkyFluidGridHarness.with({
        dataSkyId: 'fluid-grid',
      }),
    );

    return { fluidGridHarness, fixture, loader };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutFluidGridInsetExampleComponent],
    });
  });

  it('should indicate the grid has margins', async () => {
    const { fluidGridHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(fluidGridHarness.hasMargin()).toBeResolvedTo(true);
  });
});

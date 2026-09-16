import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpTestingModule } from '@skyux/core/testing';

import { FluidGridHarnessTestComponent } from './fixtures/fluid-grid-test.component';
import { SkyFluidGridHarness } from './fluid-grid-harness';

describe('Fluid grid test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    fluidGridHarness: SkyFluidGridHarness;
    fixture: ComponentFixture<FluidGridHarnessTestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [FluidGridHarnessTestComponent, SkyHelpTestingModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(FluidGridHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const fluidGridHarness: SkyFluidGridHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyFluidGridHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyFluidGridHarness);

    return { fluidGridHarness, fixture, loader };
  }

  it('should get the fluid grid from its data-sky-id and return the rows', async () => {
    const { fluidGridHarness, fixture } = await setupTest({
      dataSkyId: 'fluid-grid',
    });

    fixture.detectChanges();

    const rows = await fluidGridHarness.getRows();

    expect(rows.length).toEqual(12);

    // branch coverage
    for (const row of rows) {
      const columns = await row.getColumns();

      for (const column of columns) {
        await column.getSmallSize();
      }
    }
  });

  it('should not have margins by default', async () => {
    const { fluidGridHarness, fixture } = await setupTest({
      dataSkyId: 'fluid-grid',
    });

    fixture.detectChanges();

    await expectAsync(fluidGridHarness.hasMargin()).toBeResolvedTo(false);
  });

  it('should indicate the grid has margins based on the deprecated disableMargin input', async () => {
    const { fluidGridHarness, fixture } = await setupTest({
      dataSkyId: 'fluid-grid',
    });

    fixture.componentRef.setInput('disableMargin', false);
    fixture.detectChanges();

    await expectAsync(fluidGridHarness.hasMargin()).toBeResolvedTo(true);

    fixture.componentRef.setInput('disableMargin', true);
    fixture.detectChanges();

    await expectAsync(fluidGridHarness.hasMargin()).toBeResolvedTo(false);
  });

  it('should indicate the grid has margins based on the inset input', async () => {
    const { fluidGridHarness, fixture } = await setupTest({
      dataSkyId: 'fluid-grid',
    });

    fixture.componentRef.setInput('inset', false);
    fixture.detectChanges();

    await expectAsync(fluidGridHarness.hasMargin()).toBeResolvedTo(false);

    fixture.componentRef.setInput('inset', true);
    fixture.detectChanges();

    await expectAsync(fluidGridHarness.hasMargin()).toBeResolvedTo(true);
  });

  it('should get the gutter size', async () => {
    const { fluidGridHarness, fixture } = await setupTest({
      dataSkyId: 'fluid-grid',
    });

    fixture.detectChanges();

    await expectAsync(fluidGridHarness.getGutterSize()).toBeResolvedTo('large');

    fixture.componentRef.setInput('gutterSize', 'medium');
    fixture.detectChanges();

    await expectAsync(fluidGridHarness.getGutterSize()).toBeResolvedTo(
      'medium',
    );

    fixture.componentRef.setInput('gutterSize', 'small');
    fixture.detectChanges();

    await expectAsync(fluidGridHarness.getGutterSize()).toBeResolvedTo('small');
  });
});

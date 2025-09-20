import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyColumnHarness,
  SkyFluidGridHarness,
  SkyRowHarness,
} from '@skyux/layout/testing';

import { LayoutFluidGridExampleComponent } from './example.component';

describe('Basic fluid grid', () => {
  async function setupTest(): Promise<{
    fluidGridHarness: SkyFluidGridHarness;
    fixture: ComponentFixture<LayoutFluidGridExampleComponent>;
    loader: HarnessLoader;
  }> {
    const fixture = TestBed.createComponent(LayoutFluidGridExampleComponent);
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
      imports: [LayoutFluidGridExampleComponent],
    });
  });

  it('should display the correct fluid grid', async () => {
    const { fluidGridHarness, fixture } = await setupTest();

    fixture.detectChanges();

    const rows = await fluidGridHarness.getRows();

    expect(rows.length).toEqual(12);
  });

  it('should indicate the grid has margins', async () => {
    const { fluidGridHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(fluidGridHarness.hasMargin()).toBeResolvedTo(true);

    fixture.componentInstance.disableMargin = true;
    fixture.detectChanges();

    await expectAsync(fluidGridHarness.hasMargin()).toBeResolvedTo(false);
  });

  it('should get the gutter size', async () => {
    const { fluidGridHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(fluidGridHarness.getGutterSize()).toBeResolvedTo('large');

    fixture.componentInstance.gutterSize = 'medium';
    fixture.detectChanges();

    await expectAsync(fluidGridHarness.getGutterSize()).toBeResolvedTo(
      'medium',
    );

    fixture.componentInstance.gutterSize = 'small';
    fixture.detectChanges();

    await expectAsync(fluidGridHarness.getGutterSize()).toBeResolvedTo('small');
  });

  it('should get the correct row harness', async () => {
    const { fixture, loader } = await setupTest();
    const rowHarness = await loader.getHarness(
      SkyRowHarness.with({ dataSkyId: 'test-row' }),
    );

    fixture.detectChanges();

    const columns = await rowHarness.getColumns();

    expect(columns.length).toEqual(12);
    await expectAsync(rowHarness.getColumnOrder()).toBeResolvedTo('normal');
  });

  it('should get the row direction from the row harness', async () => {
    const { fixture, loader } = await setupTest();
    const rowHarness = await loader.getHarness(
      SkyRowHarness.with({ dataSkyId: 'reverse-row' }),
    );

    fixture.detectChanges();

    await expectAsync(rowHarness.getColumnOrder()).toBeResolvedTo('reverse');
  });

  it('should get the correct column harness', async () => {
    const { fixture, loader } = await setupTest();
    const columnHarness = await loader.getHarness(
      SkyColumnHarness.with({ dataSkyId: 'test-column' }),
    );

    fixture.detectChanges();

    await expectAsync(columnHarness.getXSmallSize()).toBeResolvedTo(12);
    await expectAsync(columnHarness.getLargeSize()).toBeResolvedTo(1);
  });

  it('should get the column sizes from the column harness', async () => {
    const { fixture, loader } = await setupTest();
    const columnHarness = await loader.getHarness(
      SkyColumnHarness.with({ dataSkyId: 'dynamic-column' }),
    );

    fixture.detectChanges();

    await expectAsync(columnHarness.getXSmallSize()).toBeResolvedTo(6);
    await expectAsync(columnHarness.getSmallSize()).toBeResolvedTo(8);
    await expectAsync(columnHarness.getMediumSize()).toBeResolvedTo(9);
    await expectAsync(columnHarness.getLargeSize()).toBeResolvedTo(10);
  });
});

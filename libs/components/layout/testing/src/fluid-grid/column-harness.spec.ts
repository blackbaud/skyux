import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpTestingModule } from '@skyux/core/testing';

import { SkyColumnHarness } from './column-harness';
import { FluidGridHarnessTestComponent } from './fixtures/fluid-grid-test.component';

describe('Column test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    columnHarness: SkyColumnHarness;
    fixture: ComponentFixture<FluidGridHarnessTestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [FluidGridHarnessTestComponent, SkyHelpTestingModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(FluidGridHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const columnHarness: SkyColumnHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyColumnHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyColumnHarness);

    return { columnHarness, fixture, loader };
  }

  it('should get the column from its data-sky-id', async () => {
    const { columnHarness, fixture } = await setupTest({
      dataSkyId: 'test-column',
    });

    fixture.detectChanges();

    await expectAsync(columnHarness.getXSmallSize()).toBeResolvedTo(12);
    await expectAsync(columnHarness.getLargeSize()).toBeResolvedTo(1);
  });

  it('should get the column sizes', async () => {
    const { columnHarness, fixture } = await setupTest({
      dataSkyId: 'dynamic-column',
    });

    fixture.detectChanges();

    await expectAsync(columnHarness.getXSmallSize()).toBeResolvedTo(6);
    await expectAsync(columnHarness.getSmallSize()).toBeResolvedTo(8);
    await expectAsync(columnHarness.getMediumSize()).toBeResolvedTo(9);
    await expectAsync(columnHarness.getLargeSize()).toBeResolvedTo(10);
  });
});

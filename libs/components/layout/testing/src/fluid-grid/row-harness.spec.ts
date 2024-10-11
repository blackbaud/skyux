import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpTestingModule } from '@skyux/core/testing';

import { FluidGridHarnessTestComponent } from './fixtures/fluid-grid-test.component';
import { SkyRowHarness } from './row-harness';

describe('Row test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    rowHarness: SkyRowHarness;
    fixture: ComponentFixture<FluidGridHarnessTestComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [FluidGridHarnessTestComponent, SkyHelpTestingModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(FluidGridHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const rowHarness: SkyRowHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyRowHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyRowHarness);

    return { rowHarness, fixture };
  }

  it('should get the row from its data-sky-id and return the columns', async () => {
    const { rowHarness, fixture } = await setupTest({
      dataSkyId: 'test-row',
    });

    fixture.detectChanges();

    const columns = await rowHarness.getColumns();

    expect(columns.length).toEqual(12);
    await expectAsync(rowHarness.getColumnOrder()).toBeResolvedTo('normal');
  });

  it('should get the row direction', async () => {
    const { rowHarness, fixture } = await setupTest({
      dataSkyId: 'reverse-row',
    });

    fixture.detectChanges();

    await expectAsync(rowHarness.getColumnOrder()).toBeResolvedTo('reverse');
  });
});

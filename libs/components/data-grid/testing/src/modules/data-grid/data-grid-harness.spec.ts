import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAgGridWrapperHarness } from '@skyux/ag-grid/testing';
import { SkyWaitHarness } from '@skyux/indicators/testing';
import { SkyPagingHarness } from '@skyux/lists/testing';

import { SkyDataGridHarness } from './data-grid-harness';
import { DataGridTestComponent } from './fixtures/data-grid-test.component';

/**
 * Deterministically proves that a query resolves only after the grid's
 * render-readiness signal (`SkyAgGridWrapperHarness#waitUntilRendered`)
 * settles, rather than merely happening to pass because the fixture's real
 * render finished quickly. This is necessary because in ChromeHeadless the
 * real AG Grid render for this small fixture completes fast enough that an
 * unguarded query passes the vast majority of the time too - a plain
 * "detectChanges then query" spec would not fail on an unguarded method and
 * so would not actually prove the guard exists. Instead, this replaces
 * `waitUntilRendered()` with a promise under test control: while it's
 * pending, a guarded query must still be pending too; only after it's
 * released may the query resolve. An unguarded query (i.e. the base
 * `SkyQueryableComponentHarness` implementation, with no override) never
 * calls `waitUntilRendered()` at all and resolves immediately, so it fails
 * the "not yet resolved" assertion below.
 */
async function expectRenderWaitGatesResolution<T>(
  runQuery: () => Promise<T>,
): Promise<T> {
  let releaseRenderWait!: () => void;
  const renderWait = new Promise<void>((resolve) => {
    releaseRenderWait = resolve;
  });
  const waitUntilRenderedSpy = spyOn(
    SkyAgGridWrapperHarness.prototype,
    'waitUntilRendered',
  ).and.returnValue(renderWait);

  let resolved = false;
  const pending = runQuery().then((result) => {
    resolved = true;
    return result;
  });

  // Let any already-pending microtasks or timers (e.g. the grid wrapper
  // harness lookup) run to completion. The query itself must still be
  // pending, because it's blocked on the deferred render wait above.
  await new Promise((resolve) => setTimeout(resolve, 50));
  expect(waitUntilRenderedSpy).toHaveBeenCalled();
  expect(resolved).toBe(false);

  releaseRenderWait();
  const result = await pending;
  expect(resolved).toBe(true);
  return result;
}

describe('data-grid-harness', () => {
  let fixture: ComponentFixture<DataGridTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(DataGridTestComponent);
  });

  it('should check if the grid is ready', async () => {
    fixture.componentRef.setInput('showAllColumns', false);
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );
    await expectAsync(harness.isGridReady()).toBeResolvedTo(false);
    await expectAsync(harness.isLoading()).toBeResolvedTo(true);

    fixture.componentRef.setInput('showAllColumns', true);
    fixture.detectChanges();

    await expectAsync(harness.isGridReady()).toBeResolvedTo(true);
    await expectAsync(harness.isLoading()).toBeResolvedTo(false);
  });

  it('should get columns', async () => {
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );
    await expectAsync(harness.isGridReady()).toBeResolvedTo(true);
    await expectAsync(harness.getDisplayedColumnIds()).toBeResolvedTo([
      'column1',
      'column2',
      'column3',
    ]);
    await expectAsync(harness.getDisplayedColumnHeaderNames()).toBeResolvedTo([
      'Column1',
      'Column2',
      'Column3',
    ]);

    fixture.componentRef.setInput('showCol3', false);
    fixture.detectChanges();

    await expectAsync(harness.getDisplayedColumnIds()).toBeResolvedTo([
      'column1',
      'column2',
    ]);
    await expectAsync(harness.getDisplayedColumnHeaderNames()).toBeResolvedTo([
      'Column1',
      'Column2',
    ]);
  });

  it('should sort columns', async () => {
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );
    await expectAsync(harness.isGridReady()).toBeResolvedTo(true);
    await harness.clickColumnSortButton('column2');
    fixture.detectChanges();
    expect(fixture.componentInstance.sortForSimpleGrid()).toEqual({
      field: 'column2',
      direction: 'desc',
    });
  });

  it('should get displayed row count', async () => {
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );
    await expectAsync(harness.isGridReady()).toBeResolvedTo(true);
    await expectAsync(harness.getDisplayedRowCount()).toBeResolvedTo(7);
  });

  it('should throw error if the grid is not available', async () => {
    fixture.componentRef.setInput('showAllColumns', false);
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );
    await expectAsync(harness.isGridReady()).toBeResolvedTo(false);
    await expectAsync(harness.getDisplayedColumnIds()).toBeRejectedWithError(
      'Unable to retrieve displayed column IDs.',
    );
    await expectAsync(
      harness.getDisplayedColumnHeaderNames(),
    ).toBeRejectedWithError(
      'Unable to retrieve displayed column header names.',
    );
    await expectAsync(harness.getDisplayedRowCount()).toBeRejectedWithError(
      'Unable to retrieve total number of displayed rows.',
    );

    fixture.componentRef.setInput('showAllColumns', true);
    fixture.detectChanges();

    await expectAsync(harness.getDisplayedColumnIds()).toBeResolvedTo([
      'column1',
      'column2',
      'column3',
    ]);
    await expectAsync(harness.getDisplayedColumnHeaderNames()).toBeResolvedTo([
      'Column1',
      'Column2',
      'Column3',
    ]);

    fixture.componentRef.setInput('showCol3HeaderText', false);
    fixture.detectChanges();

    await expectAsync(harness.getDisplayedColumnHeaderNames()).toBeResolvedTo([
      'Column1',
      'Column2',
      '',
    ]);
  });

  it('should get the paging harness for a paged grid', async () => {
    fixture.componentRef.setInput('pageSize', 5);
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );
    await expectAsync(harness.isGridReady()).toBeResolvedTo(true);

    const paging = await harness.getPaging();
    expect(paging).toBeInstanceOf(SkyPagingHarness);
    await expectAsync(paging.getCurrentPage()).toBeResolvedTo(1);

    await paging.clickNextButton();
    fixture.detectChanges();

    await expectAsync(paging.getCurrentPage()).toBeResolvedTo(2);
  });

  it('should get the paging harness or null', async () => {
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );

    await expectAsync(harness.getPagingOrNull()).toBeResolvedTo(null);

    fixture.componentRef.setInput('pageSize', 5);
    fixture.detectChanges();

    await expectAsync(harness.getPagingOrNull()).toBeResolvedTo(
      jasmine.any(SkyPagingHarness),
    );
  });

  it('should throw an error when getting paging for an unpaged grid', async () => {
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );

    await expectAsync(harness.getPaging()).toBeRejectedWithError(
      'Unable to retrieve paging. The data grid is not paged.',
    );
  });

  it('should not resolve querySelector until the grid finishes rendering', async () => {
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );

    const cell = await expectRenderWaitGatesResolution(() =>
      harness.querySelector('.ag-cell'),
    );
    expect(cell).toBeTruthy();
  });

  it('should not resolve querySelectorOrNull until the grid finishes rendering', async () => {
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );

    const cell = await expectRenderWaitGatesResolution(() =>
      harness.querySelectorOrNull('.ag-cell'),
    );
    expect(cell).toBeTruthy();
  });

  it('should resolve querySelectorOrNull to null when no element matches', async () => {
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );

    await expectAsync(
      harness.querySelectorOrNull('.does-not-exist'),
    ).toBeResolvedTo(null);
  });

  it('should not resolve querySelectorAll until the grid finishes rendering', async () => {
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );

    const cells = await expectRenderWaitGatesResolution(() =>
      harness.querySelectorAll('.ag-cell'),
    );
    expect(cells.length).toBeGreaterThan(0);
  });

  it('should get the wait harness and reflect grid readiness', async () => {
    fixture.componentRef.setInput('showAllColumns', false);
    fixture.detectChanges();

    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'grid' }),
    );

    const wait = await harness.getWait();
    expect(wait).toBeInstanceOf(SkyWaitHarness);
    await expectAsync(harness.isGridReady()).toBeResolvedTo(false);
    await expectAsync(wait.isWaiting()).toBeResolvedTo(true);

    fixture.componentRef.setInput('showAllColumns', true);
    fixture.detectChanges();

    await expectAsync(harness.isGridReady()).toBeResolvedTo(true);
    await expectAsync(wait.isWaiting()).toBeResolvedTo(false);
  });
});

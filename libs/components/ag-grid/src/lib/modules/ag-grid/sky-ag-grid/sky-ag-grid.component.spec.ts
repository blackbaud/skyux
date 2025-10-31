import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { SkyWaitHarness } from '@skyux/indicators/testing';
import { SkyPagingHarness } from '@skyux/lists/testing';

import { getGridApi } from 'ag-grid-community';

import { SkyAgGridWrapperComponent } from '../ag-grid-wrapper.component';
import { SkyAgGridHeaderComponent } from '../header/header.component';

import { AgGridTestComponent } from './fixtures/ag-grid-test.component';
import { SkyAgGridComponent } from './sky-ag-grid.component';

describe('SkyAgGridComponent', () => {
  let fixture: ComponentFixture<AgGridTestComponent>;
  let component: AgGridTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideLocationMocks()],
    });
    fixture = TestBed.createComponent(AgGridTestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should destroy and recreate grid', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();

    fixture.componentRef.setInput('showAllGrids', false);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.debugElement.queryAll(By.directive(SkyAgGridComponent)),
    ).toEqual([]);

    fixture.componentRef.setInput('showAllGrids', true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.debugElement.queryAll(By.directive(SkyAgGridComponent)).length,
    ).toEqual(4);
  });

  it('should destroy and recreate columns', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    expect(
      fixture.debugElement.queryAll(By.directive(SkyAgGridHeaderComponent))
        .length,
    ).toEqual(4 * 3 + 2); // 4 grids with 3 columns each, plus 2 extra headers for the multi-select and row delete grid

    fixture.componentRef.setInput('showCol3', false);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.debugElement.queryAll(By.directive(SkyAgGridHeaderComponent))
        .length,
    ).toEqual(4 * 2 + 3); // 4 grids with 2 columns each, plus 3 extra headers for multi-select, row delete, and date column
    expect(component.visibleColumnIds()).toEqual(['column1', 'column2']);

    fixture.componentRef.setInput('showCol3', true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.debugElement.queryAll(By.directive(SkyAgGridHeaderComponent))
        .length,
    ).toEqual(4 * 3 + 2); // 4 grids with 3 columns each, plus 2 extra headers for the multi-select and row delete grid
    expect(component.visibleColumnIds()).toEqual([
      'column1',
      'column2',
      'column3',
    ]);

    fixture.componentRef.setInput('showAllColumns', false);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.debugElement.queryAll(By.directive(SkyAgGridHeaderComponent))
        .length,
    ).toEqual(0);
    expect(
      fixture.debugElement.queryAll(By.directive(SkyAgGridWrapperComponent))
        .length,
    ).toEqual(0);
  });

  it('should respond to displayedColumns input', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    expect(
      fixture.debugElement.queryAll(By.directive(SkyAgGridHeaderComponent))
        .length,
    ).toEqual(4 * 3 + 2); // 4 grids with 3 columns each, plus 2 extra headers for the multi-select and row delete grid

    fixture.componentRef.setInput('displayedColumns', ['column1', 'column2']);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.debugElement.queryAll(By.directive(SkyAgGridHeaderComponent))
        .length,
    ).toEqual(4 * 2); // 4 grids with 2 columns each
    expect(component.visibleColumnIds()).toEqual(['column1', 'column2']);

    fixture.componentRef.setInput('displayedColumns', [
      'column1',
      'column2',
      'column3',
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.debugElement.queryAll(By.directive(SkyAgGridHeaderComponent))
        .length,
    ).toEqual(4 * 3); // 4 grids with 3 columns each
    expect(component.visibleColumnIds()).toEqual([
      'column1',
      'column2',
      'column3',
    ]);

    fixture.componentRef.setInput('showAllColumns', false);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.debugElement.queryAll(By.directive(SkyAgGridHeaderComponent))
        .length,
    ).toEqual(0);
    expect(
      fixture.debugElement.queryAll(By.directive(SkyAgGridWrapperComponent))
        .length,
    ).toEqual(0);
  });

  it('should handle empty data', async () => {
    component.dataForSimpleGrid = undefined;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    const waitHarness =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(
        SkyWaitHarness,
      );
    await expectAsync(waitHarness.isWaiting()).toBeResolvedTo(false);
    expect(
      Array.from(
        fixture.nativeElement
          .querySelector('.ag-viewport')
          .querySelectorAll('[role="row"]'),
      ),
    ).toHaveSize(0);
  });

  it('should select all rows', async () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    const waitHarness =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(
        SkyWaitHarness,
      );
    await expectAsync(waitHarness.isWaiting()).toBeResolvedTo(false);
    const api = getGridApi(
      fixture.nativeElement.querySelector(
        '[data-sky-id="multiselect-grid"] ag-grid-angular',
      ),
    );
    expect(api).toBeTruthy();
    expect(api?.getSelectedNodes()).toHaveSize(0);
    api?.selectAll();
    expect(api?.getSelectedNodes()).toHaveSize(7);
  });

  it('should select some rows', async () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    fixture.detectChanges();
    await fixture.whenStable();
    const waitHarnesses =
      await TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(
        SkyWaitHarness,
      );
    await expectAsync(
      Promise.all(waitHarnesses.map((waitHarness) => waitHarness.isWaiting())),
    ).toBeResolvedTo([false, false, false, false]);
    const api = getGridApi(
      fixture.nativeElement.querySelector(
        '[data-sky-id="multiselect-grid"] ag-grid-angular',
      ),
    );
    expect(api).toBeTruthy();
    expect(api?.getSelectedNodes()).toHaveSize(0);
    component.selectedRowIds.set(['102', '104', '106']);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(api?.getSelectedNodes()).toHaveSize(3);
  });

  it('should highlight row', async () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    const waitHarness = await TestbedHarnessEnvironment.loader(
      fixture,
    ).getHarness(SkyWaitHarness.with({ ancestor: '[data-sky-id="grid"]' }));
    await expectAsync(waitHarness.isWaiting()).toBeResolvedTo(false);
    const api = getGridApi(
      fixture.nativeElement.querySelector(
        '[data-sky-id="grid"] ag-grid-angular',
      ),
    );
    expect(api).toBeTruthy();
    expect(api?.getRowNode('2')?.isSelected()).toBeFalse();
    fixture.componentRef.setInput('rowHighlightedId', '2');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(api?.getRowNode('2')?.isSelected()).toBeTrue();
  });

  it('should handle paging without url changes', async () => {
    component.pageSize = 4;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    const pagingHarness =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(
        SkyPagingHarness,
      );
    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(1);
    await pagingHarness.clickNextButton();
    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(2);
    await pagingHarness.clickPreviousButton();
    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(1);
  });

  it('should handle paging with url changes', async () => {
    component.pageSize = 2;
    component.pageQueryParam = 'page';
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    const pagingHarness =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(
        SkyPagingHarness,
      );
    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(1);
    await pagingHarness.clickPageButton(2);
    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(2);
    expect(navSpy).toHaveBeenCalledWith(['.'], {
      relativeTo: jasmine.any(ActivatedRoute),
      queryParams: { page: 2 },
      queryParamsHandling: 'merge',
    });
    navSpy.calls.reset();

    component.page = 2;
    fixture.detectChanges();

    await pagingHarness.clickPageButton(1);
    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(1);
    expect(navSpy).toHaveBeenCalledWith(['.'], {
      relativeTo: jasmine.any(ActivatedRoute),
      queryParams: { page: null },
      queryParamsHandling: 'merge',
    });
    navSpy.calls.reset();

    component.page = 1;
    fixture.detectChanges();

    await pagingHarness.clickPageButton(3);
    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(3);
    expect(navSpy).toHaveBeenCalledWith(['.'], {
      relativeTo: jasmine.any(ActivatedRoute),
      queryParams: { page: 3 },
      queryParamsHandling: 'merge',
    });
    navSpy.calls.reset();

    component.page = 3;
    fixture.detectChanges();

    await pagingHarness.clickPageButton(2);
    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(2);
    expect(navSpy).toHaveBeenCalledWith(['.'], {
      relativeTo: jasmine.any(ActivatedRoute),
      queryParams: { page: 2 },
      queryParamsHandling: 'merge',
    });
    navSpy.calls.reset();

    component.page = 0;
    fixture.detectChanges();
    expect(navSpy).not.toHaveBeenCalledWith(['.'], {
      relativeTo: jasmine.any(ActivatedRoute),
      queryParams: { page: 0 },
      queryParamsHandling: 'merge',
    });

    component.page = Number.POSITIVE_INFINITY;
    fixture.detectChanges();
    expect(navSpy).not.toHaveBeenCalledWith(['.'], {
      relativeTo: jasmine.any(ActivatedRoute),
      queryParams: { page: Number.POSITIVE_INFINITY },
      queryParamsHandling: 'merge',
    });
  });
});

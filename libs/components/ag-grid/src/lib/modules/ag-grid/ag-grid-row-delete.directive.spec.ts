import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyAgGridRowDeleteFixtureComponent } from './fixtures/ag-grid-row-delete.component.fixture';
import { SkyAgGridFixtureModule } from './fixtures/ag-grid.module.fixture';

describe('SkyAgGridRowDeleteDirective', () => {
  let fixture: ComponentFixture<SkyAgGridRowDeleteFixtureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
    });

    fixture = TestBed.createComponent(SkyAgGridRowDeleteFixtureComponent);
    fixture.detectChanges();
  });

  it('should show row delete elements correctly', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(document.querySelector('.sky-inline-delete-standared')).toBeNull();

    fixture.componentInstance.rowDeleteIds = ['0'];

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(document.querySelector('#row-delete-ref-0')).not.toBeNull();
    expect(
      document.querySelectorAll('.sky-inline-delete-standard').length
    ).toBe(1);

    fixture.componentInstance.rowDeleteIds = ['0', '2'];

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(document.querySelector('#row-delete-ref-2')).not.toBeNull();
    expect(
      document.querySelectorAll('.sky-inline-delete-standard').length
    ).toBe(2);

    fixture.componentInstance.addDataPoint();

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.rowDeleteIds).toEqual(['0', '2']);
    expect(document.querySelector('#row-delete-ref-0')).not.toBeNull();
    expect(document.querySelector('#row-delete-ref-2')).not.toBeNull();
    expect(
      document.querySelectorAll('.sky-inline-delete-standard').length
    ).toBe(2);

    fixture.componentInstance.sortName();

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.rowDeleteIds).toEqual(['0', '2']);
    expect(document.querySelector('#row-delete-ref-0')).not.toBeNull();
    expect(document.querySelector('#row-delete-ref-2')).not.toBeNull();
    expect(
      document.querySelectorAll('.sky-inline-delete-standard').length
    ).toBe(2);

    fixture.componentInstance.filterName();

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.rowDeleteIds).toEqual(['0', '2']);
    expect(document.querySelector('#row-delete-ref-0')).not.toBeNull();
    expect(document.querySelector('#row-delete-ref-2')).not.toBeNull();
    expect(
      document.querySelectorAll('.sky-inline-delete-standard').length
    ).toBe(2);

    fixture.componentInstance.clearFilter();
    fixture.componentInstance.changeToLongData();

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.rowDeleteIds).toEqual(['0', '2']);
    expect(document.querySelector('#row-delete-ref-0')).not.toBeNull();
    expect(document.querySelector('#row-delete-ref-2')).not.toBeNull();
    expect(
      document.querySelectorAll('.sky-inline-delete-standard').length
    ).toBe(2);

    fixture.componentInstance.removeFirstItem();

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.rowDeleteIds).toEqual(['2']);
    expect(document.querySelector('#row-delete-ref-0')).toBeNull();
    expect(document.querySelector('#row-delete-ref-2')).not.toBeNull();
    expect(
      document.querySelectorAll('.sky-inline-delete-standard').length
    ).toBe(1);
  });

  it('should cancel row delete elements correctly via them being removed from the id array', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(document.querySelector('.sky-inline-delete-standard')).toBeNull();

    fixture.componentInstance.rowDeleteIds = ['0'];

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(document.querySelector('#row-delete-ref-0')).not.toBeNull();
    expect(
      document.querySelectorAll('.sky-inline-delete-standard').length
    ).toBe(1);

    fixture.componentInstance.rowDeleteIds = [];

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(document.querySelector('.sky-inline-delete-standard')).toBeNull();
  });

  it('should cancel row delete elements correctly via the id array being set to undefined', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(document.querySelector('.sky-inline-delete-standard')).toBeNull();

    fixture.componentInstance.rowDeleteIds = ['0'];

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(document.querySelector('#row-delete-ref-0')).not.toBeNull();
    expect(
      document.querySelectorAll('.sky-inline-delete-standard').length
    ).toBe(1);

    fixture.componentInstance.rowDeleteIds = undefined;

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(document.querySelector('.sky-inline-delete-standard')).toBeNull();
  });

  it('should cancel row delete elements correctly via click', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(document.querySelector('.sky-inline-delete-standard')).toBeNull();

    fixture.componentInstance.rowDeleteIds = ['0'];
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(document.querySelector('#row-delete-ref-0')).not.toBeNull();
    expect(
      document.querySelectorAll('.sky-inline-delete-standard').length
    ).toBe(1);

    (
      document.querySelectorAll(
        '.sky-inline-delete .sky-btn-default'
      )[0] as HTMLElement
    ).click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.rowDeleteIds).toEqual([]);
    expect(document.querySelector('.sky-inline-delete-standard')).toBeNull();
  });

  it('should update the pending status of a row being deleted correctly', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(document.querySelector('.sky-inline-delete-standard')).toBeNull();

    fixture.componentInstance.rowDeleteIds = ['0'];

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(document.querySelector('#row-delete-ref-0')).not.toBeNull();
    expect(
      document.querySelectorAll('.sky-inline-delete-standard').length
    ).toBe(1);
    expect(
      document.querySelectorAll(
        '.sky-inline-delete-standard .sky-wait-mask-loading-blocking'
      ).length
    ).toBe(0);

    (
      document.querySelectorAll('.sky-inline-delete-button')[0] as HTMLElement
    ).click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.rowDeleteIds).toEqual(['0']);
    expect(document.querySelector('#row-delete-ref-0')).not.toBeNull();
    expect(
      document.querySelectorAll('.sky-inline-delete-standard').length
    ).toBe(1);
    expect(
      document.querySelectorAll(
        '.sky-inline-delete-standard .sky-wait-mask-loading-blocking'
      ).length
    ).toBe(1);

    fixture.componentInstance.rowDeleteIds = ['0'];
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.rowDeleteIds).toEqual(['0']);
    expect(document.querySelector('#row-delete-ref-0')).not.toBeNull();
    expect(
      document.querySelectorAll('.sky-inline-delete-standard').length
    ).toBe(1);
    expect(
      document.querySelectorAll(
        '.sky-inline-delete-standard .sky-wait-mask-loading-blocking'
      ).length
    );
  });

  it('should output the delete event correctly', async () => {
    spyOn(fixture.componentInstance, 'cancelRowDelete').and.callThrough();
    spyOn(fixture.componentInstance, 'finishRowDelete').and.callThrough();

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.rowDeleteIds = ['0', '1'];

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.finishRowDelete).not.toHaveBeenCalled();

    (
      document.querySelectorAll('.sky-inline-delete-button')[0] as HTMLElement
    ).click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.rowDeleteIds).toEqual(['0', '1']);
    expect(fixture.componentInstance.cancelRowDelete).not.toHaveBeenCalled();
    expect(fixture.componentInstance.finishRowDelete).toHaveBeenCalledWith({
      id: '0',
    });
  });

  it('should output the cancel event correctly', async () => {
    spyOn(fixture.componentInstance, 'cancelRowDelete').and.callThrough();
    spyOn(fixture.componentInstance, 'finishRowDelete').and.callThrough();

    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.rowDeleteIds = ['0', '1'];

    fixture.detectChanges();
    await fixture.whenStable();

    expect(
      document.querySelectorAll('.sky-inline-delete-standard').length
    ).toBe(2);
    expect(fixture.componentInstance.cancelRowDelete).not.toHaveBeenCalled();

    (
      document.querySelectorAll(
        '.sky-inline-delete-standard .sky-btn-default'
      )[0] as HTMLElement
    ).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.rowDeleteIds).toEqual(['1']);
    expect(fixture.componentInstance.cancelRowDelete).toHaveBeenCalledWith({
      id: '0',
    });
    expect(fixture.componentInstance.finishRowDelete).not.toHaveBeenCalled();
  });

  it('should set the z-index of the row delete overlays correctly', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.rowDeleteIds = ['0', '1'];

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const overlays = Array.from(document.querySelectorAll('.sky-overlay'));
    // The `toString` here is to address IE returning a number but all other browsers
    // returning a string
    overlays.forEach((overlay: HTMLElement) =>
      expect(overlay.style.zIndex.toString()).toBe('998')
    );
    expect(fixture.componentInstance.rowDeleteIds).toEqual(['0', '1']);
  });

  it('should not change the column widths when a row delete is triggered', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const columnWidths: number[] = [];
    let columns = Array.from(document.querySelectorAll('.sky-grid-heading'));
    columns.forEach((column: HTMLElement) =>
      columnWidths.push(column.offsetWidth)
    );
    fixture.componentInstance.rowDeleteIds = ['0'];

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.rowDeleteIds).toEqual(['0']);
    columns = Array.from(document.querySelectorAll('.sky-grid-heading'));
    for (let i = 0; i < columns.length; i++) {
      expect((columns[i] as HTMLElement).offsetWidth).toEqual(columnWidths[i]);
    }
  });

  it('should not change the column widths when a row delete is triggered when all columns have set widths', async () => {
    fixture.componentInstance.allColumnWidth = 100;

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const columnWidths: number[] = [];
    let columns = Array.from(document.querySelectorAll('.sky-grid-heading'));
    columns.forEach((column: HTMLElement) =>
      columnWidths.push(column.offsetWidth)
    );
    fixture.componentInstance.rowDeleteIds = ['0'];

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.rowDeleteIds).toEqual(['0']);
    columns = Array.from(document.querySelectorAll('.sky-grid-heading'));
    for (let i = 0; i < columns.length; i++) {
      expect((columns[i] as HTMLElement).offsetWidth).toEqual(columnWidths[i]);
    }
  });

  it('should place the row delete overlay on top of the row correctly', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.rowDeleteIds = ['0', '1'];

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const row1Rect = fixture.nativeElement
      .querySelector('[row-id="0"] div')
      .getBoundingClientRect();
    const row2Rect = fixture.nativeElement
      .querySelector('[row-id="1"] div')
      .getBoundingClientRect();
    const inlienDelete1: HTMLElement =
      document.querySelector('#row-delete-ref-0');
    const inlienDelete2: HTMLElement =
      document.querySelector('#row-delete-ref-1');
    expect(fixture.componentInstance.rowDeleteIds).toEqual(['0', '1']);
    expect(inlienDelete1.offsetLeft).toEqual(Math.round(row1Rect.left));
    expect(inlienDelete1.offsetTop).toEqual(Math.round(row1Rect.top));
    expect(inlienDelete2.offsetLeft).toEqual(Math.round(row2Rect.left));
    expect(inlienDelete2.offsetTop).toEqual(Math.round(row2Rect.top));
  });
});

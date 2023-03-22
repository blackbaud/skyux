import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SKY_STACKING_CONTEXT, SkyScrollableHostService } from '@skyux/core';

import { BehaviorSubject, Observable, of } from 'rxjs';

import { SkyAgGridRowDeleteFixtureComponent } from './fixtures/ag-grid-row-delete.component.fixture';
import { SkyAgGridFixtureModule } from './fixtures/ag-grid.module.fixture';

describe('SkyAgGridRowDeleteDirective', () => {
  let fixture: ComponentFixture<SkyAgGridRowDeleteFixtureComponent>;

  function setupTest(options?: { stackingContextZIndex?: number }) {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
      providers: [
        {
          provide: SKY_STACKING_CONTEXT,
          useValue: options?.stackingContextZIndex
            ? {
                zIndex: new BehaviorSubject(options.stackingContextZIndex),
              }
            : undefined,
        },
        {
          provide: SkyScrollableHostService,
          useValue: {
            watchScrollableHost: jasmine
              .createSpy('watchScrollableHost')
              .and.returnValue(new Observable()),
            watchScrollableHostClipPathChanges: jasmine
              .createSpy('watchScrollableHostClipPathChanges')
              .and.returnValue(of('none')),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(SkyAgGridRowDeleteFixtureComponent);
    fixture.detectChanges();
  }

  afterEach(() => {
    (
      TestBed.inject(SKY_STACKING_CONTEXT)?.zIndex as BehaviorSubject<number>
    )?.complete();
    fixture.destroy();
  });

  describe('show row delete elements correctly', () => {
    it('should show for one row', async () => {
      setupTest();
      await fixture.whenStable();

      expect(document.querySelector('.sky-inline-delete-standard')).toBeNull();

      fixture.componentInstance.rowDeleteIds = ['0'];
      fixture.detectChanges();
      await fixture.whenStable();

      expect(document.querySelector('#row-delete-ref-0')).not.toBeNull();
      expect(
        document.querySelectorAll('.sky-inline-delete-standard').length
      ).toBe(1);
    });

    it('should show for multiple rows', async () => {
      setupTest();
      await fixture.whenStable();

      expect(document.querySelector('.sky-inline-delete-standard')).toBeNull();

      fixture.componentInstance.rowDeleteIds = ['0', '2'];
      fixture.detectChanges();
      await fixture.whenStable();

      expect(document.querySelector('#row-delete-ref-2')).not.toBeNull();
      expect(
        document.querySelectorAll('.sky-inline-delete-standard').length
      ).toBe(2);
    });

    it('should respond to data changes', async () => {
      setupTest();
      await fixture.whenStable();

      fixture.componentInstance.rowDeleteIds = ['0', '2'];
      fixture.detectChanges();
      await fixture.whenStable();

      fixture.componentInstance.addDataPoint();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.componentInstance.rowDeleteIds).toEqual(['0', '2']);
      expect(document.querySelector('#row-delete-ref-0')).not.toBeNull();
      expect(document.querySelector('#row-delete-ref-2')).not.toBeNull();
      expect(
        document.querySelectorAll('.sky-inline-delete-standard').length
      ).toBe(2);
    });

    it('should respond to sorting', async () => {
      setupTest();
      await fixture.whenStable();

      fixture.componentInstance.rowDeleteIds = ['0', '2'];
      fixture.detectChanges();
      await fixture.whenStable();

      await fixture.componentInstance.sortName();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.componentInstance.rowDeleteIds).toEqual(['0', '2']);
      expect(document.querySelector('#row-delete-ref-0')).not.toBeNull();
      expect(document.querySelector('#row-delete-ref-2')).not.toBeNull();
      expect(
        document.querySelectorAll('.sky-inline-delete-standard').length
      ).toBe(2);
    });

    it('should respond to filtering', async () => {
      setupTest();
      await fixture.whenStable();

      fixture.componentInstance.rowDeleteIds = ['0', '2'];
      fixture.detectChanges();
      await fixture.whenStable();

      await fixture.componentInstance.filterName();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.componentInstance.rowDeleteIds).toEqual(['0', '2']);
      expect(document.querySelector('#row-delete-ref-0')).not.toBeNull();
      expect(document.querySelector('#row-delete-ref-2')).not.toBeNull();
      expect(
        document.querySelectorAll('.sky-inline-delete-standard').length
      ).toBe(2);

      await fixture.componentInstance.clearFilter();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.componentInstance.rowDeleteIds).toEqual(['0', '2']);
      expect(document.querySelector('#row-delete-ref-0')).not.toBeNull();
      expect(document.querySelector('#row-delete-ref-2')).not.toBeNull();
      expect(
        document.querySelectorAll('.sky-inline-delete-standard').length
      ).toBe(2);
    });

    it('should respond dataset changes', async () => {
      setupTest();
      await fixture.whenStable();

      fixture.componentInstance.rowDeleteIds = ['0', '2'];
      fixture.detectChanges();
      await fixture.whenStable();

      fixture.componentInstance.removeFirstItem();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.componentInstance.rowDeleteIds).toEqual(['2']);
      expect(document.querySelector('#row-delete-ref-0')).toBeNull();
      expect(document.querySelector('#row-delete-ref-2')).not.toBeNull();
      expect(
        document.querySelectorAll('.sky-inline-delete-standard').length
      ).toBe(1);
    });
  });

  it('should cancel row delete elements correctly via them being removed from the id array', async () => {
    setupTest();
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
    setupTest();
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
    setupTest();
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
    setupTest();
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
    setupTest();
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
    setupTest();
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
    setupTest();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.rowDeleteIds = ['0', '1'];

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const overlays = Array.from(
      document.querySelectorAll('.sky-overlay')
    ) as HTMLElement[];
    // The `toString` here is to address IE returning a number but all other browsers
    // returning a string
    overlays.forEach((overlay) =>
      expect(overlay.style.zIndex.toString()).toBe('998')
    );
    expect(fixture.componentInstance.rowDeleteIds).toEqual(['0', '1']);
    expect(
      TestBed.inject(SkyScrollableHostService)
        .watchScrollableHostClipPathChanges
    ).not.toHaveBeenCalled();
  });

  it('should set the z-index of the row delete overlays with stacking context', async () => {
    setupTest({
      stackingContextZIndex: 1111,
    });
    await fixture.whenStable();

    fixture.componentInstance.rowDeleteIds = ['0', '1'];

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const overlays = Array.from(
      document.querySelectorAll('.sky-overlay')
    ) as HTMLElement[];
    expect(overlays.length).toBe(2);
    overlays.forEach((overlay) => expect(overlay.style.zIndex).toBe('1111'));
    expect(fixture.componentInstance.rowDeleteIds).toEqual(['0', '1']);
    expect(
      TestBed.inject(SkyScrollableHostService)
        .watchScrollableHostClipPathChanges
    ).toHaveBeenCalled();
  });

  it('should not change the column widths when a row delete is triggered', async () => {
    setupTest();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const columnWidths: number[] = [];
    let columns = Array.from(
      document.querySelectorAll('.sky-grid-heading')
    ) as HTMLElement[];
    columns.forEach((column) => columnWidths.push(column.offsetWidth));
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
    setupTest();
    fixture.componentInstance.allColumnWidth = 100;

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const columnWidths: number[] = [];
    let columns = Array.from(
      document.querySelectorAll('.sky-grid-heading')
    ) as HTMLElement[];
    columns.forEach((column) => columnWidths.push(column.offsetWidth));
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
    setupTest();
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
    const inlineDelete1 = document.querySelector(
      '#row-delete-ref-0'
    ) as HTMLElement;
    const inlineDelete2 = document.querySelector(
      '#row-delete-ref-1'
    ) as HTMLElement;
    expect(fixture.componentInstance.rowDeleteIds).toEqual(['0', '1']);
    expect(inlineDelete1.offsetLeft).toEqual(Math.round(row1Rect.left));
    expect(inlineDelete1.offsetTop).toEqual(Math.round(row1Rect.top));
    expect(inlineDelete2.offsetLeft).toEqual(Math.round(row2Rect.left));
    expect(inlineDelete2.offsetTop).toEqual(Math.round(row2Rect.top));
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyLogService } from '@skyux/core';

import { FluidGridNestedTestComponent } from './fixtures/fluid-grid-nested.component.fixture';
import { FluidGridTestComponent } from './fixtures/fluid-grid.component.fixture';
import { FluidGridTestModule } from './fixtures/fluid-grid.module.fixture';
import { SkyFluidGridGutterSizeType } from './types/fluid-grid-gutter-size-type';

// #region helpers
function getFluidGrid(fixture: ComponentFixture<any>): HTMLElement {
  return fixture.nativeElement.querySelector('.sky-fluid-grid') as HTMLElement;
}
// #endregion

describe('SkyFluidGridComponent', () => {
  let fixture: ComponentFixture<FluidGridTestComponent>;

  function validateGutterSize(
    fluidGrid: HTMLElement,
    gutterSize: SkyFluidGridGutterSizeType,
    expectedGutterSizeClass:
      | 'sky-fluid-grid-gutter-size-small'
      | 'sky-fluid-grid-gutter-size-medium'
      | 'sky-fluid-grid-gutter-size-large',
  ): void {
    fixture.componentRef.setInput('gutterSize', gutterSize);
    fixture.detectChanges();

    const gutterSizeClasses: string[] = [
      'sky-fluid-grid-gutter-size-small',
      'sky-fluid-grid-gutter-size-medium',
      'sky-fluid-grid-gutter-size-large',
    ];

    for (const gutterSizeClass of gutterSizeClasses) {
      if (gutterSizeClass === expectedGutterSizeClass) {
        expect(fluidGrid).toHaveCssClass(gutterSizeClass);
      } else {
        expect(fluidGrid).not.toHaveCssClass(gutterSizeClass);
      }
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FluidGridTestModule],
    });

    fixture = TestBed.createComponent(FluidGridTestComponent);
    fixture.detectChanges();
  });

  it('should default to the large CSS class', () => {
    const fluidGrid = getFluidGrid(fixture);

    expect(fluidGrid).not.toHaveCssClass('sky-fluid-grid-gutter-size-small');
    expect(fluidGrid).not.toHaveCssClass('sky-fluid-grid-gutter-size-medium');
    expect(fluidGrid).toHaveCssClass('sky-fluid-grid-gutter-size-large');
  });

  it('should change CSS class when gutterSize is updated', () => {
    const fluidGrid = getFluidGrid(fixture);

    validateGutterSize(fluidGrid, 'small', 'sky-fluid-grid-gutter-size-small');

    validateGutterSize(
      fluidGrid,
      'medium',
      'sky-fluid-grid-gutter-size-medium',
    );

    validateGutterSize(fluidGrid, 'large', 'sky-fluid-grid-gutter-size-large');
  });

  it('should add the no-margins CSS class by default when neither disableMargin nor inset are set', () => {
    const fluidGrid = getFluidGrid(fixture);

    fixture.detectChanges();

    expect(fluidGrid).toHaveCssClass('sky-fluid-grid-no-margin');
  });

  it('should not have the no-margins CSS class when disableMargin is explicitly set to false', () => {
    const fluidGrid = getFluidGrid(fixture);

    fixture.componentRef.setInput('disableMargin', false);
    fixture.detectChanges();

    expect(fluidGrid).not.toHaveCssClass('sky-fluid-grid-no-margin');
  });

  it('should add the no-margins CSS class when disableMargin is true', () => {
    const fluidGrid = getFluidGrid(fixture);
    fixture.componentRef.setInput('disableMargin', true);
    fixture.detectChanges();

    expect(fluidGrid).toHaveCssClass('sky-fluid-grid-no-margin');
  });

  it('should not have the no-margins CSS class when inset is true', () => {
    const fluidGrid = getFluidGrid(fixture);

    fixture.componentRef.setInput('inset', true);
    fixture.detectChanges();

    expect(fluidGrid).not.toHaveCssClass('sky-fluid-grid-no-margin');
  });

  it('should add the no-margins CSS class when inset is false', () => {
    const fluidGrid = getFluidGrid(fixture);

    fixture.componentRef.setInput('inset', false);
    fixture.detectChanges();

    expect(fluidGrid).toHaveCssClass('sky-fluid-grid-no-margin');
  });

  it('should let the deprecated disableMargin input take precedence over inset when both are set', () => {
    const fluidGrid = getFluidGrid(fixture);

    // disableMargin says "show the margin", but inset says "hide it" -- disableMargin wins.
    fixture.componentRef.setInput('disableMargin', false);
    fixture.componentRef.setInput('inset', false);
    fixture.detectChanges();

    expect(fluidGrid).not.toHaveCssClass('sky-fluid-grid-no-margin');
  });

  it('should let disableMargin override inset in the other direction as well', () => {
    const fluidGrid = getFluidGrid(fixture);

    // disableMargin says "hide the margin", but inset says "show it" -- disableMargin wins.
    fixture.componentRef.setInput('disableMargin', true);
    fixture.componentRef.setInput('inset', true);
    fixture.detectChanges();

    expect(fluidGrid).toHaveCssClass('sky-fluid-grid-no-margin');
  });

  it('should log a deprecation warning when disableMargin is used', () => {
    const logService = TestBed.inject(SkyLogService);
    const spy = spyOn(logService, 'deprecated');

    fixture.componentRef.setInput('disableMargin', true);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('SkyFluidGridComponent.disableMargin', {
      deprecationMajorVersion: 15,
      replacementRecommendation:
        'Use the `inset` input instead. Note that the values are inverted: setting `disableMargin` to `true` is equivalent to setting `inset` to `false`.',
    });
  });

  it('should not log a deprecation warning when disableMargin is not set', () => {
    const logService = TestBed.inject(SkyLogService);
    const spy = spyOn(logService, 'deprecated');

    fixture.detectChanges();

    expect(spy).not.toHaveBeenCalled();
  });

  describe('nested', () => {
    const gutterSizes: SkyFluidGridGutterSizeType[] = [
      'small',
      'medium',
      'large',
    ];

    let nestedFixture: ComponentFixture<FluidGridNestedTestComponent>;

    function getInnerElements(): {
      grid: HTMLElement;
      column: HTMLElement;
      content: HTMLElement;
    } {
      const inner = nestedFixture.nativeElement.querySelector(
        '.inner-fluid-grid',
      ) as HTMLElement;

      return {
        grid: inner.querySelector('.sky-fluid-grid') as HTMLElement,
        column: inner.querySelector('sky-column') as HTMLElement,
        content: inner.querySelector('.inner-content') as HTMLElement,
      };
    }

    function getContentOffset(): number {
      const { grid, content } = getInnerElements();

      return (
        content.getBoundingClientRect().left - grid.getBoundingClientRect().left
      );
    }

    beforeEach(() => {
      nestedFixture = TestBed.createComponent(FluidGridNestedTestComponent);
    });

    for (const outerGutterSize of gutterSizes) {
      for (const innerGutterSize of gutterSizes) {
        describe(`with a ${innerGutterSize} grid inside a ${outerGutterSize} grid`, () => {
          beforeEach(() => {
            nestedFixture.componentRef.setInput(
              'outerGutterSize',
              outerGutterSize,
            );
            nestedFixture.componentRef.setInput(
              'innerGutterSize',
              innerGutterSize,
            );
          });

          it('should pad columns using the inner grid gutter', async () => {
            await nestedFixture.whenStable();

            const { grid, column } = getInnerElements();
            const columnStyle = getComputedStyle(column);
            const gridStyle = getComputedStyle(grid);

            expect(columnStyle.paddingLeft).toBe(gridStyle.paddingLeft);
            expect(columnStyle.paddingRight).toBe(gridStyle.paddingRight);
          });

          it('should align content with the inner grid edge when inset is false', () => {
            nestedFixture.componentRef.setInput('innerInset', false);
            nestedFixture.detectChanges();

            expect(getContentOffset()).toBe(0);
          });

          it('should inset content by the inner grid gutter when inset is true', () => {
            nestedFixture.componentRef.setInput('innerInset', true);
            nestedFixture.detectChanges();

            const { grid } = getInnerElements();

            expect(getContentOffset()).toBe(
              parseFloat(getComputedStyle(grid).paddingLeft),
            );
          });
        });
      }
    }
  });
});

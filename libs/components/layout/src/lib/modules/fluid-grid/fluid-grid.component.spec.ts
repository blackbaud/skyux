import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

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

  it('should not have the no-margins CSS class when disableMargin is false or undefined', () => {
    const fluidGrid = getFluidGrid(fixture);

    fixture.componentRef.setInput('disableMargin', undefined);
    fixture.detectChanges();

    expect(fluidGrid).not.toHaveCssClass('sky-fluid-grid-no-margin');

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
});

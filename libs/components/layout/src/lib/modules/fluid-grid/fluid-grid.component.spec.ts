import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyLogService } from '@skyux/core';

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

  it('should let inset take precedence over the deprecated disableMargin input when both are set', () => {
    const fluidGrid = getFluidGrid(fixture);

    // disableMargin says "show the margin", but inset says "hide it" -- inset wins.
    fixture.componentRef.setInput('disableMargin', false);
    fixture.componentRef.setInput('inset', false);
    fixture.detectChanges();

    expect(fluidGrid).toHaveCssClass('sky-fluid-grid-no-margin');
  });

  it('should let inset override disableMargin in the other direction as well', () => {
    const fluidGrid = getFluidGrid(fixture);

    // disableMargin says "hide the margin", but inset says "show it" -- inset wins.
    fixture.componentRef.setInput('disableMargin', true);
    fixture.componentRef.setInput('inset', true);
    fixture.detectChanges();

    expect(fluidGrid).not.toHaveCssClass('sky-fluid-grid-no-margin');
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
});

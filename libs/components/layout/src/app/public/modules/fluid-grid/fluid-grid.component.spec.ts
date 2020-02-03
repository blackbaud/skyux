import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  FluidGridTestComponent
} from './fixtures/fluid-grid.component.fixture';

import {
  FluidGridTestModule
} from './fixtures/fluid-grid.module.fixture';

import {
  SkyFluidGridGutterSize
} from './fluid-grid-gutter-size';

// #region helpers
function getFluidGrid(fixture: ComponentFixture<any>): HTMLElement {
  return fixture.nativeElement.querySelector('.sky-fluid-grid') as HTMLElement;
}
// #endregion

describe('SkyFluidGridComponent', () => {
  let component: FluidGridTestComponent;
  let fixture: ComponentFixture<FluidGridTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FluidGridTestModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FluidGridTestComponent);
    component = fixture.componentInstance;
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

    component.gutterSize = SkyFluidGridGutterSize.Medium;
    fixture.detectChanges();

    expect(fluidGrid).not.toHaveCssClass('sky-fluid-grid-gutter-size-small');
    expect(fluidGrid).toHaveCssClass('sky-fluid-grid-gutter-size-medium');
    expect(fluidGrid).not.toHaveCssClass('sky-fluid-grid-gutter-size-large');

    component.gutterSize = SkyFluidGridGutterSize.Large;
    fixture.detectChanges();

    expect(fluidGrid).not.toHaveCssClass('sky-fluid-grid-gutter-size-small');
    expect(fluidGrid).not.toHaveCssClass('sky-fluid-grid-gutter-size-medium');
    expect(fluidGrid).toHaveCssClass('sky-fluid-grid-gutter-size-large');
  });

  it('should not have the no-margins CSS class when disableMargin is false or undefined', () => {
    const fluidGrid = getFluidGrid(fixture);

    component.disableMargin = undefined;
    fixture.detectChanges();

    expect(fluidGrid).not.toHaveCssClass('sky-fluid-grid-no-margin');

    component.disableMargin = false;
    fixture.detectChanges();

    expect(fluidGrid).not.toHaveCssClass('sky-fluid-grid-no-margin');
  });

  it('should add the no-margins CSS class when disableMargin is true', () => {
    const fluidGrid = getFluidGrid(fixture);
    component.disableMargin = true;
    fixture.detectChanges();

    expect(fluidGrid).toHaveCssClass('sky-fluid-grid-no-margin');
  });
});

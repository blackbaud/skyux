import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyPageLayoutType } from './page-layout-type';
import { SkyPageComponent } from './page.component';
import { SkyPageModule } from './page.module';

describe('Page component', () => {
  const defaultBackgroundColor = 'rgb(0, 0, 0)';
  let styleEl: HTMLStyleElement;

  function validateBackgroundColor(expectedColor: string): void {
    expect(getComputedStyle(document.body).backgroundColor).toBe(expectedColor);
  }

  function validateLayout(
    fixture: ComponentFixture<SkyPageComponent>,
    layout: SkyPageLayoutType | undefined,
    expectedCssClass: string
  ): void {
    fixture.componentInstance.layout = layout;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('div')).toHaveCssClass(
      expectedCssClass
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyPageModule],
    });

    styleEl = document.createElement('style');

    styleEl.appendChild(
      document.createTextNode(
        `body { background-color: ${defaultBackgroundColor}; }`
      )
    );

    document.head.appendChild(styleEl);
  });

  afterEach(() => {
    document.head.removeChild(styleEl);
  });

  it("should set the page's background color to white", () => {
    const fixture = TestBed.createComponent(SkyPageComponent);
    fixture.detectChanges();

    validateBackgroundColor('rgb(255, 255, 255)');

    fixture.destroy();

    validateBackgroundColor(defaultBackgroundColor);
  });

  it('should add the expected CSS class for the layout input', () => {
    const fixture = TestBed.createComponent(SkyPageComponent);
    fixture.detectChanges();

    validateLayout(fixture, 'auto', 'sky-page-layout-auto');
    validateLayout(fixture, 'fit', 'sky-page-layout-fit');
    validateLayout(fixture, undefined, 'sky-page-layout-auto');

    fixture.destroy();
  });
});

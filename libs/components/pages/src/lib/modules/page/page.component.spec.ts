import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyLayoutHostService } from '@skyux/core';

import { SkyPageComponent } from './page.component';
import { SkyPageModule } from './page.module';
import { SkyPageLayoutType } from './types/page-layout-type';

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

    expect(fixture.nativeElement).toHaveCssClass(expectedCssClass);
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

    validateLayout(fixture, 'none', 'sky-layout-host-none');
    validateLayout(fixture, 'fit', 'sky-layout-host-fit');
    validateLayout(fixture, undefined, 'sky-layout-host-none');

    fixture.destroy();
  });

  it('should add the expected CSS class for the child layout', () => {
    const fixture = TestBed.createComponent(SkyPageComponent);
    fixture.detectChanges();

    const layoutHostSvc =
      fixture.debugElement.injector.get(SkyLayoutHostService);

    layoutHostSvc.setHostLayoutForChild({ layout: 'tabs' });

    fixture.detectChanges();

    expect(fixture.nativeElement).toHaveCssClass(
      'sky-layout-host-for-child-tabs'
    );

    fixture.destroy();
  });
});

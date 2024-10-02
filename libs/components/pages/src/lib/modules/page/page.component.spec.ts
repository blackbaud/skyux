import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyHelpService, SkyLayoutHostService } from '@skyux/core';
import { SkyHelpTestingModule } from '@skyux/core/testing';

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
    expectedCssClass: string,
  ): void {
    fixture.componentRef.setInput('layout', layout);
    fixture.detectChanges();

    expect(fixture.nativeElement).toHaveCssClass(expectedCssClass);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyPageModule, SkyHelpTestingModule],
    });

    styleEl = document.createElement('style');

    styleEl.appendChild(
      document.createTextNode(
        `body { background-color: ${defaultBackgroundColor}; }`,
      ),
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
      'sky-layout-host-for-child-tabs',
    );

    fixture.destroy();
  });

  it(`should notify the help service that a page's default help key has been set when the 'helpKey' input is set`, () => {
    const helpService = TestBed.inject(SkyHelpService);
    const updateHelpSpy = spyOn(helpService, 'updateHelp').and.stub();

    const fixture = TestBed.createComponent(SkyPageComponent);
    fixture.detectChanges();

    expect(updateHelpSpy).not.toHaveBeenCalled();

    fixture.componentInstance.helpKey = 'test-help';
    fixture.detectChanges();

    expect(updateHelpSpy).toHaveBeenCalledWith({
      pageDefaultHelpKey: 'test-help',
    });

    fixture.destroy();

    expect(updateHelpSpy).toHaveBeenCalledWith({
      pageDefaultHelpKey: undefined,
    });
    expect(updateHelpSpy).toHaveBeenCalledTimes(2);
  });
});

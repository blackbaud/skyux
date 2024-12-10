import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyContentInfoProvider } from '@skyux/core';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';

import { SkyBoxControlsComponent } from './box-controls.component';
import { SkyBoxHeadingLevel } from './box-heading-level';
import { SkyBoxHeadingStyle } from './box-heading-style';
import { BoxTestComponent } from './fixtures/box.component.fixture';
import { SkyBoxFixturesModule } from './fixtures/box.module.fixture';

function getBoxEl(fixture: ComponentFixture<any>): HTMLElement {
  return fixture.nativeElement.querySelector('.sky-box');
}

function getControlsDropdownButton(
  fixture: ComponentFixture<any>,
): HTMLElement {
  return fixture.nativeElement.querySelector(
    '#controls-dropdown .sky-dropdown-button',
  );
}

function getContentDropdownButton(fixture: ComponentFixture<any>): HTMLElement {
  return fixture.nativeElement.querySelector(
    '#content-dropdown .sky-dropdown-button',
  );
}

describe('BoxComponent', () => {
  let component: BoxTestComponent;
  let fixture: ComponentFixture<BoxTestComponent>;
  let contentInfoProvider: SkyContentInfoProvider;

  beforeEach(() => {
    contentInfoProvider = new SkyContentInfoProvider();

    TestBed.configureTestingModule({
      declarations: [BoxTestComponent],
      imports: [SkyBoxFixturesModule, SkyHelpTestingModule],
    });

    fixture = TestBed.overrideComponent(SkyBoxControlsComponent, {
      add: {
        providers: [
          {
            provide: SkyContentInfoProvider,
            useValue: contentInfoProvider,
          },
        ],
      },
    }).createComponent(BoxTestComponent);

    component = fixture.componentInstance;
  });

  it('should assign role attribute when ariaRole is set', () => {
    component.ariaRole = 'region';
    fixture.detectChanges();

    expect(getBoxEl(fixture).getAttribute('role')).toEqual('region');
  });

  it('should assign label attribute when ariaLabel is set', () => {
    component.headingText = undefined;
    component.ariaLabel = 'my box';
    fixture.detectChanges();

    expect(getBoxEl(fixture).getAttribute('aria-label')).toEqual('my box');
  });

  it('should assign labelledby attribute when ariaLabelledby is set', () => {
    component.headingText = undefined;
    component.ariaLabelledBy = 'my-header';
    fixture.detectChanges();

    expect(getBoxEl(fixture).getAttribute('aria-labelledby')).toEqual(
      'my-header',
    );
  });

  it('should set an id on the headingText element and provide it via contentInfoProvider', () => {
    const contentInfoSpy = spyOn(
      contentInfoProvider,
      'patchInfo',
    ).and.callThrough();
    fixture.detectChanges();
    let header = getBoxEl(fixture).querySelector('.sky-box-header-content h2');
    expect(header).not.toBeNull();

    if (header) {
      expect(contentInfoProvider.patchInfo).toHaveBeenCalledWith({
        descriptor: { type: 'elementId', value: header.id },
      });
      expect(
        getControlsDropdownButton(fixture).getAttribute('aria-label'),
      ).toBeNull();
      expect(getContentDropdownButton(fixture).getAttribute('aria-label')).toBe(
        'Context menu',
      );
      expect(
        getControlsDropdownButton(fixture).getAttribute('aria-labelledby'),
      ).toEqual(
        jasmine.stringMatching(
          /sky-id-gen__[0-9]+__[0-9]+ sky-id-gen__[0-9]+__[0-9]+/,
        ),
      );
      expect(
        getContentDropdownButton(fixture).getAttribute('aria-labelledby'),
      ).toBeNull();
    }

    contentInfoSpy.calls.reset();
    component.showHeader = false;
    component.headingText = undefined;
    fixture.detectChanges();
    header = getBoxEl(fixture).querySelector('.sky-box-header-content h2');
    expect(header).toBeNull();

    expect(contentInfoProvider.patchInfo).toHaveBeenCalledWith({
      descriptor: undefined,
    });
    expect(getContentDropdownButton(fixture).getAttribute('aria-label')).toBe(
      'Context menu',
    );
    expect(getControlsDropdownButton(fixture).getAttribute('aria-label')).toBe(
      'Context menu',
    );
    expect(
      getControlsDropdownButton(fixture).getAttribute('aria-labelledby'),
    ).toBeNull();
    expect(
      getControlsDropdownButton(fixture).getAttribute('aria-labelledby'),
    ).toBeNull();
  });

  it('should set an id on the header and provide it via contentInfoProvider', () => {
    component.headingText = undefined;
    const contentInfoSpy = spyOn(
      contentInfoProvider,
      'patchInfo',
    ).and.callThrough();
    fixture.detectChanges();
    let header = getBoxEl(fixture).querySelector('sky-box-header span');
    expect(header).not.toBeNull();

    if (header) {
      expect(contentInfoProvider.patchInfo).toHaveBeenCalledWith({
        descriptor: { type: 'elementId', value: header.id },
      });
      expect(
        getControlsDropdownButton(fixture).getAttribute('aria-label'),
      ).toBeNull();
      expect(getContentDropdownButton(fixture).getAttribute('aria-label')).toBe(
        'Context menu',
      );
      expect(
        getControlsDropdownButton(fixture).getAttribute('aria-labelledby'),
      ).toEqual(
        jasmine.stringMatching(
          /sky-id-gen__[0-9]+__[0-9]+ sky-id-gen__[0-9]+__[0-9]+/,
        ),
      );
      expect(
        getContentDropdownButton(fixture).getAttribute('aria-labelledby'),
      ).toBeNull();
    }

    contentInfoSpy.calls.reset();
    component.showHeader = false;
    fixture.detectChanges();
    header = getBoxEl(fixture).querySelector('sky-box-header span');
    expect(header).toBeNull();

    expect(contentInfoProvider.patchInfo).toHaveBeenCalledWith({
      descriptor: undefined,
    });
    expect(getContentDropdownButton(fixture).getAttribute('aria-label')).toBe(
      'Context menu',
    );
    expect(getControlsDropdownButton(fixture).getAttribute('aria-label')).toBe(
      'Context menu',
    );
    expect(
      getControlsDropdownButton(fixture).getAttribute('aria-labelledby'),
    ).toBeNull();
    expect(
      getControlsDropdownButton(fixture).getAttribute('aria-labelledby'),
    ).toBeNull();
  });

  it('should render the correct heading level and styles using the headingText input', () => {
    const headerCmp = getBoxEl(fixture).querySelector('sky-box-header span');
    expect(headerCmp).toBeNull();

    const headingLevels: (SkyBoxHeadingLevel | undefined)[] = [
      undefined,
      2,
      3,
      4,
      5,
    ];
    const headingStyles: (SkyBoxHeadingStyle | undefined)[] = [
      undefined,
      2,
      3,
      4,
      5,
    ];
    headingLevels.forEach((headingLevel) => {
      headingStyles.forEach((headingStyle) => {
        component.headingLevel = headingLevel;
        component.headingStyle = headingStyle;
        fixture.detectChanges();

        const heading = fixture.nativeElement.querySelector(
          `h${headingLevel ?? 2}.sky-font-heading-${headingStyle ?? 2}`,
        );

        expect(heading).toExist();
      });
    });
  });

  it('should render help inline popover', () => {
    component.helpPopoverContent = 'popover content';
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('sky-help-inline').length,
    ).toBe(1);
  });

  it('should not render help inline popover if title is provided without content', () => {
    component.helpPopoverTitle = 'popover title';
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('sky-help-inline').length,
    ).toBe(0);

    component.helpPopoverContent = 'popover content';
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('sky-help-inline').length,
    ).toBe(1);
  });

  it('should render help inline if help key is provided', () => {
    component.helpPopoverContent = undefined;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.sky-help-inline')).toBeFalsy();

    component.helpKey = 'helpKey.html';
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.sky-help-inline'),
    ).toBeTruthy();
  });

  it('should set global help config with help key', async () => {
    const helpController = TestBed.inject(SkyHelpTestingController);
    component.helpKey = 'helpKey.html';

    fixture.detectChanges();

    const helpInlineButton = fixture.nativeElement.querySelector(
      '.sky-help-inline',
    ) as HTMLElement | undefined;
    helpInlineButton?.click();

    await fixture.whenStable();
    fixture.detectChanges();

    helpController.expectCurrentHelpKey('helpKey.html');
  });
});

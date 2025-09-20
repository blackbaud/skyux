import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyCoreAdapterService } from '@skyux/core';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { SkyActionButtonAdapterService } from './action-button-adapter-service';
import { SkyActionButtonContainerComponent } from './action-button-container.component';
import { ActionButtonLinksComponent } from './fixtures/action-button-links.component';
import { ActionButtonNgforTestComponent } from './fixtures/action-button-ngfor.component.fixture';
import { ActionButtonTestComponent } from './fixtures/action-button.component.fixture';
import { SkyActionButtonFixturesModule } from './fixtures/action-button.module.fixture';

//#region helpers
function getFlexParent(fixture: ComponentFixture<any>): HTMLElement {
  return fixture.nativeElement.querySelector('.sky-action-button-flex');
}

function getActionButtons(
  fixture: ComponentFixture<any>,
): NodeListOf<HTMLElement> {
  return fixture.nativeElement.querySelectorAll(
    '.sky-action-button-container .sky-action-button:not([hidden])',
  );
}
//#endregion

describe('Action button component', () => {
  let fixture: ComponentFixture<ActionButtonTestComponent>;
  let cmp: ActionButtonTestComponent;
  let el: HTMLElement;
  let debugElement: DebugElement;
  let mediaQueryController: SkyMediaQueryTestingController;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  beforeEach(async () => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      imports: [SkyActionButtonFixturesModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
        provideSkyMediaQueryTesting(),
      ],
    });

    mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);

    fixture = TestBed.createComponent(ActionButtonTestComponent);

    cmp = fixture.componentInstance as ActionButtonTestComponent;
    el = fixture.nativeElement as HTMLElement;
    debugElement = fixture.debugElement;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should see if there is a permalink url included as an input to the element', fakeAsync(() => {
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const actionButton = el.querySelectorAll('.sky-action-button').item(1);
    expect(actionButton.tagName.toLowerCase() === 'a').toBeTrue();
    expect(actionButton.getAttribute('href')).toBe(
      'https://developer.blackbaud.com/skyux/components',
    );
  }));

  it('should see if there is a permalink route included as an input to the element', fakeAsync(() => {
    tick();
    fixture.detectChanges();
    const actionButton = el.querySelectorAll('.sky-action-button').item(2);
    expect(actionButton.tagName.toLowerCase() === 'a').toBeTrue();
    expect(actionButton.getAttribute('href')).toBe('/?page=1#fragment');
  }));

  it('should use a div element when permalink is not provided', () => {
    const actionButton = '.sky-action-button';
    expect(el.querySelectorAll(actionButton).item(0).tagName === 'div');
  });

  it('should transclude icon, header, and detail sections', () => {
    const iconContainer =
      '.sky-action-button-icon-header-container .sky-action-button-icon-container';
    const headerContainer =
      '.sky-action-button-icon-header-container .sky-action-button-header';
    const detailsContainer = '.sky-action-button sky-action-button-details';

    expect(el.querySelector(iconContainer)).not.toBeNull();

    expect(el.querySelector(headerContainer)).not.toBeNull();

    expect(el.querySelector(detailsContainer)).not.toBeNull();
  });

  it('should emit a click event on button click', () => {
    debugElement
      .query(By.css('.sky-action-button'))
      .triggerEventHandler('click', undefined);
    fixture.detectChanges();
    expect(cmp.buttonIsClicked).toBe(true);
  });

  it('should emit a click event on enter press', () => {
    debugElement
      .query(By.css('.sky-action-button'))
      .triggerEventHandler('keydown.escape', {});
    fixture.detectChanges();
    expect(cmp.buttonIsClicked).toBe(false);

    debugElement
      .query(By.css('.sky-action-button'))
      .triggerEventHandler('keydown.enter', {});
    fixture.detectChanges();
    expect(cmp.buttonIsClicked).toBe(true);
  });

  it('should have a role of button and tabindex on the clickable area', () => {
    expect(
      debugElement.query(By.css('.sky-action-button')).attributes['role'],
    ).toBe('button');
    expect(
      debugElement.query(By.css('.sky-action-button')).attributes['tabindex'],
    ).toBe('0');
  });

  it('should display an icon based on iconName', () => {
    const iconSelector =
      '.sky-action-button-icon-header-container .sky-action-button-icon-container svg[data-sky-icon="filter"]';
    expect(debugElement.query(By.css(iconSelector))).not.toBeNull();
  });

  it('should change iconSize for SVG icons based on media breakpoints query', () => {
    fixture.detectChanges();
    const smallIconSelector =
      '.sky-action-button-icon-header-container .sky-action-button-icon-container .sky-icon-svg-xl';
    const largeIconSelector =
      '.sky-action-button-icon-header-container .sky-action-button-icon-container .sky-icon-svg-xxxl';
    mediaQueryController.setBreakpoint('xs');
    fixture.detectChanges();
    expect(debugElement.query(By.css(smallIconSelector))).not.toBeNull();
    mediaQueryController.setBreakpoint('sm');
    fixture.detectChanges();
    expect(debugElement.query(By.css(largeIconSelector))).not.toBeNull();
  });

  it('should hide button with inaccessible skyHref link', async () => {
    fixture.detectChanges();

    await fixture.whenStable();

    expect(
      fixture.nativeElement
        .querySelector('[data-sky-id="bb-nav-link-visible"] a')
        .matches('[hidden]'),
    ).toBeFalse();

    expect(
      fixture.nativeElement
        .querySelector('[data-sky-id="bb-nav-link-hidden"] a')
        .matches('[hidden]'),
    ).toBeTrue();
  });

  it('should be accessible', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});

describe('Action button component modern theme', () => {
  let fixture: ComponentFixture<ActionButtonTestComponent>;
  let mockActionButtonAdapterService: any;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  beforeEach(async () => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
        ),
        previousSettings: undefined,
      }),
    };

    mockActionButtonAdapterService = jasmine.createSpyObj(
      'SkyActionButtonAdapterService',
      ['getParentWidth', 'setResponsiveClass'],
    );
    TestBed.configureTestingModule({
      imports: [SkyActionButtonFixturesModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
        provideSkyMediaQueryTesting(),
      ],
    });

    fixture = TestBed.overrideComponent(SkyActionButtonContainerComponent, {
      add: {
        providers: [
          {
            provide: SkyActionButtonAdapterService,
            useValue: mockActionButtonAdapterService,
          },
        ],
      },
    }).createComponent(ActionButtonTestComponent);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should have center justified class by default', () => {
    fixture.detectChanges();
    const flexParent = getFlexParent(fixture);
    expect(flexParent).toHaveCssClass('sky-action-button-flex-align-center');
    expect(flexParent).not.toHaveCssClass('sky-action-button-flex-align-left');
  });

  it(`should set class when alignItems property is 'left'`, () => {
    fixture.componentInstance.alignItems = 'left';
    fixture.detectChanges();
    const flexParent = getFlexParent(fixture);
    expect(flexParent).toHaveCssClass('sky-action-button-flex-align-left');
    expect(flexParent).not.toHaveCssClass(
      'sky-action-button-flex-align-center',
    );
  });

  it(`should set class when alignItems property is 'right'`, () => {
    fixture.componentInstance.alignItems = 'center';
    fixture.detectChanges();
    const flexParent = getFlexParent(fixture);
    expect(flexParent).toHaveCssClass('sky-action-button-flex-align-center');
    expect(flexParent).not.toHaveCssClass('sky-action-button-flex-align-left');
  });

  it(`should sync all child action buttons to have the same height as the tallest action button`, fakeAsync(() => {
    fixture.componentInstance.firstButtonHeight = '500px';
    fixture.componentInstance.actionButtonContainer?.onContentChange();
    fixture.detectChanges();
    tick();
    const buttons = getActionButtons(fixture);
    for (const button of Array.from(buttons)) {
      expect(button.style.height).toEqual('500px');
    }
  }));

  it(`should update CSS responsive classes on window resize`, () => {
    // called during constructor, ngOnInit -> themeSvc subscribe -> set themeName
    expect(
      mockActionButtonAdapterService.setResponsiveClass,
    ).toHaveBeenCalledTimes(2);

    SkyAppTestUtility.fireDomEvent(window, 'resize');

    // called during ngOnInit -> setTimeout & onWindowResize
    expect(
      mockActionButtonAdapterService.setResponsiveClass,
    ).toHaveBeenCalledTimes(3);
  });

  it(`should sync all child action buttons to have the same height when using SkyHref`, fakeAsync(() => {
    const linksFixture = TestBed.createComponent(ActionButtonLinksComponent);
    linksFixture.componentInstance.permalink = '1bb-nav://yep/';
    linksFixture.componentInstance.firstButtonHeight = '500px';
    tick(10);
    linksFixture.detectChanges();
    tick();
    const buttons = getActionButtons(linksFixture);
    expect(buttons.length).toBeGreaterThan(0);
    for (const button of Array.from(buttons)) {
      expect(button.style.height).toEqual('500px');
    }
  }));

  it(`should sync all child action buttons to have the same height when using SkyHref, delayed resolver`, fakeAsync(() => {
    const linksFixture = TestBed.createComponent(ActionButtonLinksComponent);
    linksFixture.componentInstance.permalink = 'delayed://yep/';
    linksFixture.componentInstance.firstButtonHeight = '500px';
    linksFixture.detectChanges();
    tick();
    let buttons = getActionButtons(linksFixture);
    // Expect buttons to be hidden before the resolver resolves.
    expect(buttons.length).toBe(0);
    tick(200);
    linksFixture.detectChanges();
    tick();
    buttons = getActionButtons(linksFixture);
    expect(buttons.length).toBeGreaterThan(0);
    for (const button of Array.from(buttons)) {
      expect(button.style.height).toEqual('500px');
    }
  }));

  it(`should sync all child action buttons to have the same height when using SkyHref, delayed resolver, no access`, fakeAsync(() => {
    const linksFixture = TestBed.createComponent(ActionButtonLinksComponent);
    linksFixture.componentInstance.permalink = 'delayed://nope/';
    linksFixture.componentInstance.firstButtonHeight = '500px';
    linksFixture.detectChanges();
    tick();
    let buttons = getActionButtons(linksFixture);
    expect(buttons.length).toBe(0);
    tick(600);
    linksFixture.detectChanges();
    tick();
    buttons = getActionButtons(linksFixture);
    expect(buttons.length).toBe(0);
  }));
});

describe('Action button container with dynamic action buttons', () => {
  let fixture: ComponentFixture<ActionButtonNgforTestComponent>;
  let cmp: ActionButtonNgforTestComponent;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      imports: [SkyActionButtonFixturesModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
        provideSkyMediaQueryTesting(),
      ],
    });

    fixture = TestBed.createComponent(ActionButtonNgforTestComponent);
    cmp = fixture.componentInstance as ActionButtonNgforTestComponent;

    fixture.detectChanges();
  });

  it('should reset height when action buttons dynamically change', fakeAsync(() => {
    const adapterService = TestBed.inject(SkyCoreAdapterService);
    const spy = spyOn(adapterService, 'resetHeight');

    // Remove an item from the dynamic list of action buttons.
    cmp.items = cmp.items.slice(0, cmp.items.length - 1);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  }));
});

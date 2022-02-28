import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import {
  SkyCoreAdapterService,
  SkyMediaBreakpoints,
  SkyMediaQueryService,
} from '@skyux/core';
import { MockSkyMediaQueryService } from '@skyux/core/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { SkyActionButtonComponent } from './action-button.component';
import { ActionButtonNgforTestComponent } from './fixtures/action-button-ngfor.component.fixture';
import { ActionButtonTestComponent } from './fixtures/action-button.component.fixture';
import { SkyActionButtonFixturesModule } from './fixtures/action-button.module.fixture';

//#region helpers
function getFlexParent(fixture: ComponentFixture<any>): HTMLElement {
  return fixture.nativeElement.querySelector('.sky-action-button-flex');
}

function getActionButtons(
  fixture: ComponentFixture<any>
): NodeListOf<HTMLElement> {
  return fixture.nativeElement.querySelectorAll(
    '.sky-action-button-container .sky-action-button'
  );
}
//#endregion

describe('Action button component', () => {
  let fixture: ComponentFixture<ActionButtonTestComponent>;
  let cmp: ActionButtonTestComponent;
  let el: HTMLElement;
  let debugElement: DebugElement;
  let mockMediaQueryService: MockSkyMediaQueryService;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light
        ),
        previousSettings: undefined,
      }),
    };

    mockMediaQueryService = new MockSkyMediaQueryService();
    TestBed.configureTestingModule({
      imports: [SkyActionButtonFixturesModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });

    fixture = TestBed.overrideComponent(SkyActionButtonComponent, {
      add: {
        providers: [
          {
            provide: SkyMediaQueryService,
            useValue: mockMediaQueryService,
          },
        ],
      },
    }).createComponent(ActionButtonTestComponent);

    fixture = TestBed.createComponent(ActionButtonTestComponent);
    cmp = fixture.componentInstance as ActionButtonTestComponent;
    el = fixture.nativeElement as HTMLElement;
    debugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should see if there is a permalink url included as an input to the element', fakeAsync(() => {
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let actionButton = el.querySelectorAll('.sky-action-button').item(1);
    expect(actionButton.tagName === 'a');
    expect(actionButton.getAttribute('href')).toBe(
      'https://developer.blackbaud.com/skyux/components'
    );
  }));

  it('should see if there is a permalink route included as an input to the element', () => {
    let actionButton = el.querySelectorAll('.sky-action-button').item(2);
    expect(actionButton.tagName === 'a');
    expect(actionButton.getAttribute('href')).toBe('/?page=1#fragment');
  });

  it('should use a div element when permalink is not provided', () => {
    let actionButton = '.sky-action-button';
    expect(el.querySelectorAll(actionButton).item(0).tagName === 'div');
  });

  it('should transclude icon, header, and detail sections', () => {
    let iconContainer =
      '.sky-action-button-icon-header-container .sky-action-button-icon-container';
    let headerContainer =
      '.sky-action-button-icon-header-container .sky-action-button-header';
    let detailsContainer = '.sky-action-button sky-action-button-details';

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
      debugElement.query(By.css('.sky-action-button')).attributes['role']
    ).toBe('button');
    expect(
      debugElement.query(By.css('.sky-action-button')).attributes['tabindex']
    ).toBe('0');
  });

  it('should display an icon based on iconType', () => {
    let iconSelector =
      '.sky-action-button-icon-header-container .sky-action-button-icon-container i.fa-filter';
    expect(debugElement.query(By.css(iconSelector))).not.toBeNull();
  });

  it('should change icon size based on media breakpoints query', () => {
    let smallIconSelector =
      '.sky-action-button-icon-header-container .sky-action-button-icon-container i.fa-2x';
    let largeIconSelector =
      '.sky-action-button-icon-header-container .sky-action-button-icon-container i.fa-3x';
    mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
    fixture.detectChanges();
    expect(debugElement.query(By.css(smallIconSelector))).not.toBeNull();
    mockMediaQueryService.fire(SkyMediaBreakpoints.sm);
    fixture.detectChanges();
    expect(debugElement.query(By.css(largeIconSelector))).not.toBeNull();
  });

  it('should be accessible', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});

describe('Action button component modern theme', () => {
  let fixture: ComponentFixture<ActionButtonTestComponent>;
  let mockMediaQueryService: MockSkyMediaQueryService;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light
        ),
        previousSettings: undefined,
      }),
    };

    mockMediaQueryService = new MockSkyMediaQueryService();
    TestBed.configureTestingModule({
      imports: [SkyActionButtonFixturesModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });

    fixture = TestBed.overrideComponent(SkyActionButtonComponent, {
      add: {
        providers: [
          {
            provide: SkyMediaQueryService,
            useValue: mockMediaQueryService,
          },
        ],
      },
    }).createComponent(ActionButtonTestComponent);

    fixture = TestBed.createComponent(ActionButtonTestComponent);
    fixture.detectChanges();
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
      'sky-action-button-flex-align-center'
    );
  });

  it(`should set class when alignItems property is 'right'`, () => {
    fixture.componentInstance.alignItems = 'center';
    fixture.detectChanges();
    const flexParent = getFlexParent(fixture);
    expect(flexParent).toHaveCssClass('sky-action-button-flex-align-center');
    expect(flexParent).not.toHaveCssClass('sky-action-button-flex-align-left');
  });

  it(`should sync all child action buttons to have the same height as the tallest action button`, async(() => {
    fixture.componentInstance.firstButtonHeight = '500px';
    fixture.detectChanges();
    // Wait for setTimeout() to fire.
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const buttons = getActionButtons(fixture);
      for (let i = 0; i < buttons.length; i++) {
        expect(buttons[i].style.height).toEqual('500px');
      }
    });
  }));

  it(`should update CSS responsive classes on window resize`, () => {
    const actionButtonContainer =
      fixture.componentInstance.actionButtonContainer;
    const spy = spyOn(actionButtonContainer as any, 'updateResponsiveClass');
    expect(spy).not.toHaveBeenCalled();

    SkyAppTestUtility.fireDomEvent(window, 'resize');
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('Action button container with dynamic action buttons', () => {
  let fixture: ComponentFixture<ActionButtonNgforTestComponent>;
  let cmp: ActionButtonNgforTestComponent;
  let mockMediaQueryService: MockSkyMediaQueryService;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light
        ),
        previousSettings: undefined,
      }),
    };

    mockMediaQueryService = new MockSkyMediaQueryService();
    TestBed.configureTestingModule({
      imports: [SkyActionButtonFixturesModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
        {
          provide: SkyMediaQueryService,
          useValue: mockMediaQueryService,
        },
      ],
    }).createComponent(ActionButtonTestComponent);

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

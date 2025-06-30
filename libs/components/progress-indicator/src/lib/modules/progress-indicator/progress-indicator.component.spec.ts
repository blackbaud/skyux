import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expect, expectAsync } from '@skyux-sdk/testing';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject, Subject } from 'rxjs';

import { SkyProgressIndicatorProgressHandlerFixtureComponent } from './fixtures/progress-indicator-progress-handler.component.fixture';
import { SkyProgressIndicatorFixtureComponent } from './fixtures/progress-indicator.component.fixture';
import { SkyProgressIndicatorFixtureModule } from './fixtures/progress-indicator.module.fixture';
import { SkyProgressIndicatorNavButtonComponent } from './progress-indicator-nav-button/progress-indicator-nav-button.component';
import { SkyProgressIndicatorComponent } from './progress-indicator.component';
import { SkyProgressIndicatorDisplayModeType } from './types/progress-indicator-display-mode-type';
import { SkyProgressIndicatorItemStatus } from './types/progress-indicator-item-status';
import { SkyProgressIndicatorMessageType } from './types/progress-indicator-message-type';
import { SkyProgressIndicatorDisplayMode } from './types/progress-indicator-mode';
import { SkyProgressIndicatorNavButtonType } from './types/progress-indicator-nav-button-type';

describe('Progress indicator component', () => {
  let fixture: ComponentFixture<SkyProgressIndicatorFixtureComponent>;
  let componentInstance: SkyProgressIndicatorFixtureComponent;
  let progressIndicator: SkyProgressIndicatorComponent;
  let consoleWarnSpy: jasmine.Spy;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  // #region helpers
  function detectChanges(): void {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  }

  function validatePassive(expected: boolean): void {
    const el = fixture.nativeElement;

    expect(!!el.querySelector('.sky-progress-indicator-passive')).toBe(
      expected,
    );
  }

  function stepBackward(): void {
    componentInstance.sendMessage({
      type: SkyProgressIndicatorMessageType.Regress,
    });
    detectChanges();
  }

  function stepForward(): void {
    componentInstance.sendMessage({
      type: SkyProgressIndicatorMessageType.Progress,
    });
    detectChanges();
  }

  function gotoStep(index?: number): void {
    componentInstance.sendMessage({
      type: SkyProgressIndicatorMessageType.GoTo,
      data: {
        activeIndex: index,
      },
    });
    detectChanges();
  }

  function verifyItemStatuses(
    statuses: SkyProgressIndicatorItemStatus[],
  ): void {
    expect(statuses.length).toBe(
      componentInstance.progressItems?.length as number,
    );
    componentInstance.progressItems?.forEach((item, i) => {
      expect(item.status).toEqual(statuses[i]);
    });
  }

  function verifyActiveIndex(index: number): void {
    expect(componentInstance.lastChange?.activeIndex).toEqual(index);
  }

  function getNavButtonElement(
    type: SkyProgressIndicatorNavButtonType,
  ): HTMLButtonElement {
    return fixture.nativeElement.querySelector(
      `.progress-indicator-fixture-external-nav-buttons .sky-progress-indicator-nav-button-${type}`,
    );
  }

  function getStepHeadingElements(): NodeList {
    return fixture.nativeElement.querySelectorAll(
      '.sky-progress-indicator-item-heading',
    );
  }

  // #endregion

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
      imports: [
        SkyProgressIndicatorFixtureModule,
        SkyHelpTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });

    fixture = TestBed.createComponent(SkyProgressIndicatorFixtureComponent);
    componentInstance = fixture.componentInstance;
    progressIndicator =
      componentInstance.progressIndicator as SkyProgressIndicatorComponent;

    consoleWarnSpy = spyOn(console, 'warn');
  });

  it('should set defaults', fakeAsync(() => {
    detectChanges();

    expect(progressIndicator.displayMode).toEqual('vertical');
    expect(progressIndicator.isPassive).toBeFalsy();
    expect(progressIndicator.startingIndex).toEqual(0);
  }));

  it('should show all steps in vertical display mode', fakeAsync(() => {
    componentInstance.showFourthItem = true;
    detectChanges();

    expect(progressIndicator.displayMode).toEqual('vertical');
    expect(getStepHeadingElements().length).toBe(4);
  }));

  it('should show only the active step in horizontal display mode', fakeAsync(() => {
    componentInstance.showFourthItem = true;
    componentInstance.displayMode = 'horizontal';
    detectChanges();

    expect(progressIndicator.displayMode).toEqual('horizontal');
    expect(getStepHeadingElements().length).toBe(1);
  }));

  it('should emit progress changes initially', fakeAsync(() => {
    const spy = spyOn(componentInstance, 'onProgressChanges').and.callThrough();

    detectChanges();

    expect(spy).toHaveBeenCalled();
  }));

  it('should use horizontal display if set', fakeAsync(() => {
    function validate(displayMode: SkyProgressIndicatorDisplayModeType): void {
      componentInstance.displayMode = displayMode;

      detectChanges();

      const element = fixture.nativeElement;

      expect(
        element.querySelector(
          '.sky-progress-indicator-horizontal-status-markers',
        ),
      ).toBeTruthy();
      expect(
        element.querySelector(
          '.sky-progress-indicator-item .sky-progress-indicator-status-marker',
        ),
      ).toBeFalsy();
    }

    validate(SkyProgressIndicatorDisplayMode.Horizontal);
    validate('horizontal');
  }));

  it('should use starting index if set', fakeAsync(() => {
    componentInstance.startingIndex = 2;

    detectChanges();

    // Verify that the desired index is set to Active,
    // and all previous steps are set to Complete.
    verifyActiveIndex(2);
    verifyItemStatuses([
      SkyProgressIndicatorItemStatus.Complete,
      SkyProgressIndicatorItemStatus.Complete,
      SkyProgressIndicatorItemStatus.Active,
    ]);
  }));

  it('should show step number in heading', fakeAsync(() => {
    function validate(displayMode: SkyProgressIndicatorDisplayModeType): void {
      componentInstance.displayMode = displayMode;

      detectChanges();

      const stepHeadingElements = getStepHeadingElements();
      const headingElement = stepHeadingElements.item(0);

      expect(headingElement?.textContent?.trim()).toEqual(
        '1 - Do the first thing',
      );
    }

    validate(SkyProgressIndicatorDisplayMode.Vertical);
    validate('vertical');
  }));

  it('should handle empty progress indicator', fakeAsync(() => {
    expect(componentInstance.emptyProgressIndicator?.itemStatuses).toEqual([]);
  }));

  it('should handle dynamic steps being added and removed', async () => {
    componentInstance.startingIndex = 2;

    fixture.detectChanges();
    await fixture.whenStable();
    // Verify that the desired index is set to Active,
    // and all previous steps are set to Complete.
    verifyActiveIndex(2);
    verifyItemStatuses([
      SkyProgressIndicatorItemStatus.Complete,
      SkyProgressIndicatorItemStatus.Complete,
      SkyProgressIndicatorItemStatus.Active,
    ]);

    componentInstance.displayFourthItem();

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // Verify that the desired index is set to Active,
    // and all previous steps are set to Complete.
    verifyActiveIndex(2);
    verifyItemStatuses([
      SkyProgressIndicatorItemStatus.Complete,
      SkyProgressIndicatorItemStatus.Complete,
      SkyProgressIndicatorItemStatus.Active,
      SkyProgressIndicatorItemStatus.Incomplete,
    ]);

    componentInstance.sendMessage({
      type: SkyProgressIndicatorMessageType.Progress,
    });

    fixture.detectChanges();
    await fixture.whenStable();
    // Verify that the desired index is set to Active,
    // and all previous steps are set to Complete.
    verifyActiveIndex(3);
    verifyItemStatuses([
      SkyProgressIndicatorItemStatus.Complete,
      SkyProgressIndicatorItemStatus.Complete,
      SkyProgressIndicatorItemStatus.Complete,
      SkyProgressIndicatorItemStatus.Active,
    ]);
  });

  it('should handle an index which is past the number of items', async () => {
    componentInstance.startingIndex = 3;
    componentInstance.displayFourthItem();

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // Verify that the desired index is set to Active,
    // and all previous steps are set to Complete.
    verifyActiveIndex(3);
    verifyItemStatuses([
      SkyProgressIndicatorItemStatus.Complete,
      SkyProgressIndicatorItemStatus.Complete,
      SkyProgressIndicatorItemStatus.Complete,
      SkyProgressIndicatorItemStatus.Active,
    ]);

    componentInstance.hideFourthItem();
    fixture.detectChanges();
    await fixture.whenStable();
    // Verify that the desired index is set to Active,
    // and all previous steps are set to Complete.
    verifyActiveIndex(2);
    verifyItemStatuses([
      SkyProgressIndicatorItemStatus.Complete,
      SkyProgressIndicatorItemStatus.Complete,
      SkyProgressIndicatorItemStatus.Active,
    ]);
  });

  it('should not render help inline for progress indicator item unless popover content is set', fakeAsync(() => {
    componentInstance.startingIndex = 3;
    detectChanges();

    componentInstance.helpPopoverTitle = 'popover title';
    detectChanges();
    expect(
      fixture.nativeElement.querySelectorAll('sky-help-inline').length,
    ).toBe(0);

    componentInstance.updateHelpContent('popover content');
    detectChanges();
    expect(
      fixture.nativeElement.querySelectorAll('sky-help-inline').length,
    ).toBe(1);
  }));

  it('should render help inline if help key is provided', () => {
    componentInstance.helpPopoverContent = undefined;
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('sky-help-inline').length,
    ).toBe(0);

    componentInstance.helpKey = 'helpKey.html';
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('sky-help-inline'),
    ).toBeTruthy();
  });

  it('should set global help config with help key', async () => {
    const helpController = TestBed.inject(SkyHelpTestingController);
    componentInstance.helpKey = 'helpKey.html';
    fixture.componentInstance.helpPopoverContent = 'popover content';
    fixture.detectChanges();

    const helpInlineButton = fixture.nativeElement.querySelector(
      '.sky-help-inline',
    ) as HTMLElement | undefined;
    helpInlineButton?.click();

    await fixture.whenStable();
    fixture.detectChanges();

    helpController.expectCurrentHelpKey('helpKey.html');
  });

  describe('Passive mode', () => {
    beforeEach(() => {
      componentInstance.isPassive = true;
    });

    it('should use passive mode if set', fakeAsync(() => {
      detectChanges();

      validatePassive(true);
    }));

    it('should set active step to Pending instead of Active', fakeAsync(() => {
      detectChanges();

      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Pending,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete,
      ]);
    }));

    it('should hide the step number in the heading', fakeAsync(() => {
      detectChanges();

      const stepHeadingElements = getStepHeadingElements();
      const headingElement = stepHeadingElements.item(0);

      expect(headingElement?.textContent?.trim()).toEqual('Do the first thing');
    }));

    it('should not use passive mode if set for horizontal display', fakeAsync(() => {
      componentInstance.displayMode = 'horizontal';

      detectChanges();

      validatePassive(false);
    }));
  });

  describe('Message stream', () => {
    it('should navigate through the steps', fakeAsync(() => {
      detectChanges();

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete,
      ]);

      stepForward();

      verifyActiveIndex(1);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
      ]);

      stepBackward();

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete,
      ]);
    }));

    it('should not progress past final step', fakeAsync(() => {
      detectChanges();

      stepForward();
      stepForward();
      stepForward();

      verifyActiveIndex(2);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active,
      ]);

      stepForward();

      verifyActiveIndex(2);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active,
      ]);
    }));

    it('should not regress before first step', fakeAsync(() => {
      detectChanges();

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete,
      ]);

      stepBackward();

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete,
      ]);
    }));

    it('should reset progress', fakeAsync(() => {
      componentInstance.startingIndex = 2;

      detectChanges();

      verifyActiveIndex(2);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active,
      ]);

      componentInstance.sendMessage({
        type: SkyProgressIndicatorMessageType.Reset,
      });

      detectChanges();

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete,
      ]);
    }));

    it('should goto a specific step', fakeAsync(() => {
      detectChanges();

      gotoStep(1);

      verifyActiveIndex(1);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
      ]);
    }));

    it('should handle out-of-range indexes', fakeAsync(() => {
      detectChanges();

      gotoStep(100);

      verifyActiveIndex(2);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active,
      ]);

      gotoStep(-20);

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete,
      ]);
    }));

    it('should warn when goto is called without an active index', fakeAsync(() => {
      detectChanges();

      gotoStep(undefined);

      expect(consoleWarnSpy).toHaveBeenCalled();
    }));

    it('should finish all steps', fakeAsync(() => {
      detectChanges();

      const spy = spyOn(
        componentInstance,
        'onProgressChanges',
      ).and.callThrough();

      componentInstance.sendMessage({
        type: SkyProgressIndicatorMessageType.Finish,
      });

      detectChanges();

      verifyActiveIndex(2);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Complete,
      ]);

      expect(spy).toHaveBeenCalledWith({
        activeIndex: 2,
        isComplete: true,
        itemStatuses: [
          SkyProgressIndicatorItemStatus.Complete,
          SkyProgressIndicatorItemStatus.Complete,
          SkyProgressIndicatorItemStatus.Complete,
        ],
      });
    }));

    it('should handle undefined message types', fakeAsync(() => {
      detectChanges();

      componentInstance.sendMessage({
        type: 1000 as any,
      });

      expect(detectChanges).not.toThrowError();
    }));

    it('should unsubscribe to previous message stream when unassigned', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      expect(componentInstance.messageStream?.observers.length).toBe(1);

      const previousStream = componentInstance.messageStream;
      componentInstance.messageStream = undefined;

      fixture.detectChanges();
      await fixture.whenStable();

      expect(previousStream?.observers.length).toBe(0);
    });

    it('should subscribe to a new message stream when reassigned', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      componentInstance.messageStream = new Subject();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(componentInstance.messageStream.observers.length).toBe(1);
    });
  });

  describe('Navigation buttons', () => {
    beforeEach(() => {
      componentInstance.showNavButtons = true;
      componentInstance.defaultNavButtonProgressIndicatorRef =
        componentInstance.progressIndicator;
    });

    it('should set defaults', fakeAsync(() => {
      detectChanges();

      const defaultButtonComponent =
        componentInstance.defaultNavButtonComponent;
      const defaultButtonElement =
        componentInstance.defaultNavButtonElement?.nativeElement;

      expect(defaultButtonComponent?.buttonType).toEqual('next');
      expect(defaultButtonElement.textContent).toContain('Next');

      let buttonElement = getNavButtonElement('previous');
      expect(buttonElement.textContent).toContain('Previous');

      buttonElement = getNavButtonElement('next');
      expect(buttonElement.textContent).toContain('Next');

      buttonElement = getNavButtonElement('reset');
      expect(buttonElement.textContent).toContain('Reset');

      // Show finish button.
      gotoStep(4);

      detectChanges();

      buttonElement = getNavButtonElement('finish');
      expect(buttonElement.textContent).toContain('Finish');
    }));

    it('should navigate between the steps', fakeAsync(() => {
      detectChanges();

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete,
      ]);

      const previousButtonElement = getNavButtonElement('previous');
      const nextButtonElement = getNavButtonElement('next');

      nextButtonElement.click();
      detectChanges();

      verifyActiveIndex(1);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
      ]);

      previousButtonElement.click();
      detectChanges();

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete,
      ]);

      gotoStep(4);
      detectChanges();

      verifyActiveIndex(2);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active,
      ]);

      const finishButtonElement = getNavButtonElement('finish');
      finishButtonElement.click();

      detectChanges();

      verifyActiveIndex(2);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Complete,
      ]);
    }));

    it('should reset the steps', fakeAsync(() => {
      detectChanges();

      gotoStep(1);
      detectChanges();

      verifyActiveIndex(1);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
      ]);

      const resetButton = fixture.nativeElement.querySelector(
        '.progress-indicator-fixture-internal-nav-button button',
      );

      resetButton.click();
      detectChanges();

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete,
      ]);
    }));

    it('should do nothing if buttonType unrecognized', fakeAsync(() => {
      detectChanges();

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete,
      ]);

      const defaultButtonComponent =
        componentInstance.defaultNavButtonComponent as SkyProgressIndicatorNavButtonComponent;
      const defaultButtonElement =
        componentInstance.defaultNavButtonElement?.nativeElement.querySelector(
          'button',
        );

      const clickSpy = spyOn(
        defaultButtonComponent,
        'onClick',
      ).and.callThrough();

      defaultButtonComponent.buttonType = 'foobar' as never;

      defaultButtonElement.click();
      detectChanges();

      expect(clickSpy).toHaveBeenCalled();
      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete,
      ]);
    }));

    it('should hide the next button and show the finish button on the last step', fakeAsync(() => {
      detectChanges();

      let nextButtonElement = getNavButtonElement('next');
      let finishButtonElement = getNavButtonElement('finish');

      expect(nextButtonElement).toBeTruthy();
      expect(finishButtonElement).toBeFalsy();

      gotoStep(2);
      detectChanges();

      nextButtonElement = getNavButtonElement('next');
      finishButtonElement = getNavButtonElement('finish');

      expect(nextButtonElement).toBeFalsy();
      expect(finishButtonElement).toBeTruthy();
    }));

    it('should not hide the next button if the finish button does not exist', fakeAsync(() => {
      // Create a custom button config that does not include a finish button.
      componentInstance.buttonConfigs = [
        {
          type: 'previous',
        },
        {
          type: 'next',
        },
      ];

      detectChanges();

      let nextButtonElement = getNavButtonElement('next');

      expect(nextButtonElement).toBeTruthy();

      gotoStep(2);
      detectChanges();

      nextButtonElement = getNavButtonElement('next');

      expect(nextButtonElement).toBeTruthy();
      expect(nextButtonElement.disabled).toBeTruthy();
    }));

    it('should default to next if button type is undefined', fakeAsync(() => {
      // Create a custom button config that does not include a finish button.
      componentInstance.buttonConfigs = [
        {
          type: undefined,
        },
      ];

      detectChanges();

      const nextButtonElement = getNavButtonElement('next');

      expect(nextButtonElement).toBeTruthy();
    }));

    it('should throw error if progress indicator not set as an input', fakeAsync(() => {
      componentInstance.defaultNavButtonProgressIndicatorRef = undefined;

      detectChanges();

      expect(() => {
        tick(100);
      })
        .toThrowError(`The \`<sky-progress-indicator-nav-button>\` component requires a reference to the \`<sky-progress-indicator>\` component it controls. For example:
<sky-progress-indicator
  #myProgressIndicator
>
</sky-progress-indicator>
<sky-progress-indicator-nav-button
  [progressIndicator]="myProgressIndicator"
>
</sky-progress-indicator-nav-button>`);
    }));
  });

  describe('Progress handler', () => {
    const finishButtonSelector =
      '[data-test-selector="finish-button"] .sky-btn';

    let handlerFixture: ComponentFixture<SkyProgressIndicatorProgressHandlerFixtureComponent>;

    beforeEach(() => {
      handlerFixture = TestBed.createComponent(
        SkyProgressIndicatorProgressHandlerFixtureComponent,
      );
    });

    it('should allow consumers to manually advance each step', fakeAsync(() => {
      const component = handlerFixture.componentInstance;

      handlerFixture.detectChanges();
      tick();
      handlerFixture.detectChanges();
      tick();

      expect(component.isLoading).toEqual(false);

      component.sendMessage({
        type: SkyProgressIndicatorMessageType.GoTo,
        data: {
          activeIndex: 3,
        },
      });

      handlerFixture.detectChanges();
      tick();

      let button =
        handlerFixture.nativeElement.querySelector(finishButtonSelector);
      button.click();

      expect(component.isLoading).toEqual(true);

      handlerFixture.detectChanges();
      tick();
      handlerFixture.detectChanges();
      tick();

      button = handlerFixture.nativeElement.querySelector(finishButtonSelector);

      expect(button).toBeFalsy();
      expect(component.isLoading).toEqual(false);
    }));
  });

  describe('Accessibility', () => {
    it('should be accessible', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible in horizontal mode', async () => {
      componentInstance.displayMode = 'horizontal';
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible in passive mode', async () => {
      componentInstance.isPassive = true;
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible with disabled buttons', async () => {
      componentInstance.disabled = true;
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });

  describe('Deprecated features', () => {
    it('should warn when message stream called with only the type', fakeAsync(() => {
      detectChanges();

      componentInstance.sendMessageLegacy(
        SkyProgressIndicatorMessageType.Progress,
      );

      detectChanges();

      expect(consoleWarnSpy).toHaveBeenCalled();

      verifyActiveIndex(1);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
      ]);
    }));

    it('should support legacy reset button located inside progress indicator component', fakeAsync(() => {
      detectChanges();

      const resetClickSpy = spyOn(componentInstance, 'onResetClick');

      componentInstance.legacyResetButton?.nativeElement
        .querySelector('button')
        .click();

      detectChanges();

      expect(resetClickSpy).toHaveBeenCalled();
    }));

    it('should support legacy reset button located outside progress indicator component', fakeAsync(() => {
      componentInstance.showIsolatedLegacyResetButton = true;

      detectChanges();

      const resetClickSpy = spyOn(componentInstance, 'onResetClick');

      detectChanges();

      componentInstance.legacyIsolatedResetButton?.nativeElement
        .querySelector('button')
        .click();

      detectChanges();

      expect(resetClickSpy).toHaveBeenCalled();
    }));
  });
});

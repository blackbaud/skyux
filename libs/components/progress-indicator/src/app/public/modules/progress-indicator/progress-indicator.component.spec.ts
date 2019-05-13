import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyProgressIndicatorFixtureComponent
} from './fixtures/progress-indicator.component.fixture';

import {
  SkyProgressIndicatorFixtureModule
} from './fixtures/progress-indicator.module.fixture';

import {
  SkyProgressIndicatorDisplayMode,
  SkyProgressIndicatorItemStatus,
  SkyProgressIndicatorMessageType,
  SkyProgressIndicatorNavButtonType
} from './types';

import {
  SkyProgressIndicatorComponent
} from './progress-indicator.component';

describe('Progress indicator component', function () {
  let fixture: ComponentFixture<SkyProgressIndicatorFixtureComponent>;
  let componentInstance: SkyProgressIndicatorFixtureComponent;
  let progressIndicator: SkyProgressIndicatorComponent;
  let consoleWarnSpy: jasmine.Spy;

  function detectChanges(): void {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  }

  function stepBackward(): void {
    componentInstance.sendMessage({
      type: SkyProgressIndicatorMessageType.Regress
    });
    detectChanges();
  }

  function stepForward(): void {
    componentInstance.sendMessage({
      type: SkyProgressIndicatorMessageType.Progress
    });
    detectChanges();
  }

  function gotoStep(index?: number): void {
    componentInstance.sendMessage({
      type: SkyProgressIndicatorMessageType.GoTo,
      data: {
        activeIndex: index
      }
    });
    detectChanges();
  }

  function verifyItemStatuses(statuses: SkyProgressIndicatorItemStatus[]): void {
    componentInstance.progressItems.forEach((item, i) => {
      expect(item.status).toEqual(statuses[i]);
    });
  }

  function verifyActiveIndex(index: number): void {
    expect(componentInstance.lastChange.activeIndex).toEqual(index);
  }

  function getNavButtonElement(type: SkyProgressIndicatorNavButtonType): any {
    return fixture.nativeElement.querySelector(
      `.progress-indicator-fixture-external-nav-buttons .sky-progress-indicator-nav-button-${type}`
    );
  }

  function getStepHeadingElements(): NodeList {
    return fixture.nativeElement.querySelectorAll('.sky-progress-indicator-item-heading');
  }

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        SkyProgressIndicatorFixtureModule
      ]
    });

    fixture = TestBed.createComponent(SkyProgressIndicatorFixtureComponent);
    componentInstance = fixture.componentInstance;
    progressIndicator = componentInstance.progressIndicator;

    consoleWarnSpy = spyOn(console, 'warn');
  });

  it('should set defaults', fakeAsync(function () {
    detectChanges();

    expect(progressIndicator.displayMode).toEqual(SkyProgressIndicatorDisplayMode.Vertical);
    expect(progressIndicator.isPassive).toEqual(false);
    expect(progressIndicator.startingIndex).toEqual(0);
  }));

  it('should emit progress changes initially', fakeAsync(function () {
    const spy = spyOn(componentInstance, 'onProgressChanges').and.callThrough();

    detectChanges();

    expect(spy).toHaveBeenCalled();
  }));

  it('should use horizontal display if set', fakeAsync(function () {
    componentInstance.displayMode = SkyProgressIndicatorDisplayMode.Horizontal;

    detectChanges();

    const element = fixture.nativeElement;

    expect(element.querySelector('.sky-progress-indicator-horizontal-status-markers')).toBeTruthy();
    expect(element.querySelector('.sky-progress-indicator-item .sky-progress-indicator-status-marker')).toBeFalsy();
  }));

  it('should use starting index if set', fakeAsync(function () {
    componentInstance.startingIndex = 2;

    detectChanges();

    // Verify that the desired index is set to Active,
    // and all previous steps are set to Complete.
    verifyActiveIndex(2);
    verifyItemStatuses([
      SkyProgressIndicatorItemStatus.Complete,
      SkyProgressIndicatorItemStatus.Complete,
      SkyProgressIndicatorItemStatus.Active
    ]);
  }));

  it('should show step number in heading', fakeAsync(function () {
    componentInstance.displayMode = SkyProgressIndicatorDisplayMode.Vertical;

    detectChanges();

    const stepHeadingElements = getStepHeadingElements();
    const headingElement = stepHeadingElements.item(0);

    expect(headingElement.textContent.trim()).toEqual('1 - Do the first thing');
  }));

  it('should handle empty progress indicator', fakeAsync(function () {
    expect(componentInstance.emptyProgressIndicator.itemStatuses).toEqual([]);
  }));

  describe('Passive mode', function () {
    beforeEach(function () {
      componentInstance.isPassive = true;
    });

    it('should use passive mode if set', fakeAsync(function () {
      detectChanges();

      expect(progressIndicator.isPassive).toEqual(true);
    }));

    it('should set active step to Pending instead of Active', fakeAsync(function () {
      detectChanges();

      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Pending,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete
      ]);
    }));

    it('should hide the step number in the heading', fakeAsync(function () {
      detectChanges();

      const stepHeadingElements = getStepHeadingElements();
      const headingElement = stepHeadingElements.item(0);

      expect(headingElement.textContent.trim()).toEqual('Do the first thing');
    }));

    it('should not use passive mode if set for horizontal display', fakeAsync(function () {
      componentInstance.displayMode = SkyProgressIndicatorDisplayMode.Horizontal;

      detectChanges();

      expect(progressIndicator.isPassive).toEqual(false);
    }));
  });

  describe('Message stream', function () {
    it('should navigate through the steps', fakeAsync(function () {
      detectChanges();

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete
      ]);

      stepForward();

      verifyActiveIndex(1);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete
      ]);

      stepBackward();

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete
      ]);
    }));

    it('should not progress past final step', fakeAsync(function () {
      detectChanges();

      stepForward();
      stepForward();
      stepForward();

      verifyActiveIndex(2);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active
      ]);

      stepForward();

      verifyActiveIndex(2);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active
      ]);
    }));

    it('should not regress before first step', fakeAsync(function () {
      detectChanges();

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete
      ]);

      stepBackward();

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete
      ]);
    }));

    it('should reset progress', fakeAsync(function () {
      componentInstance.startingIndex = 2;

      detectChanges();

      verifyActiveIndex(2);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active
      ]);

      componentInstance.sendMessage({
        type: SkyProgressIndicatorMessageType.Reset
      });

      detectChanges();

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete
      ]);
    }));

    it('should goto a specific step', fakeAsync(function () {
      detectChanges();

      gotoStep(1);

      verifyActiveIndex(1);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete
      ]);
    }));

    it('should handle out-of-range indexes', fakeAsync(function () {
      detectChanges();

      gotoStep(100);

      verifyActiveIndex(2);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active
      ]);

      gotoStep(-20);

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete
      ]);
    }));

    it('should warn when goto is called without an active index', fakeAsync(function () {
      detectChanges();

      gotoStep(undefined);

      expect(consoleWarnSpy).toHaveBeenCalled();
    }));

    it('should finish all steps', fakeAsync(function () {
      detectChanges();

      const spy = spyOn(componentInstance, 'onProgressChanges').and.callThrough();

      componentInstance.sendMessage({
        type: SkyProgressIndicatorMessageType.Finish
      });

      detectChanges();

      verifyActiveIndex(2);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Complete
      ]);

      expect(spy).toHaveBeenCalledWith({
        activeIndex: 2,
        isComplete: true,
        itemStatuses: [
          SkyProgressIndicatorItemStatus.Complete,
          SkyProgressIndicatorItemStatus.Complete,
          SkyProgressIndicatorItemStatus.Complete
        ]
      });
    }));

    it('should handle undefined message types', fakeAsync(function () {
      detectChanges();

      const spy = spyOn(progressIndicator as any, 'updateSteps').and.callThrough();

      componentInstance.sendMessage({
        type: 1000
      });

      detectChanges();

      expect(spy).not.toHaveBeenCalled();
    }));
  });

  describe('Navigation buttons', function () {
    beforeEach(function () {
      componentInstance.showNavButtons = true;
      componentInstance.defaultNavButtonProgressIndicatorRef = componentInstance.progressIndicator;
    });

    it('should set defaults', fakeAsync(() => {
      detectChanges();

      const defaultButtonComponent = componentInstance.defaultNavButtonComponent;
      const defaultButtonElement = componentInstance.defaultNavButtonElement.nativeElement;

      expect(defaultButtonComponent.buttonType).toEqual('next');
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

    it('should navigate between the steps', fakeAsync(function () {
      detectChanges();

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete
      ]);

      const previousButtonElement = getNavButtonElement('previous');
      const nextButtonElement = getNavButtonElement('next');

      nextButtonElement.click();
      detectChanges();

      verifyActiveIndex(1);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete
      ]);

      previousButtonElement.click();
      detectChanges();

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete
      ]);

      gotoStep(4);
      detectChanges();

      verifyActiveIndex(2);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active
      ]);

      const finishButtonElement = getNavButtonElement('finish');
      finishButtonElement.click();

      detectChanges();

      verifyActiveIndex(2);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Complete
      ]);
    }));

    it('should reset the steps', fakeAsync(function () {
      detectChanges();

      gotoStep(1);
      detectChanges();

      verifyActiveIndex(1);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete
      ]);

      const resetButton = fixture.nativeElement.querySelector(
        '.progress-indicator-fixture-internal-nav-button button'
      );

      resetButton.click();
      detectChanges();

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete
      ]);
    }));

    it('should do nothing if buttonType unrecognized', fakeAsync(function () {
      detectChanges();

      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete
      ]);

      const defaultButtonComponent = componentInstance.defaultNavButtonComponent;
      const defaultButtonElement = componentInstance.defaultNavButtonElement.nativeElement.querySelector('button');

      const clickSpy = spyOn(defaultButtonComponent, 'onClick').and.callThrough();

      defaultButtonComponent.buttonType = 'foobar' as any;

      defaultButtonElement.click();
      detectChanges();

      expect(clickSpy).toHaveBeenCalled();
      verifyActiveIndex(0);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete,
        SkyProgressIndicatorItemStatus.Incomplete
      ]);
    }));

    it('should hide the next button and show the finish button on the last step', fakeAsync(function () {
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

    it('should not hide the next button if the finish button does not exist', fakeAsync(function () {
      // Create a custom button config that does not include a finish button.
      componentInstance.buttonConfigs = [
        {
          type: 'previous'
        },
        {
          type: 'next'
        }
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

    it('should throw error if progress indicator not set as an input', fakeAsync(function () {
      componentInstance.defaultNavButtonProgressIndicatorRef = undefined;

      try {
        detectChanges();
        fail('It should throw error!');
      } catch (error) {
        expect(error).toExist();
      }
    }));
  });

  describe('Accessibility', function () {
    it('should be accessible', async(function () {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

    it('should be accessible in horizontal mode', async(function () {
      componentInstance.displayMode = SkyProgressIndicatorDisplayMode.Horizontal;

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

    it('should be accessible in passive mode', async(function () {
      componentInstance.isPassive = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

    it('should be accessible with disabled buttons', async(function () {
      componentInstance.disabled = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });

  describe('Deprecated features', function () {
    it('should warn when message stream called with only the type', fakeAsync(function () {
      detectChanges();

      componentInstance.sendMessageLegacy(SkyProgressIndicatorMessageType.Progress);

      detectChanges();

      expect(consoleWarnSpy).toHaveBeenCalled();

      verifyActiveIndex(1);
      verifyItemStatuses([
        SkyProgressIndicatorItemStatus.Complete,
        SkyProgressIndicatorItemStatus.Active,
        SkyProgressIndicatorItemStatus.Incomplete
      ]);
    }));

    it('should warn if using template reference variable with legacy reset button', fakeAsync(function () {
      detectChanges();

      componentInstance.progressIndicatorTemplateRefLegacy = componentInstance.progressIndicator;

      detectChanges();

      expect(consoleWarnSpy).toHaveBeenCalled();
    }));

    it('should support legacy reset button located inside progress indicator component', fakeAsync(function () {
      detectChanges();

      const resetClickSpy = spyOn(componentInstance, 'onResetClick');

      componentInstance.legacyResetButton.nativeElement.querySelector('button').click();

      detectChanges();

      expect(resetClickSpy).toHaveBeenCalled();
    }));

    it('should support legacy reset button located outside progress indicator component', fakeAsync(function () {
      componentInstance.showIsolatedLegacyResetButton = true;

      detectChanges();

      const resetClickSpy = spyOn(componentInstance, 'onResetClick');

      detectChanges();

      componentInstance.legacyIsolatedResetButton.nativeElement.querySelector('button').click();

      detectChanges();

      expect(resetClickSpy).toHaveBeenCalled();
    }));
  });
});

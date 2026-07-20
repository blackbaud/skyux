import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  inject,
  tick,
} from '@angular/core/testing';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import {
  SKY_STACKING_CONTEXT,
  SkyAffixAutoFitContext,
  SkyAffixPlacementChange,
  SkyAffixService,
  SkyCoreAdapterService,
  provideNoopSkyAnimations,
} from '@skyux/core';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject, Subject } from 'rxjs';

import { PopoverA11yTestComponent } from './fixtures/popover-a11y.component.fixture';
import { PopoverFixtureComponent } from './fixtures/popover.component.fixture';
import { PopoverFixturesModule } from './fixtures/popover.module.fixture';
import { SkyPopoverMessage } from './types/popover-message';
import { SkyPopoverMessageType } from './types/popover-message-type';

describe('Popover directive', () => {
  let fixture: ComponentFixture<PopoverFixtureComponent>;

  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  //#region helpers

  function getCallerElement(): HTMLButtonElement | undefined {
    return fixture.componentInstance.callerElementRef?.nativeElement;
  }

  function getPopoverElement(): HTMLElement | null {
    return document.querySelector('.sky-popover-container');
  }

  function isElementFocused(elem: Element | undefined | null): boolean {
    return !!elem && elem === document.activeElement;
  }

  function isElementVisible(elem: Element | undefined | null): boolean {
    return !!elem && getComputedStyle(elem).visibility !== 'hidden';
  }

  function detectChangesFakeAsync(): void {
    fixture.detectChanges();
    // 16ms is the fakeAsync time for requestAnimationFrame, simulating 60fps.
    tick(16);
    fixture.detectChanges();
    tick(16);
  }

  function getFocusableItems(): NodeListOf<Element> | undefined {
    return getPopoverElement()?.querySelectorAll('input, button');
  }

  //#endregion

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
      imports: [PopoverFixturesModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
        {
          provide: SKY_STACKING_CONTEXT,
          useValue: {
            zIndex: new BehaviorSubject(111),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(PopoverFixtureComponent);
  });

  afterEach(() => {
    (
      TestBed.inject(SKY_STACKING_CONTEXT).zIndex as BehaviorSubject<number>
    ).complete();
  });

  it('should set defaults', fakeAsync(() => {
    detectChangesFakeAsync();

    const directiveRef = fixture.componentInstance.directiveRef;
    expect(directiveRef?.skyPopoverAlignment).toBeUndefined();
    expect(directiveRef?.skyPopoverPlacement).toBeUndefined();
    expect(directiveRef?.skyPopoverTrigger).toEqual('click');

    const popoverRef = fixture.componentInstance.popoverRef;
    expect(popoverRef?.alignment).toEqual('center');
    expect(popoverRef?.placement).toEqual('above');
    expect(popoverRef?.popoverTitle).toBeUndefined();
  }));

  it('should use placement and alignment values of the popover component', fakeAsync(() => {
    // Ensure alignment/placement are undefined for directive.
    fixture.componentRef.setInput('alignment', undefined);
    fixture.componentRef.setInput('placement', undefined);

    // Set alignment/placement for component.
    fixture.componentInstance.popoverAlignment = 'left';
    fixture.componentInstance.popoverPlacement = 'left';
    detectChangesFakeAsync();

    // Launch popover.
    const button = getCallerElement();
    button?.click();
    detectChangesFakeAsync();

    // Confirm popover class properties.
    const popoverRef = fixture.componentInstance.popoverRef;
    expect(popoverRef?.alignment).toEqual('left');
    expect(popoverRef?.placement).toEqual('left');

    // Confirm popover CSS classes.
    const popover = getPopoverElement();
    expect(popover).toHaveCssClass('sky-popover-placement-left');
    expect(popover).toHaveCssClass('sky-popover-alignment-left');
  }));

  it('should place the popover on all four sides of the caller', fakeAsync(() => {
    fixture.componentRef.setInput('placement', 'above');
    detectChangesFakeAsync();

    const button = getCallerElement();

    button?.click();
    detectChangesFakeAsync();

    let popover = getPopoverElement();

    expect(popover).toHaveCssClass('sky-popover-placement-above');

    button?.click();
    detectChangesFakeAsync();

    fixture.componentRef.setInput('placement', 'right');
    detectChangesFakeAsync();

    button?.click();
    detectChangesFakeAsync();

    popover = getPopoverElement();

    expect(popover).toHaveCssClass('sky-popover-placement-right');

    button?.click();
    detectChangesFakeAsync();

    fixture.componentRef.setInput('placement', 'below');
    detectChangesFakeAsync();

    button?.click();
    detectChangesFakeAsync();

    popover = getPopoverElement();

    expect(popover).toHaveCssClass('sky-popover-placement-below');

    button?.click();
    detectChangesFakeAsync();

    fixture.componentRef.setInput('placement', 'left');
    detectChangesFakeAsync();

    button?.click();
    detectChangesFakeAsync();

    popover = getPopoverElement();

    expect(popover).toHaveCssClass('sky-popover-placement-left');
  }));

  it('should set horizontal alignments', fakeAsync(() => {
    fixture.componentRef.setInput('placement', 'above');
    fixture.componentRef.setInput('alignment', 'left');
    detectChangesFakeAsync();

    const button = getCallerElement();

    button?.click();
    detectChangesFakeAsync();

    let popover = getPopoverElement();

    expect(popover).toHaveCssClass('sky-popover-alignment-left');

    button?.click();
    detectChangesFakeAsync();

    fixture.componentRef.setInput('alignment', 'center');
    detectChangesFakeAsync();

    button?.click();
    detectChangesFakeAsync();

    popover = getPopoverElement();

    expect(popover).toHaveCssClass('sky-popover-alignment-center');

    button?.click();
    detectChangesFakeAsync();

    fixture.componentRef.setInput('alignment', 'right');
    detectChangesFakeAsync();

    button?.click();
    detectChangesFakeAsync();

    popover = getPopoverElement();

    expect(popover).toHaveCssClass('sky-popover-alignment-right');
  }));

  it('should show a title for the popover', fakeAsync(() => {
    fixture.componentInstance.popoverTitle = 'Did you know?';
    detectChangesFakeAsync();

    const button = getCallerElement();

    button?.click();
    detectChangesFakeAsync();

    const headingElement = getPopoverElement()?.querySelector(
      '.sky-popover-header',
    );

    expect(headingElement).toHaveText('Did you know?');
  }));

  it('should add scrollbars for tall popover', fakeAsync(() => {
    detectChangesFakeAsync();

    const button = getCallerElement();

    button?.click();
    detectChangesFakeAsync();

    fixture.componentInstance.sendMessage(SkyPopoverMessageType.Open);
    detectChangesFakeAsync();
    fixture.componentInstance.setHeight(4000);
    detectChangesFakeAsync();

    const popover = getPopoverElement()?.querySelector('.sky-popover');

    // Should now have a scrollbar.
    expect(popover && popover.scrollHeight > popover.clientHeight).toEqual(
      true,
    );
  }));

  it('should apply popup type', fakeAsync(() => {
    detectChangesFakeAsync();

    const button = getCallerElement();

    button?.click();
    detectChangesFakeAsync();

    let element = getPopoverElement();

    expect(element).toHaveCssClass('sky-popover-info');
    button?.click();

    fixture.componentRef.setInput('popoverType', 'danger');
    detectChangesFakeAsync();
    button?.click();
    detectChangesFakeAsync();
    element = getPopoverElement();
    expect(element).toHaveCssClass('sky-popover-danger');
    button?.click();

    fixture.componentRef.setInput('popoverType', 'info');
    detectChangesFakeAsync();
    button?.click();
    detectChangesFakeAsync();
    element = getPopoverElement();
    expect(element).toHaveCssClass('sky-popover-info');
  }));

  describe('mouse interactions', function () {
    it('should open and close the popover via mouse click', fakeAsync(() => {
      fixture.componentInstance.trigger = 'click';

      detectChangesFakeAsync();

      const button = getCallerElement();

      button?.click();
      // Simulate mouse movement as well.
      SkyAppTestUtility.fireDomEvent(button, 'mouseenter');

      detectChangesFakeAsync();

      let popover = getPopoverElement();
      expect(isElementVisible(popover)).toEqual(true);

      button?.click();
      // Simulate mouse movement as well.
      SkyAppTestUtility.fireDomEvent(button, 'mouseleave');

      detectChangesFakeAsync();

      popover = getPopoverElement();

      expect(popover).toBeNull();
    }));

    it('should open and close popover via mouse hover', fakeAsync(() => {
      fixture.componentInstance.trigger = 'mouseenter';

      detectChangesFakeAsync();

      const button = getCallerElement();

      SkyAppTestUtility.fireDomEvent(button, 'mouseenter');

      detectChangesFakeAsync();

      let popover = getPopoverElement();

      expect(isElementVisible(popover)).toEqual(true);

      // Simulate moving the mouse to the popover.
      SkyAppTestUtility.fireDomEvent(button, 'mouseleave');
      SkyAppTestUtility.fireDomEvent(popover, 'mouseenter');

      detectChangesFakeAsync();

      popover = getPopoverElement();

      // Confirm popover is still open.
      expect(isElementVisible(popover)).toEqual(true);

      // Simulate moving the mouse from the popover to the trigger button.
      SkyAppTestUtility.fireDomEvent(popover, 'mouseleave');
      tick();
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(button, 'mouseenter');
      tick();
      fixture.detectChanges();

      popover = getPopoverElement();

      // Confirm popover is still open.
      expect(isElementVisible(popover)).toEqual(true);

      // Simulate mouse leaving the trigger button.
      SkyAppTestUtility.fireDomEvent(button, 'mouseleave');

      detectChangesFakeAsync();

      popover = getPopoverElement();

      // Popover should now be closed.
      expect(popover).toBeNull();

      // Re-open the popover.
      SkyAppTestUtility.fireDomEvent(button, 'mouseenter');

      detectChangesFakeAsync();

      popover = getPopoverElement();

      expect(isElementVisible(popover)).toEqual(true);

      // Simulate moving the mouse to the popover.
      SkyAppTestUtility.fireDomEvent(button, 'mouseleave');
      SkyAppTestUtility.fireDomEvent(popover, 'mouseenter');

      detectChangesFakeAsync();

      popover = getPopoverElement();

      // Confirm popover is still open.
      expect(isElementVisible(popover)).toEqual(true);

      // Simulate mouse leaving the popover completely.
      SkyAppTestUtility.fireDomEvent(popover, 'mouseleave');

      detectChangesFakeAsync();

      popover = getPopoverElement();

      // Menu should now be closed.
      expect(popover).toBeNull();

      // Re-open the popover.
      SkyAppTestUtility.fireDomEvent(button, 'mouseenter');
      tick();
      // Simulate mouse leaving trigger button before entering the popover.
      SkyAppTestUtility.fireDomEvent(button, 'mouseleave');
      tick();

      detectChangesFakeAsync();
      detectChangesFakeAsync();

      popover = getPopoverElement();

      expect(popover).toBeNull();
    }));

    it('should open and close popover via focus when a hover trigger is used', fakeAsync(() => {
      fixture.componentInstance.trigger = 'mouseenter';

      detectChangesFakeAsync();

      const button = getCallerElement();

      button?.focus();
      SkyAppTestUtility.fireDomEvent(button, 'focusin');

      detectChangesFakeAsync();

      let popover = getPopoverElement();

      expect(isElementVisible(popover)).toEqual(true);

      // Simulate moving the mouse to the popover.
      SkyAppTestUtility.fireDomEvent(popover, 'mouseenter');

      detectChangesFakeAsync();

      popover = getPopoverElement();

      // Confirm popover is still open.
      expect(isElementVisible(popover)).toEqual(true);

      // Simulate moving the mouse from the popover to the trigger button.
      SkyAppTestUtility.fireDomEvent(popover, 'mouseleave');
      tick();
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(button, 'mouseenter');
      tick();
      fixture.detectChanges();

      popover = getPopoverElement();

      // Confirm popover is still open.
      expect(isElementVisible(popover)).toEqual(true);

      // Simulate mouse leaving the trigger button.
      SkyAppTestUtility.fireDomEvent(button, 'mouseleave');

      detectChangesFakeAsync();

      popover = getPopoverElement();

      // Confirm popover is still open.
      expect(isElementVisible(popover)).toEqual(true);

      SkyAppTestUtility.fireDomEvent(button, 'focusout');

      detectChangesFakeAsync();

      popover = getPopoverElement();

      // Menu should now be closed.
      expect(popover).toBeNull();
    }));

    it('should close popover when clicking outside', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getCallerElement();
      button?.click();
      detectChangesFakeAsync();

      let popover = getPopoverElement();

      expect(isElementVisible(popover)).toEqual(true);

      SkyAppTestUtility.fireDomEvent(window.document.body, 'click');
      detectChangesFakeAsync();

      popover = getPopoverElement();

      expect(popover).toBeNull();
    }));

    it('should handle undefined popover', fakeAsync(() => {
      detectChangesFakeAsync();

      fixture.componentInstance.skyPopover.set(undefined);

      detectChangesFakeAsync();
      detectChangesFakeAsync();

      const button = getCallerElement();

      button?.click();
      SkyAppTestUtility.fireDomEvent(button, 'mouseenter');
      SkyAppTestUtility.fireDomEvent(button, 'mouseleave');

      detectChangesFakeAsync();

      const popover = getPopoverElement();

      expect(popover).toBeNull();
    }));
  });

  describe('keyboard interactions', function () {
    it('should close popover with escape key while trigger button is focused', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getCallerElement();
      button?.click();
      detectChangesFakeAsync();

      let popover = getPopoverElement();

      expect(isElementVisible(popover)).toEqual(true);

      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'escape',
        },
      });

      detectChangesFakeAsync();

      popover = getPopoverElement();

      expect(popover).toBeNull();

      const messageSpy = spyOn(
        fixture.componentInstance.messageStream() as Subject<SkyPopoverMessage>,
        'next',
      ).and.callThrough();

      // Escape key detection shouldn't work while the popover is closed.
      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'escape',
        },
      });

      detectChangesFakeAsync();

      expect(messageSpy).not.toHaveBeenCalled();
    }));

    it('should close popover with escape key while popover is focused', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getCallerElement();
      button?.click();
      detectChangesFakeAsync();

      let popover = getPopoverElement();

      expect(isElementVisible(popover)).toEqual(true);

      SkyAppTestUtility.fireDomEvent(popover, 'keydown', {
        keyboardEventInit: {
          key: 'escape',
        },
      });

      detectChangesFakeAsync();

      popover = getPopoverElement();

      expect(popover).toBeNull();
      expect(isElementFocused(button)).toEqual(true);
    }));

    it('should close the popover with interactable elements after popover loses focus', fakeAsync(() => {
      fixture.componentInstance.showFocusableChildren = true;
      detectChangesFakeAsync();

      const button = getCallerElement();

      // Open and bring focus to the popover.
      button?.click();
      detectChangesFakeAsync();

      let popover = getPopoverElement();
      const focusableItems = getFocusableItems();

      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'tab',
        },
      });
      // Also confirm focusin event fires correctly.
      SkyAppTestUtility.fireDomEvent(focusableItems?.item(0), 'focusin');

      detectChangesFakeAsync();

      // Confirm the first focusable item has focus.
      expect(isElementFocused(focusableItems?.item(0))).toEqual(true);

      // Press 'shift+tab' to close the popover
      SkyAppTestUtility.fireDomEvent(focusableItems?.item(0), 'keydown', {
        keyboardEventInit: {
          key: 'tab',
          shiftKey: true,
        },
      });

      detectChangesFakeAsync();

      popover = getPopoverElement();

      // The popover should be closed and trigger button focused.
      expect(popover).toBeNull();
      expect(isElementFocused(button)).toEqual(true);

      // Re-open and bring focus to the popover.
      button?.click();
      detectChangesFakeAsync();

      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'tab',
        },
      });

      detectChangesFakeAsync();

      // Focus the last item and press 'tab' to close the popover.
      (focusableItems?.item(1) as HTMLElement | undefined)?.focus();
      detectChangesFakeAsync();

      SkyAppTestUtility.fireDomEvent(focusableItems?.item(1), 'keydown', {
        keyboardEventInit: {
          key: 'tab',
        },
      });

      detectChangesFakeAsync();

      popover = getPopoverElement();

      // The popover should be closed and trigger button focused.
      expect(popover).toBeNull();
      expect(isElementFocused(button)).toEqual(true);
    }));

    it('should close the popover after trigger loses focus', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getCallerElement();
      button?.click();
      detectChangesFakeAsync();

      let popover = getPopoverElement();

      expect(isElementVisible(popover)).toEqual(true);

      SkyAppTestUtility.fireDomEvent(button, 'keydown', {
        keyboardEventInit: {
          key: 'TAB',
        },
      });
      detectChangesFakeAsync();

      popover = getPopoverElement();

      expect(popover).toBeNull();
    }));

    it('should open the popover with alt+arrowup when the trigger is the sole popover trigger within the focused element', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getCallerElement();
      button?.focus();

      SkyAppTestUtility.fireDomEvent(document, 'keydown', {
        keyboardEventInit: {
          key: 'ArrowUp',
          altKey: true,
        },
      });

      detectChangesFakeAsync();

      const popover = getPopoverElement();

      expect(isElementVisible(popover)).toEqual(true);
    }));

    it('should not open a popover with alt+arrowup when multiple popover triggers are within the focused element', fakeAsync(() => {
      detectChangesFakeAsync();

      const canvas: HTMLElement =
        fixture.nativeElement.querySelector('.canvas');
      canvas.tabIndex = -1;
      canvas.focus();

      SkyAppTestUtility.fireDomEvent(document, 'keydown', {
        keyboardEventInit: {
          key: 'ArrowUp',
          altKey: true,
        },
      });

      detectChangesFakeAsync();

      expect(getPopoverElement()).toBeNull();
    }));

    it('should not open a popover with alt+arrowup when the directive has no popover attached', fakeAsync(() => {
      detectChangesFakeAsync();

      fixture.componentInstance.skyPopover.set(undefined);
      detectChangesFakeAsync();

      const button = getCallerElement();
      button?.focus();

      SkyAppTestUtility.fireDomEvent(document, 'keydown', {
        keyboardEventInit: {
          key: 'ArrowUp',
          altKey: true,
        },
      });

      detectChangesFakeAsync();

      expect(getPopoverElement()).toBeNull();
    }));

    describe('alt+arrowup focus management', function () {
      function openViaAltArrowUp(): void {
        const button = getCallerElement();
        button?.focus();

        SkyAppTestUtility.fireDomEvent(document, 'keydown', {
          keyboardEventInit: {
            key: 'ArrowUp',
            altKey: true,
          },
        });

        detectChangesFakeAsync();
      }

      function fireAltArrowDown(): void {
        SkyAppTestUtility.fireDomEvent(document, 'keydown', {
          keyboardEventInit: {
            key: 'ArrowDown',
            altKey: true,
          },
        });

        detectChangesFakeAsync();
      }

      it('should move focus into the popover when it has focusable content', fakeAsync(() => {
        fixture.componentInstance.showFocusableChildren = true;
        detectChangesFakeAsync();

        openViaAltArrowUp();

        const focusableItems = getFocusableItems();

        expect(isElementFocused(focusableItems?.item(0))).toEqual(true);
      }));

      it('should leave focus on the trigger when the popover has no focusable content', fakeAsync(() => {
        detectChangesFakeAsync();

        const button = getCallerElement();
        openViaAltArrowUp();

        expect(isElementFocused(button)).toEqual(true);
      }));

      it('should close the popover when focus moves to an element outside the trigger and the popover', fakeAsync(() => {
        detectChangesFakeAsync();

        openViaAltArrowUp();

        expect(isElementVisible(getPopoverElement())).toEqual(true);

        const unrelated = document.createElement('button');
        document.body.appendChild(unrelated);

        unrelated.focus();
        detectChangesFakeAsync();

        expect(getPopoverElement()).toBeNull();

        unrelated.remove();
      }));

      it('should not close the popover when focus moves between focusable children within the popover', fakeAsync(() => {
        fixture.componentInstance.showFocusableChildren = true;
        detectChangesFakeAsync();

        openViaAltArrowUp();

        const focusableItems = getFocusableItems();
        (focusableItems?.item(1) as HTMLElement | undefined)?.focus();
        detectChangesFakeAsync();

        expect(isElementVisible(getPopoverElement())).toEqual(true);
      }));

      it('should not error when focus moves elsewhere after the popover already closed via escape', fakeAsync(() => {
        detectChangesFakeAsync();

        const button = getCallerElement();
        openViaAltArrowUp();

        SkyAppTestUtility.fireDomEvent(button, 'keydown', {
          keyboardEventInit: {
            key: 'escape',
          },
        });
        detectChangesFakeAsync();

        expect(getPopoverElement()).toBeNull();

        const unrelated = document.createElement('button');
        document.body.appendChild(unrelated);

        expect(() => {
          unrelated.focus();
          detectChangesFakeAsync();
        }).not.toThrow();

        unrelated.remove();
      }));

      it('should close the popover with alt+arrowdown after opening via alt+arrowup', fakeAsync(() => {
        detectChangesFakeAsync();

        openViaAltArrowUp();

        expect(isElementVisible(getPopoverElement())).toEqual(true);

        fireAltArrowDown();

        expect(getPopoverElement()).toBeNull();
      }));

      it('should refocus the trigger when closed via alt+arrowdown', fakeAsync(() => {
        fixture.componentInstance.showFocusableChildren = true;
        detectChangesFakeAsync();

        const button = getCallerElement();
        openViaAltArrowUp();

        fireAltArrowDown();

        expect(isElementFocused(button)).toEqual(true);
      }));

      it('should not close a popover opened by click when alt+arrowdown is pressed', fakeAsync(() => {
        detectChangesFakeAsync();

        const button = getCallerElement();
        button?.click();
        detectChangesFakeAsync();

        expect(isElementVisible(getPopoverElement())).toEqual(true);

        fireAltArrowDown();

        expect(isElementVisible(getPopoverElement())).toEqual(true);
      }));

      it('should not close a popover reopened by click after alt+arrowup was pressed while it was open', fakeAsync(() => {
        detectChangesFakeAsync();

        const button = getCallerElement();
        button?.click();
        detectChangesFakeAsync();

        button?.focus();
        SkyAppTestUtility.fireDomEvent(document, 'keydown', {
          keyboardEventInit: {
            key: 'ArrowUp',
            altKey: true,
          },
        });
        detectChangesFakeAsync();

        button?.click();
        detectChangesFakeAsync();

        button?.click();
        detectChangesFakeAsync();

        fireAltArrowDown();

        expect(isElementVisible(getPopoverElement())).toEqual(true);
      }));

      it('should not error if the popover is unset before popoverOpened fires', fakeAsync(() => {
        detectChangesFakeAsync();

        const button = getCallerElement();
        button?.focus();

        SkyAppTestUtility.fireDomEvent(document, 'keydown', {
          keyboardEventInit: {
            key: 'ArrowUp',
            altKey: true,
          },
        });

        fixture.componentInstance.skyPopover.set(undefined);

        expect(() => detectChangesFakeAsync()).not.toThrow();
      }));

      it('should close the popover if focus moves within it while its popoverId is falsy', fakeAsync(() => {
        fixture.componentInstance.showFocusableChildren = true;
        detectChangesFakeAsync();

        openViaAltArrowUp();

        const popoverRef = fixture.componentInstance.popoverRef;
        if (popoverRef) {
          popoverRef.popoverId = '';
        }

        const focusableItems = getFocusableItems();
        (focusableItems?.item(1) as HTMLElement | undefined)?.focus();
        detectChangesFakeAsync();

        expect(getPopoverElement()).toBeNull();
      }));
    });
  });

  describe('message stream', function () {
    it('should setup a message stream if none provided', fakeAsync(() => {
      detectChangesFakeAsync();

      expect(
        fixture.componentInstance.noArgsDirectiveRef?.skyPopoverMessageStream,
      ).toBeDefined();
    }));

    it('should setup a message stream if set to `undefined`', fakeAsync(() => {
      detectChangesFakeAsync();

      expect(fixture.componentInstance.messageStream()).toEqual(
        fixture.componentInstance.directiveRef?.skyPopoverMessageStream,
      );

      fixture.componentRef.setInput('messageStream', undefined);

      detectChangesFakeAsync();

      expect(
        fixture.componentInstance.directiveRef?.skyPopoverMessageStream,
      ).toBeDefined();
    }));

    it('should open and close the popover', fakeAsync(() => {
      detectChangesFakeAsync();

      fixture.componentInstance.sendMessage(SkyPopoverMessageType.Open);
      detectChangesFakeAsync();

      let popover = getPopoverElement();

      expect(isElementVisible(popover)).toEqual(true);

      fixture.componentInstance.sendMessage(SkyPopoverMessageType.Close);
      detectChangesFakeAsync();

      popover = getPopoverElement();

      expect(popover).toBeNull();
    }));

    it('should not reopen the popover if close is called before the open timer fires', fakeAsync(() => {
      detectChangesFakeAsync();

      // Open, let it fully render, then close it.
      fixture.componentInstance.sendMessage(SkyPopoverMessageType.Open);
      detectChangesFakeAsync();

      expect(isElementVisible(getPopoverElement())).toEqual(true);

      fixture.componentInstance.sendMessage(SkyPopoverMessageType.Close);
      detectChangesFakeAsync();

      expect(getPopoverElement()).toBeNull();

      // Open again, but close immediately before the pending setTimeout
      // in contentRef.open() can fire.
      fixture.componentInstance.sendMessage(SkyPopoverMessageType.Open);
      fixture.componentInstance.sendMessage(SkyPopoverMessageType.Close);

      detectChangesFakeAsync();

      // The popover should not have re-opened.
      expect(isElementVisible(getPopoverElement())).not.toEqual(true);
    }));

    it('should focus the popover', fakeAsync(() => {
      detectChangesFakeAsync();

      fixture.componentInstance.sendMessage(SkyPopoverMessageType.Open);
      detectChangesFakeAsync();

      const popover = getPopoverElement()?.querySelector('.sky-popover');

      expect(isElementFocused(popover)).toEqual(false);

      fixture.componentInstance.sendMessage(SkyPopoverMessageType.Focus);
      detectChangesFakeAsync();

      expect(isElementFocused(popover)).toEqual(true);

      const applyFocusSpy = spyOn(
        TestBed.inject(SkyCoreAdapterService),
        'getFocusableChildrenAndApplyFocus',
      ).and.callThrough();

      // The focus message shouldn't register when the popover is closed.
      fixture.componentInstance.sendMessage(SkyPopoverMessageType.Close);
      detectChangesFakeAsync();
      fixture.componentInstance.sendMessage(SkyPopoverMessageType.Focus);
      detectChangesFakeAsync();
      expect(applyFocusSpy).not.toHaveBeenCalled();
    }));

    it('should allow repositioning the popover', fakeAsync(
      inject([SkyAffixService], (affixService: SkyAffixService) => {
        const mockAffixer: any = {
          placementChange: new Subject(),
          affixTo() {},
          destroy() {},
          reaffix() {},
        };

        spyOn(affixService, 'createAffixer').and.returnValue(mockAffixer);

        fixture.componentRef.setInput('placement', 'below');
        detectChangesFakeAsync();

        let popover = getPopoverElement();
        const affixSpy = spyOn(mockAffixer, 'affixTo').and.callThrough();

        fixture.componentInstance.sendMessage(SkyPopoverMessageType.Reposition);
        detectChangesFakeAsync();

        // Repositioning should only happen if popover is open.
        expect(affixSpy).not.toHaveBeenCalled();

        // Open the popover.
        fixture.componentInstance.sendMessage(SkyPopoverMessageType.Open);
        detectChangesFakeAsync();

        // Trigger a temporary placement change.
        mockAffixer.placementChange.next({
          placement: 'above',
        });

        detectChangesFakeAsync();

        popover = getPopoverElement();

        // Confirm that the new temporary placement was recognized.
        expect(popover).toHaveCssClass('sky-popover-placement-above');

        affixSpy.calls.reset();

        // Make a call to reposition the popover.
        fixture.componentInstance.sendMessage(SkyPopoverMessageType.Reposition);
        detectChangesFakeAsync();

        // The original, preferred placement should be re-applied.
        expect(
          (affixSpy.calls.argsFor(0)[1] as SkyAffixPlacementChange).placement,
        ).toEqual('below');
        expect(popover).toHaveCssClass('sky-popover-placement-below');
      }),
    ));
  });

  describe('affixer events', function () {
    let mockAffixer: any;
    let affixService: SkyAffixService;

    beforeEach(inject([SkyAffixService], (_affixService: SkyAffixService) => {
      affixService = _affixService;
      mockAffixer = {
        placementChange: new Subject(),
        affixTo() {},
        destroy() {},
      };

      spyOn(affixService, 'createAffixer').and.returnValue(mockAffixer);
    }));

    it('should create the affixer with proper arguments', fakeAsync(() => {
      const affixToSpy = spyOn(mockAffixer, 'affixTo').and.callThrough();
      detectChangesFakeAsync();

      const button = getCallerElement();
      button?.click();
      detectChangesFakeAsync();

      expect(affixToSpy).toHaveBeenCalledWith(button, {
        autoFitContext: SkyAffixAutoFitContext.Viewport,
        enableAutoFit: true,
        horizontalAlignment: 'center',
        isSticky: true,
        placement: 'above',
      });

      fixture.componentInstance.sendMessage(SkyPopoverMessageType.Close);
      detectChangesFakeAsync();

      affixToSpy.calls.reset();
      fixture.componentRef.setInput('placement', 'below');
      detectChangesFakeAsync();

      button?.click();
      detectChangesFakeAsync();

      expect(affixToSpy).toHaveBeenCalledWith(button, {
        autoFitContext: SkyAffixAutoFitContext.Viewport,
        enableAutoFit: true,
        horizontalAlignment: 'center',
        isSticky: true,
        placement: 'below',
      });

      fixture.componentInstance.sendMessage(SkyPopoverMessageType.Close);
      detectChangesFakeAsync();

      affixToSpy.calls.reset();
      fixture.componentRef.setInput('placement', 'left');
      detectChangesFakeAsync();

      button?.click();
      detectChangesFakeAsync();

      expect(affixToSpy).toHaveBeenCalledWith(button, {
        autoFitContext: SkyAffixAutoFitContext.Viewport,
        enableAutoFit: true,
        horizontalAlignment: 'center',
        isSticky: true,
        placement: 'left',
        verticalAlignment: 'middle',
      });

      fixture.componentInstance.sendMessage(SkyPopoverMessageType.Close);
      detectChangesFakeAsync();

      affixToSpy.calls.reset();
      fixture.componentRef.setInput('placement', 'right');
      detectChangesFakeAsync();

      button?.click();
      detectChangesFakeAsync();

      expect(affixToSpy).toHaveBeenCalledWith(button, {
        autoFitContext: SkyAffixAutoFitContext.Viewport,
        enableAutoFit: true,
        horizontalAlignment: 'center',
        isSticky: true,
        placement: 'right',
        verticalAlignment: 'middle',
      });
    }));

    it('should find a new placement if the current one is hidden', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getCallerElement();
      button?.click();
      detectChangesFakeAsync();

      const popover = getPopoverElement();

      expect(popover).toHaveCssClass('sky-popover-placement-above');

      mockAffixer.placementChange.next({
        placement: 'below',
      });

      detectChangesFakeAsync();

      expect(popover).toHaveCssClass('sky-popover-placement-below');
    }));

    it('should hide the popover if a valid placement cannot be found', fakeAsync(() => {
      detectChangesFakeAsync();

      const button = getCallerElement();
      button?.click();
      detectChangesFakeAsync();

      const popover = getPopoverElement();

      expect(isElementVisible(popover)).toEqual(true);

      // Trigger a null placement change.
      mockAffixer.placementChange.next({
        placement: null,
      });

      detectChangesFakeAsync();

      expect(popover).toHaveCssClass('sky-popover-hidden');
    }));
  });
});

describe('Popover directive accessibility', () => {
  function getPopoverEl(): HTMLElement | null {
    return document.querySelector<HTMLElement>('sky-popover-content');
  }

  /**
   * Asserts the popover and trigger button are accessible.
   */
  async function expectAccessible(
    buttonEl: HTMLButtonElement | null,
    attrs: { ariaExpanded: string },
  ): Promise<void> {
    const pointerEl = buttonEl?.nextElementSibling;
    const popoverEl = getPopoverEl();

    const popoverId = popoverEl?.id ?? null;
    const pointerId = pointerEl?.id ?? null;
    const ariaOwns = pointerEl?.getAttribute('aria-owns');

    expect(buttonEl?.getAttribute('aria-expanded')).toEqual(attrs.ariaExpanded);
    expect(pointerEl).toExist();
    expect(pointerId).toBeDefined();
    expect(buttonEl?.getAttribute('aria-controls')).toEqual(pointerId);

    if (attrs.ariaExpanded === 'true') {
      expect(popoverEl).toExist();
      expect(ariaOwns).toEqual(popoverId);
    } else {
      expect(popoverEl).toBeNull();
      expect(ariaOwns).toBeNull();
    }

    await expectAsync(document.body).toBeAccessible({
      rules: {
        region: {
          enabled: false,
        },
      },
    });
  }

  it('should be accessible', async () => {
    TestBed.configureTestingModule({
      imports: [PopoverA11yTestComponent],
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(PopoverA11yTestComponent);

    fixture.detectChanges();

    const btn = (
      fixture.nativeElement as HTMLElement
    ).querySelector<HTMLButtonElement>('button[data-sky-id="triggerEl"]');

    // Open the popover.
    btn?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAccessible(btn, {
      ariaExpanded: 'true',
    });

    // Close the popover.
    btn?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAccessible(btn, {
      ariaExpanded: 'false',
    });
  });
});

import { StaticProvider } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SkyAppTestUtility, expect } from '@skyux-sdk/testing';

import { MutationObserverService } from '../mutation/mutation-observer-service';

import { SkyDockInsertComponentConfig } from './dock-insert-component-config';
import { SkyDockLocation } from './dock-location';
import { DockItemFixtureContext } from './fixtures/dock-item-context.fixture';
import { DockFixtureComponent } from './fixtures/dock.component.fixture';
import { DockFixturesModule } from './fixtures/dock.module.fixture';

const STYLE_ELEMENT_SELECTOR =
  '[data-test-selector="sky-layout-dock-bottom-styles"]';

const isIE = window.navigator.userAgent.indexOf('rv:11.0') >= 0;

describe('Dock component', () => {
  let fixture: ComponentFixture<DockFixtureComponent>;
  let mutationCallbacks: (() => void)[];

  function resetDockItems(itemConfigs: SkyDockInsertComponentConfig[]): void {
    fixture.componentInstance.removeAllItems();
    fixture.detectChanges();
    fixture.componentInstance.itemConfigs = itemConfigs;
    fixture.detectChanges();
    tick();
  }

  /**
   * Takes an array of sorted stack orders and checks them against the dock's items.
   */
  function verifyStackOrder(expected: number[]): void {
    const currentStackOrder = fixture.componentInstance.dockService.items.map(
      (i) => i.stackOrder
    );
    currentStackOrder.forEach((actual, i) => {
      expect(actual).toEqual(expected[i]);
    });
  }

  /**
   * Mocks the mutation observer callback on DOM change.
   * Angular does not patch `MutationObserver` as a `Task` (like `setTimeout`) so observer callbacks
   * never get triggered in a `fakeAsync` zone.
   * See: https://github.com/angular/angular/issues/31695#issuecomment-425589295
   */
  function triggerMutationChange(): void {
    mutationCallbacks[0]();
    fixture.detectChanges();
    tick();
  }

  function triggerWindowResize(): void {
    SkyAppTestUtility.fireDomEvent(window, 'resize');
    fixture.detectChanges();
    tick(250); // Respect the RxJS debounceTime.
    fixture.detectChanges();
    tick();
  }

  function getStyleElement(): HTMLStyleElement {
    return document
      .getElementsByTagName('head')[0]
      .querySelector(STYLE_ELEMENT_SELECTOR);
  }

  function getProviders(args: any): StaticProvider[] {
    return [
      {
        provide: DockItemFixtureContext,
        useValue: new DockItemFixtureContext(args),
      },
    ];
  }

  function getDockStyle(): CSSStyleDeclaration {
    const dock: HTMLElement = document.getElementsByTagName(
      'sky-dock'
    )[0] as HTMLElement;
    return window.getComputedStyle(dock);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DockFixturesModule],
      providers: [
        {
          provide: MutationObserverService,
          useValue: {
            create: function (callback): any {
              mutationCallbacks.push(callback);
              return {
                observe() {},
                disconnect() {},
              };
            },
          },
        },
      ],
    });

    mutationCallbacks = [];
    fixture = TestBed.createComponent(DockFixtureComponent);
  });

  afterEach(fakeAsync(() => {
    // Verify the dock element is removed.
    expect(document.querySelectorAll('sky-dock').length).toEqual(1);
    resetDockItems([]);
    expect(document.querySelectorAll('sky-dock').length).toEqual(0);

    fixture.destroy();
  }));

  it('should add elements to the dock in the proper stack order', fakeAsync(() => {
    resetDockItems([
      {
        stackOrder: 0,
      },
      {
        stackOrder: 100,
      },
      {
        stackOrder: -10,
      },
      {
        stackOrder: 3,
      },
      {
        stackOrder: 3,
      },
      {
        stackOrder: 0,
      },
      {
        // tslint:disable-next-line:no-null-keyword
        stackOrder: null, // Should default to top of stack.
      },
      {
        stackOrder: undefined, // Should default to top of stack.
      },
    ]);

    verifyStackOrder([102, 101, 100, 3, 3, 0, 0, -10]);
  }));

  it('should default to placing new items at the top of the stack', fakeAsync(() => {
    resetDockItems([
      {
        stackOrder: 0,
      },
      {
        stackOrder: 10,
      },
      undefined, // Empty options should generate a stack order of +1
    ]);

    verifyStackOrder([11, 10, 0]);

    resetDockItems([{}]);

    // Single item's stack order should default to zero.
    verifyStackOrder([0]);
  }));

  describe('positioning: BodyBottom', () => {
    it('should apply margin to the `body` to accommodate item height', fakeAsync(() => {
      fixture.componentInstance.setOptions({
        location: SkyDockLocation.BodyBottom,
      });

      resetDockItems([
        {
          providers: getProviders({ height: 10 }),
        },
        {
          providers: getProviders({ height: 20 }),
        },
        {
          providers: getProviders({ height: 30 }),
        },
      ]);

      triggerMutationChange();

      const styleElement = getStyleElement();

      expect(styleElement.textContent).toContain(
        `body { margin-bottom: 60px; }`
      );
    }));

    it('should adjust `body` margin if window resized', fakeAsync(() => {
      resetDockItems([
        {
          providers: getProviders({ height: 10 }),
        },
        {
          providers: getProviders({ height: 20 }),
        },
        {
          providers: getProviders({ height: 30 }),
        },
      ]);

      triggerWindowResize();

      const styleElement = getStyleElement();

      expect(styleElement.textContent).toContain(
        `body { margin-bottom: 60px; }`
      );
    }));

    it('should not adjust `body` margin if dock height unchanged', fakeAsync(() => {
      resetDockItems([
        {
          providers: getProviders({ height: 10 }),
        },
      ]);

      triggerMutationChange();

      const originalStyleElement = getStyleElement();

      triggerWindowResize();

      const newStyleElement = getStyleElement();

      // If the style element is unaffected, the margin styles were left unchanged.
      expect(newStyleElement).toEqual(originalStyleElement);
    }));

    it('should remove old style elements on changes', fakeAsync(() => {
      resetDockItems([
        {
          providers: getProviders({ height: 10 }),
        },
      ]);

      triggerMutationChange();

      const originalStyleElement = getStyleElement();

      // Add a dock item to affect the dock's height.
      fixture.componentInstance.addItem({
        providers: getProviders({ height: 40 }),
      });

      fixture.detectChanges();
      tick();

      triggerMutationChange();

      const newStyleElement = getStyleElement();

      expect(originalStyleElement).not.toEqual(newStyleElement);
    }));

    it('should apply the correct positioning styles to a dock which is bound to the body bottom', fakeAsync(() => {
      resetDockItems([
        {
          stackOrder: 0,
        },
      ]);

      fixture.detectChanges();
      tick();

      const dockStyle = getDockStyle();

      expect(document.body.lastChild).toBe(document.querySelector('sky-dock'));
      expect(dockStyle.position).toBe('fixed');
      expect(dockStyle.right).toBe('0px');
      expect(dockStyle.left).toBe('0px');
      expect(dockStyle.bottom).toBe('0px');
    }));
  });

  describe('positioning: ElementBottom', () => {
    // Disabling these tests in IE 11 due to IE not supporting sticky positioning.
    if (!isIE) {
      it('should apply the correct positioning styles to a dock which is bound to an element bottom', fakeAsync(() => {
        const innerDiv: HTMLElement = document.querySelector('#innerDiv');
        fixture.componentInstance.setOptions({
          location: SkyDockLocation.ElementBottom,
          referenceEl: innerDiv,
        });

        resetDockItems([
          {
            stackOrder: 0,
          },
        ]);

        fixture.detectChanges();
        tick();

        const dockStyle = getDockStyle();

        expect(innerDiv.lastChild).toBe(document.querySelector('sky-dock'));
        expect(dockStyle.position).toBe('sticky');
        expect(dockStyle.right).toBe('0px');
        expect(dockStyle.left).toBe('0px');
        expect(dockStyle.bottom).toBe('0px');
      }));
    }
  });

  describe('positioning: ElementBottom', () => {
    it('should apply the correct positioning styles to a dock which is bound before an element', fakeAsync(() => {
      const innerDiv: HTMLElement = document.querySelector('#innerDiv');
      fixture.componentInstance.setOptions({
        location: SkyDockLocation.BeforeElement,
        referenceEl: innerDiv,
      });

      resetDockItems([
        {
          stackOrder: 0,
        },
      ]);

      fixture.detectChanges();
      tick();

      const dockStyle = getDockStyle();

      expect(innerDiv.previousSibling).toBe(document.querySelector('sky-dock'));
      expect(dockStyle.position).toBe('static');
      expect(dockStyle.right).not.toBe('0px');
      expect(dockStyle.left).not.toBe('0px');
      expect(dockStyle.bottom).not.toBe('0px');
    }));
  });

  it('should set the z-index if given via a dock service option', fakeAsync(() => {
    fixture.componentInstance.setOptions({
      zIndex: 5,
    });

    resetDockItems([
      {
        stackOrder: 0,
      },
    ]);

    fixture.detectChanges();
    tick();

    /// The `toString` is needed for IE
    expect(getDockStyle().zIndex.toString()).toBe('5');
  }));
});

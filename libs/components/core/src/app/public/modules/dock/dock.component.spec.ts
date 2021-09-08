import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  DockFixtureComponent
} from './fixtures/dock.component.fixture';

import {
  DockFixturesModule
} from './fixtures/dock.module.fixture';

import {
  SkyDockInsertComponentConfig
} from './dock-insert-component-config';

import {
  SkyDockLocation
} from './dock-location';

const isIE = window.navigator.userAgent.indexOf('rv:11.0') >= 0;

describe('Dock component', () => {

  let fixture: ComponentFixture<DockFixtureComponent>;

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
    const currentStackOrder = fixture.componentInstance.dockService.items.map(i => i.stackOrder);
    currentStackOrder.forEach((actual, i) => {
      expect(actual).toEqual(expected[i]);
    });
  }

  function getDockStyle(): CSSStyleDeclaration {
    const dock: HTMLElement = document.getElementsByTagName('sky-dock')[0] as HTMLElement;
    return window.getComputedStyle(dock);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DockFixturesModule
      ]
    });
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
        stackOrder: 0
      },
      {
        stackOrder: 100
      },
      {
        stackOrder: -10
      },
      {
        stackOrder: 3
      },
      {
        stackOrder: 3
      },
      {
        stackOrder: 0
      },
      {
        // tslint:disable-next-line:no-null-keyword
        stackOrder: null // Should default to top of stack.
      },
      {
        stackOrder: undefined // Should default to top of stack.
      }
    ]);

    verifyStackOrder([102, 101, 100, 3, 3, 0, 0, -10]);
  }));

  it('should default to placing new items at the top of the stack', fakeAsync(() => {
    resetDockItems([
      {
        stackOrder: 0
      },
      {
        stackOrder: 10
      },
      undefined // Empty options should generate a stack order of +1
    ]);

    verifyStackOrder([11, 10, 0]);

    resetDockItems([{}]);

    // Single item's stack order should default to zero.
    verifyStackOrder([0]);
  }));

  // Disabling these tests in IE 11 due to IE not supporting sticky positioning.
  if (!isIE) {

    it('should apply the correct positioning styles to a dock which is bound to the body bottom', fakeAsync(() => {
      resetDockItems([
        {
          stackOrder: 0
        }
      ]);

      fixture.detectChanges();
      tick();

      const dockStyle = getDockStyle();

      expect(document.body.lastChild).toBe(document.querySelector('sky-dock'));
      expect(dockStyle.position).toBe('sticky');
      expect(dockStyle.right).toBe('0px');
      expect(dockStyle.left).toBe('0px');
      expect(dockStyle.bottom).toBe('0px');
    }));

    it('should apply the correct positioning styles to a dock which is bound to an element bottom', fakeAsync(() => {
      const innerDiv: HTMLElement = document.querySelector('#innerDiv');
      fixture.componentInstance.setOptions({
        location: SkyDockLocation.ElementBottom,
        referenceEl: innerDiv
      });

      resetDockItems([
        {
          stackOrder: 0
        }
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

    it('should apply the correct positioning styles to a dock which is bound before an element', fakeAsync(() => {
      const innerDiv: HTMLElement = document.querySelector('#innerDiv');
      fixture.componentInstance.setOptions({
        location: SkyDockLocation.BeforeElement,
        referenceEl: innerDiv
      });

      resetDockItems([
        {
          stackOrder: 0
        }
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

  }

  it('should set the z-index if given via a dock service option', fakeAsync(() => {
    fixture.componentInstance.setOptions({
      zIndex: 5
    });

    resetDockItems([
      {
        stackOrder: 0
      }
    ]);

    fixture.detectChanges();
    tick();

    /// The `toString` is needed for IE
    expect((<any> getDockStyle().zIndex).toString()).toBe('5');
  }));

});

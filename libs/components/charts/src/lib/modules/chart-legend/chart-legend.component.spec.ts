import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';

import { SkyChartLegendItem } from './chart-legend-item';
import { SkyChartLegendComponent } from './chart-legend.component';

describe('SkyChartLegendComponent', () => {
  let fixture: ComponentFixture<SkyChartLegendComponent>;

  function createItems(count: number, allVisible = true): SkyChartLegendItem[] {
    return Array.from({ length: count }, (_, i) => ({
      datasetIndex: 0,
      index: i,
      isVisible: allVisible,
      labelText: `Series ${i + 1}`,
      seriesColor: `#00000${i}`,
    }));
  }

  function setItems(items: SkyChartLegendItem[]): void {
    fixture.componentRef.setInput('legendItems', items);
    fixture.detectChanges();
  }

  function getLegendList(): HTMLElement {
    const el: HTMLElement | null =
      fixture.nativeElement.querySelector('.sky-chart-legend');
    if (!el) {
      throw new Error('Legend list element not found');
    }
    return el;
  }

  function getLegendButtons(): NodeListOf<HTMLButtonElement> {
    return fixture.nativeElement.querySelectorAll('.sky-chart-legend-button');
  }

  function fireLegendKeydown(key: string): void {
    const list = getLegendList();
    if (!list) {
      throw new Error('Legend list not found');
    }
    SkyAppTestUtility.fireDomEvent(list, 'keydown', {
      keyboardEventInit: { key },
    });
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyChartLegendComponent],
    });

    fixture = TestBed.createComponent(SkyChartLegendComponent);
  });

  describe('accessibility', () => {
    it('should be accessible with all visible legend items', async () => {
      setItems(createItems(3));
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible with mixed visible and hidden items', async () => {
      const items = createItems(3);
      items[1].isVisible = false;
      setItems(items);
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });

  describe('rendering', () => {
    it('should not render the legend list when there are no items', () => {
      setItems([]);

      expect(
        fixture.nativeElement.querySelector('.sky-chart-legend'),
      ).toBeNull();
    });

    it('should render the legend list when items are provided', () => {
      setItems(createItems(3));

      expect(
        fixture.nativeElement.querySelector('.sky-chart-legend'),
      ).not.toBeNull();
    });

    it('should render the correct number of buttons', () => {
      setItems(createItems(4));

      expect(getLegendButtons().length).toBe(4);
    });

    it('should display the correct label text for each item', () => {
      const items = createItems(2);
      setItems(items);

      const buttons = getLegendButtons();
      expect(
        buttons[0]
          .querySelector('.sky-chart-legend-button-label')
          ?.textContent?.trim(),
      ).toBe('Series 1');
      expect(
        buttons[1]
          .querySelector('.sky-chart-legend-button-label')
          ?.textContent?.trim(),
      ).toBe('Series 2');
    });

    it('should set the correct series color as the icon background', () => {
      const items = createItems(1);
      items[0].seriesColor = 'rgb(255, 0, 0)';
      setItems(items);

      const icon: HTMLElement = fixture.nativeElement.querySelector(
        '.sky-chart-legend-button-icon',
      );
      expect(icon.style.background).toBe('rgb(255, 0, 0)');
    });

    it('should have role="switch" on legend buttons', () => {
      setItems(createItems(1));

      expect(getLegendButtons()[0].getAttribute('role')).toBe('switch');
    });

    it('should set aria-checked to true for visible items', () => {
      const items = createItems(1);
      items[0].isVisible = true;
      setItems(items);

      expect(getLegendButtons()[0].getAttribute('aria-checked')).toBe('true');
    });

    it('should set aria-checked to false for hidden items', () => {
      const items = createItems(1);
      items[0].isVisible = false;
      setItems(items);

      expect(getLegendButtons()[0].getAttribute('aria-checked')).toBe('false');
    });

    it('should set the correct aria-label on legend buttons', () => {
      setItems(createItems(3));

      const buttons = getLegendButtons();
      expect(buttons[0].getAttribute('aria-label')).toBe(
        'Series 1, Legend item 1 of 3',
      );
      expect(buttons[1].getAttribute('aria-label')).toBe(
        'Series 2, Legend item 2 of 3',
      );
      expect(buttons[2].getAttribute('aria-label')).toBe(
        'Series 3, Legend item 3 of 3',
      );
    });

    it('should set aria-describedby on buttons referencing the description span', () => {
      setItems(createItems(1));

      const button = getLegendButtons()[0];
      const describedById = button.getAttribute('aria-describedby');
      expect(describedById).toBeTruthy();

      const descriptionEl: HTMLElement | null =
        fixture.nativeElement.querySelector(`#${describedById}`);
      expect(descriptionEl?.textContent?.trim()).toBe(
        'Press Space or Enter to toggle inclusion in chart.',
      );
    });

    it('should apply line-through text decoration for hidden items', () => {
      const items = createItems(2);
      items[1].isVisible = false;
      setItems(items);

      const labels: NodeListOf<HTMLElement> =
        fixture.nativeElement.querySelectorAll(
          '.sky-chart-legend-button-label',
        );
      expect(labels[0].style.textDecoration).toBe('');
      expect(labels[1].style.textDecoration).toBe('line-through');
    });

    it('should have role="toolbar" on the legend list', () => {
      setItems(createItems(1));

      expect(getLegendList().getAttribute('role')).toBe('toolbar');
    });

    it('should set the accessible label on the legend list', () => {
      setItems(createItems(1));

      expect(getLegendList().getAttribute('aria-label')).toBe('Chart legend');
    });

    it('should set tabindex 0 on the first button and -1 on all others by default', () => {
      setItems(createItems(3));

      const buttons = getLegendButtons();
      expect(buttons[0].getAttribute('tabindex')).toBe('0');
      expect(buttons[1].getAttribute('tabindex')).toBe('-1');
      expect(buttons[2].getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('toggle legend item', () => {
    it('should emit legendItemToggled when a visible item is clicked', () => {
      const items = createItems(2);
      setItems(items);

      const emitSpy = jasmine.createSpy('legendItemToggled');
      fixture.componentInstance.legendItemToggled.subscribe(emitSpy);

      getLegendButtons()[0].click();
      fixture.detectChanges();

      expect(emitSpy).toHaveBeenCalledOnceWith(items[0]);
    });

    it('should emit legendItemToggled when a hidden item is clicked', () => {
      const items = createItems(2, false);
      setItems(items);

      const emitSpy = jasmine.createSpy('legendItemToggled');
      fixture.componentInstance.legendItemToggled.subscribe(emitSpy);

      getLegendButtons()[0].click();
      fixture.detectChanges();

      expect(emitSpy).toHaveBeenCalledOnceWith(items[0]);
    });

    it('should NOT emit legendItemToggled when the last visible item is clicked', () => {
      const items = createItems(2, false);
      items[0].isVisible = true;
      setItems(items);

      const emitSpy = jasmine.createSpy('legendItemToggled');
      fixture.componentInstance.legendItemToggled.subscribe(emitSpy);

      getLegendButtons()[0].click();
      fixture.detectChanges();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('keyboard navigation', () => {
    it('should move to the next item on ArrowRight', () => {
      setItems(createItems(3));

      fireLegendKeydown('ArrowRight');

      const buttons = getLegendButtons();
      expect(buttons[0].getAttribute('tabindex')).toBe('-1');
      expect(buttons[1].getAttribute('tabindex')).toBe('0');
    });

    it('should move to the next item on ArrowDown', () => {
      setItems(createItems(3));

      fireLegendKeydown('ArrowDown');

      const buttons = getLegendButtons();
      expect(buttons[0].getAttribute('tabindex')).toBe('-1');
      expect(buttons[1].getAttribute('tabindex')).toBe('0');
    });

    it('should move to the previous item on ArrowLeft', () => {
      setItems(createItems(3));
      fireLegendKeydown('ArrowRight');

      fireLegendKeydown('ArrowLeft');

      expect(getLegendButtons()[0].getAttribute('tabindex')).toBe('0');
    });

    it('should move to the previous item on ArrowUp', () => {
      setItems(createItems(3));
      fireLegendKeydown('ArrowDown');

      fireLegendKeydown('ArrowUp');

      expect(getLegendButtons()[0].getAttribute('tabindex')).toBe('0');
    });

    it('should wrap from the first item to the last on ArrowLeft', () => {
      setItems(createItems(3));

      fireLegendKeydown('ArrowLeft');

      expect(getLegendButtons()[2].getAttribute('tabindex')).toBe('0');
    });

    it('should wrap from the last item to the first on ArrowRight', () => {
      setItems(createItems(3));
      fireLegendKeydown('End');

      fireLegendKeydown('ArrowRight');

      expect(getLegendButtons()[0].getAttribute('tabindex')).toBe('0');
    });

    it('should move to the first item on Home', () => {
      setItems(createItems(3));
      fireLegendKeydown('End');

      fireLegendKeydown('Home');

      expect(getLegendButtons()[0].getAttribute('tabindex')).toBe('0');
    });

    it('should move to the last item on End', () => {
      setItems(createItems(3));

      fireLegendKeydown('End');

      expect(getLegendButtons()[2].getAttribute('tabindex')).toBe('0');
    });

    it('should emit legendItemToggled for the active item on Enter', () => {
      const items = createItems(2);
      setItems(items);

      const emitSpy = jasmine.createSpy('legendItemToggled');
      fixture.componentInstance.legendItemToggled.subscribe(emitSpy);

      fireLegendKeydown('Enter');

      expect(emitSpy).toHaveBeenCalledOnceWith(items[0]);
    });

    it('should emit legendItemToggled for the active item on Space', () => {
      const items = createItems(2);
      setItems(items);

      const emitSpy = jasmine.createSpy('legendItemToggled');
      fixture.componentInstance.legendItemToggled.subscribe(emitSpy);

      fireLegendKeydown(' ');

      expect(emitSpy).toHaveBeenCalledOnceWith(items[0]);
    });

    it('should not change the active index on unhandled keys', () => {
      setItems(createItems(3));

      fireLegendKeydown('Tab');

      expect(getLegendButtons()[0].getAttribute('tabindex')).toBe('0');
    });

    it('should do nothing when no items are present and a key is pressed', () => {
      // The legend list is not rendered when items are empty, so DOM events
      // cannot reach onLegendKeydown. Invoke it directly to exercise the
      // count === 0 guard branch.
      setItems([]);

      const component = fixture.componentInstance as unknown as {
        onLegendKeydown: (event: KeyboardEvent) => void;
      };

      expect(() => {
        component.onLegendKeydown(
          new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
        );
      }).not.toThrow();
    });
  });

  describe('focus management', () => {
    it('should reset to the first item when focus enters the legend from outside', () => {
      setItems(createItems(3));
      fireLegendKeydown('End'); // Navigate to index 2.

      // Simulate focus coming from an external element (e.g., user tabbed in).
      const externalEl = document.createElement('button');
      document.body.appendChild(externalEl);

      SkyAppTestUtility.fireDomEvent(getLegendList(), 'focusin', {
        customEventInit: { relatedTarget: externalEl },
      });
      fixture.detectChanges();

      document.body.removeChild(externalEl);

      expect(getLegendButtons()[0].getAttribute('tabindex')).toBe('0');
    });

    it('should not reset active index when focus moves within the legend', () => {
      setItems(createItems(3));
      fireLegendKeydown('ArrowRight'); // Navigate to index 1.

      // Simulate focus moving from one button (inside the legend) to another.
      SkyAppTestUtility.fireDomEvent(getLegendList(), 'focusin', {
        customEventInit: { relatedTarget: getLegendButtons()[0] },
      });
      fixture.detectChanges();

      // Active index should remain at 1.
      expect(getLegendButtons()[1].getAttribute('tabindex')).toBe('0');
    });

    it('should update the active index when a button receives focus directly', () => {
      setItems(createItems(3));

      // Dispatch native focus on the third button to trigger onLegendButtonFocus.
      SkyAppTestUtility.fireDomEvent(getLegendButtons()[2], 'focus');
      fixture.detectChanges();

      expect(getLegendButtons()[2].getAttribute('tabindex')).toBe('0');
      expect(getLegendButtons()[0].getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('active index clamping effect', () => {
    it('should clamp the active index when items are reduced below the current index', () => {
      setItems(createItems(3));
      fireLegendKeydown('End'); // Navigate to index 2.

      setItems(createItems(2)); // Reduce to 2 items; index 2 is now out of bounds.

      expect(getLegendButtons()[1].getAttribute('tabindex')).toBe('0');
      expect(getLegendButtons()[0].getAttribute('tabindex')).toBe('-1');
    });

    it('should reset active index to 0 when items become empty and are then re-added', () => {
      setItems(createItems(3));
      fireLegendKeydown('End'); // Navigate to index 2.

      setItems([]);
      setItems(createItems(2));

      expect(getLegendButtons()[0].getAttribute('tabindex')).toBe('0');
    });
  });
});

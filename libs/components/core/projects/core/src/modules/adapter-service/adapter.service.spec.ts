import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { expect } from '@skyux-sdk/testing';

import { SkyMediaBreakpoints } from '../media-query/media-breakpoints';

import { AdapterServiceFixtureComponent } from './fixtures/adapter-service.fixture';

import { SkyAdapterServiceFixturesModule } from './fixtures/adapter-service.fixtures.module';

import { SkyCoreAdapterService } from './adapter.service';

describe('Core adapter service', () => {
  let fixture: ComponentFixture<AdapterServiceFixtureComponent>;
  let component: AdapterServiceFixtureComponent;
  let nativeElement: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAdapterServiceFixturesModule],
    });
    fixture = TestBed.createComponent(AdapterServiceFixtureComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
  });

  describe('getFocusableChildren', () => {
    it('should return an array of all focusable children', () => {
      const actual = component.getFocusableChildren(nativeElement);
      expect(actual.length).toEqual(8);
    });

    it('should not return an input with a specified tab index that is disabled', () => {
      component.disableInput = true;
      fixture.detectChanges();

      const disabledInput = nativeElement.querySelectorAll('input')[0];

      const actual = component.getFocusableChildren(nativeElement);
      expect(actual.length).toEqual(7);
      expect(actual[0]).not.toEqual(disabledInput);
    });

    it('should not return any tabIndex with -1', () => {
      const inputs = nativeElement.querySelectorAll('input');
      const links = nativeElement.querySelectorAll('a');

      inputs[0].tabIndex = '-1';
      links[0].tabIndex = '-1';

      const actual = component.getFocusableChildren(nativeElement);
      expect(actual.length).toEqual(6);
    });

    it('should ignore tabIndexes when ignoreTabIndex = true', () => {
      const inputs = nativeElement.querySelectorAll('input');
      const links = nativeElement.querySelectorAll('a');

      inputs[0].tabIndex = '-1';
      links[0].tabIndex = '-1';

      const actual = component.getFocusableChildren(nativeElement, {
        ignoreTabIndex: true,
      });
      expect(actual.length).toEqual(8);
    });

    it('should not return hidden elements with default settings', () => {
      const hiddenContainer = nativeElement.querySelector('#hidden-container');
      const actual = component.getFocusableChildren(hiddenContainer);
      expect(actual.length).toEqual(0);
    });

    it('should return hidden elements when ignoreVisibility = true', () => {
      const actual = component.getFocusableChildren(nativeElement, {
        ignoreVisibility: true,
      });
      expect(actual.length).toEqual(9);
    });
  });

  describe('getFocusableChildrenAndApplyFocus', () => {
    it('should apply focus to the first element', () => {
      const firstFocussableElement = nativeElement.querySelector(
        '#not-autofocus-input'
      );

      component.getFocusableChildrenAndApplyFocus(
        fixture,
        '#focusable-children-container'
      );

      expect(document.activeElement).toEqual(firstFocussableElement);
    });

    it('should apply focus to the container if no focussable element is found', () => {
      const container = nativeElement.querySelector('#paragraph-container');

      component.getFocusableChildrenAndApplyFocus(
        fixture,
        '#paragraph-container',
        true
      );

      expect(document.activeElement).toEqual(container);
    });
  });

  describe('applyAutoFocus', () => {
    it('should apply focus to the first autofocus element and return true', () => {
      const nonAutoFocusInput = nativeElement.querySelector(
        '#not-autofocus-input'
      );
      const autoFocusElement = nativeElement.querySelector('#autofocus-input');

      // Set focus to something else for a baseline.
      nonAutoFocusInput.focus();
      expect(document.activeElement).toEqual(nonAutoFocusInput);

      // Run applyAutoFocus.
      const actual = component.applyAutoFocus(fixture);

      // Expect focus to be back on the autofocus input.
      expect(document.activeElement).toEqual(autoFocusElement);
      expect(actual).toEqual(true);
    });

    it('should not apply focus if no autofocus element is found and return false', () => {
      const nonAutoFocusInput = nativeElement.querySelector(
        '#not-autofocus-input'
      );
      const autoFocusElement = nativeElement.querySelector('#autofocus-input');

      // Set focus to something else for a baseline.
      nonAutoFocusInput.focus();
      expect(document.activeElement).toEqual(nonAutoFocusInput);

      // Remove the autofocus element from DOM. Run applyAutoFocus.
      autoFocusElement.parentNode.removeChild(autoFocusElement);
      const actual = component.applyAutoFocus(fixture);

      // Expect focus to have not been moved.
      expect(document.activeElement).toEqual(nonAutoFocusInput);
      expect(actual).toEqual(false);
    });
  });

  describe('toggleIframePointerEvents', () => {
    it('should set the pointerEvents style to "none" when value is false', () => {
      const iframe = nativeElement.querySelector('#iframe-container iframe');

      // Expect baseline CSS value to be an empty string.
      expect(iframe.style.pointerEvents).toEqual('');

      // Set the value to false and expect CSS value to be 'none'.
      component.toggleIframePointerEvents(false);
      expect(iframe.style.pointerEvents).toEqual('none');

      // Set the value to true and expect CSS value to be back to the baseline empty string.
      component.toggleIframePointerEvents(true);
      expect(iframe.style.pointerEvents).toEqual('');
    });
  });

  describe('setResponsiveContainerClass', () => {
    it('should set xs CSS class', () => {
      fixture.detectChanges();
      const container = nativeElement.querySelector('#paragraph-container');
      component.setParagraphContainerClass(SkyMediaBreakpoints.xs);

      expect(container).toHaveCssClass('sky-responsive-container-xs');
      expect(container).not.toHaveCssClass('sky-responsive-container-sm');
      expect(container).not.toHaveCssClass('sky-responsive-container-md');
      expect(container).not.toHaveCssClass('sky-responsive-container-lg');
    });

    it('should set sm CSS class', () => {
      fixture.detectChanges();
      const container = nativeElement.querySelector('#paragraph-container');
      component.setParagraphContainerClass(SkyMediaBreakpoints.sm);

      expect(container).not.toHaveCssClass('sky-responsive-container-xs');
      expect(container).toHaveCssClass('sky-responsive-container-sm');
      expect(container).not.toHaveCssClass('sky-responsive-container-md');
      expect(container).not.toHaveCssClass('sky-responsive-container-lg');
    });

    it('should set md CSS class', () => {
      fixture.detectChanges();
      const container = nativeElement.querySelector('#paragraph-container');
      component.setParagraphContainerClass(SkyMediaBreakpoints.md);

      expect(container).not.toHaveCssClass('sky-responsive-container-xs');
      expect(container).not.toHaveCssClass('sky-responsive-container-sm');
      expect(container).toHaveCssClass('sky-responsive-container-md');
      expect(container).not.toHaveCssClass('sky-responsive-container-lg');
    });

    it('should set lg CSS class', () => {
      fixture.detectChanges();
      const container = nativeElement.querySelector('#paragraph-container');
      component.setParagraphContainerClass(SkyMediaBreakpoints.lg);

      expect(container).not.toHaveCssClass('sky-responsive-container-xs');
      expect(container).not.toHaveCssClass('sky-responsive-container-sm');
      expect(container).not.toHaveCssClass('sky-responsive-container-md');
      expect(container).toHaveCssClass('sky-responsive-container-lg');
    });
  });

  describe('getWidth', () => {
    it('should return the width of an element', () => {
      fixture.detectChanges();
      const width = component.getWidth();
      expect(width).toEqual(300);
    });
  });

  describe('height functions', () => {
    let childrenArray: Array<HTMLElement>;

    beforeEach(() => {
      fixture.detectChanges();
      const children = document.querySelectorAll('#height-sync-container div');
      childrenArray = Array.prototype.slice.call(
        children
      ) as Array<HTMLElement>;
    });

    //#region helpers
    function heightsSynced(children: HTMLElement[]): boolean {
      let height = children[0].clientHeight;
      return children.every((element) => {
        return element.clientHeight === height;
      });
    }
    //#endregion

    it('syncHeight should sync height for a group of children elements', () => {
      // Children should not have the same height to begin with,
      // as some elements have more text than others.
      expect(heightsSynced(childrenArray)).toEqual(false);

      component.syncHeight();

      // Expect all heights to now match, and height attributes to be set.
      expect(heightsSynced(childrenArray)).toEqual(true);
      for (let index = 0; index < childrenArray.length; index++) {
        const element = childrenArray[index];
        expect(element.getAttribute('style')).toContain('height');
      }
    });

    it('resetHeight should reset height for a group of children elements', () => {
      component.syncHeight();
      component.resetHeight();

      // Expect all heights to no longer be equal, and all inline height attributes to be removed.
      expect(heightsSynced(childrenArray)).toEqual(false);
      for (let index = 0; index < childrenArray.length; index++) {
        const element = childrenArray[index];
        // IE11 will result in 'height:;'. Remove that before running expectation.
        const heightAttribute = element
          .getAttribute('style')
          .replace('height:;', '');
        expect(heightAttribute).toBe('');
      }
    });
  });

  describe('isTargetAboveElement', () => {
    let adapter: SkyCoreAdapterService;
    let container: HTMLDivElement;

    beforeEach(inject(
      [SkyCoreAdapterService],
      (_adapter: SkyCoreAdapterService) => {
        adapter = _adapter;
        container = document.getElementById(
          'z-index-container'
        ) as HTMLDivElement;
      }
    ));

    it('should check if event target is above element', () => {
      const div1 = document.createElement('div');
      div1.style.position = 'fixed';
      div1.style.zIndex = '1';

      const div2 = document.createElement('div');
      div2.style.position = 'fixed';
      div2.style.zIndex = '2';

      container.appendChild(div1);
      container.appendChild(div2); // Higher z-index added last.

      const result = adapter.isTargetAboveElement(div2, div1);
      expect(result).toEqual(true);
    });

    it('should handle elements that do not exist in the DOM', () => {
      const div1 = document.createElement('div');
      div1.style.position = 'fixed';
      div1.style.zIndex = '1';

      const div2 = document.createElement('div');
      div2.style.position = 'fixed';
      div2.style.zIndex = '2';

      // Only add the first element.
      container.appendChild(div1);

      const result = adapter.isTargetAboveElement(div2, div1);
      expect(result).toEqual(true);
    });

    it('should search parents recursively until z-index is found', () => {
      const div1 = document.createElement('div');
      const div1Parent = document.createElement('div');
      div1Parent.style.position = 'fixed';
      div1Parent.style.zIndex = '2';
      div1Parent.appendChild(div1);

      const div2 = document.createElement('div');
      div2.style.position = 'fixed';
      div2.style.zIndex = '1';

      container.appendChild(div1Parent);
      container.appendChild(div2);

      const result = adapter.isTargetAboveElement(div1, div2);
      expect(result).toEqual(true);
    });

    it('should return false if the target does not have a z-index', () => {
      const div1 = document.createElement('div');

      const div2 = document.createElement('div');
      div2.style.position = 'fixed';
      div2.style.zIndex = '1';

      container.appendChild(div1);
      container.appendChild(div2);

      const result = adapter.isTargetAboveElement(div1, div2);
      expect(result).toEqual(false);
    });
  });
});

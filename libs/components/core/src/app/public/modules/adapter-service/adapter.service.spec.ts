import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyMediaBreakpoints
} from '../media-query/media-breakpoints';

import {
  AdapterServiceFixtureComponent
} from './fixtures/adapter-service.fixture';

import {
  SkyAdapterServiceFixturesModule
} from './fixtures/adapter-service.fixtures.module';

describe('Core adapter service', () => {
  let fixture: ComponentFixture<AdapterServiceFixtureComponent>;
  let component: AdapterServiceFixtureComponent;
  let nativeElement: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyAdapterServiceFixturesModule
      ]
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

      const actual = component.getFocusableChildren(nativeElement, {ignoreTabIndex: true});
      expect(actual.length).toEqual(8);
    });

    it('should not return hidden elements with default settings', () => {
      const hiddenContainer = nativeElement.querySelector('#hidden-container');
      const actual = component.getFocusableChildren(hiddenContainer);
      expect(actual.length).toEqual(0);
    });

    it('should return hidden elements when ignoreVisibility = true', () => {
      const actual = component.getFocusableChildren(nativeElement, {ignoreVisibility: true});
      expect(actual.length).toEqual(9);
    });
  });

  describe('getFocusableChildrenAndApplyFocus', () => {
    it('should apply focus to the first element', () => {
      const firstFocussableElement = nativeElement.querySelector('#not-autofocus-input');

      component.getFocusableChildrenAndApplyFocus(fixture, '#focusable-children-container');

      expect(document.activeElement).toEqual(firstFocussableElement);
    });

    it('should apply focus to the container if no focussable element is found', () => {
      const container = nativeElement.querySelector('#paragraph-container');

      component.getFocusableChildrenAndApplyFocus(fixture, '#paragraph-container', true);

      expect(document.activeElement).toEqual(container);
    });
  });

  describe('applyAutoFocus', () => {
    it('should apply focus to the first autofocus element and return true', () => {
      const nonAutoFocusInput = nativeElement.querySelector('#not-autofocus-input');
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
      const nonAutoFocusInput = nativeElement.querySelector('#not-autofocus-input');
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
      const container = nativeElement.querySelector('#paragraph-container');
      component.setParagraphContainerClass(SkyMediaBreakpoints.xs);

      expect(container).toHaveCssClass('sky-responsive-container-xs');
      expect(container).not.toHaveCssClass('sky-responsive-container-sm');
      expect(container).not.toHaveCssClass('sky-responsive-container-md');
      expect(container).not.toHaveCssClass('sky-responsive-container-lg');
    });

    it('should set sm CSS class', () => {
      const container = nativeElement.querySelector('#paragraph-container');
      component.setParagraphContainerClass(SkyMediaBreakpoints.sm);

      expect(container).not.toHaveCssClass('sky-responsive-container-xs');
      expect(container).toHaveCssClass('sky-responsive-container-sm');
      expect(container).not.toHaveCssClass('sky-responsive-container-md');
      expect(container).not.toHaveCssClass('sky-responsive-container-lg');
    });

    it('should set md CSS class', () => {
      const container = nativeElement.querySelector('#paragraph-container');
      component.setParagraphContainerClass(SkyMediaBreakpoints.md);

      expect(container).not.toHaveCssClass('sky-responsive-container-xs');
      expect(container).not.toHaveCssClass('sky-responsive-container-sm');
      expect(container).toHaveCssClass('sky-responsive-container-md');
      expect(container).not.toHaveCssClass('sky-responsive-container-lg');
    });

    it('should set lg CSS class', () => {
      const container = nativeElement.querySelector('#paragraph-container');
      component.setParagraphContainerClass(SkyMediaBreakpoints.lg);

      expect(container).not.toHaveCssClass('sky-responsive-container-xs');
      expect(container).not.toHaveCssClass('sky-responsive-container-sm');
      expect(container).not.toHaveCssClass('sky-responsive-container-md');
      expect(container).toHaveCssClass('sky-responsive-container-lg');
    });
  });
});

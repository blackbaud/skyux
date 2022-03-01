import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyAgGridAdapterService } from './ag-grid-adapter.service';
import { SkyAgGridAdapterFixtureComponent } from './fixtures/ag-grid-adapter.component.fixture';

describe('SkyAgGridAdapterService', () => {
  let agGridAdapterService: SkyAgGridAdapterService;
  let agGridAdapterServiceFixture: ComponentFixture<SkyAgGridAdapterFixtureComponent>;

  let parentElement: HTMLElement;
  let firstChildElement: HTMLElement;
  let secondChildElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkyAgGridAdapterFixtureComponent],
      providers: [SkyAgGridAdapterService],
    });

    agGridAdapterServiceFixture = TestBed.createComponent(
      SkyAgGridAdapterFixtureComponent
    );
    agGridAdapterService = TestBed.inject(SkyAgGridAdapterService);
    parentElement =
      agGridAdapterServiceFixture.nativeElement.querySelector('#parent');
    firstChildElement =
      agGridAdapterServiceFixture.nativeElement.querySelector('#child1');
    secondChildElement =
      agGridAdapterServiceFixture.nativeElement.querySelector('#child2');
  });

  describe('getElementOrParentWithClass', () => {
    it('should return the given element if that element has the given class', () => {
      expect(
        agGridAdapterService.getElementOrParentWithClass(
          firstChildElement,
          'class2'
        )
      ).toEqual(firstChildElement);
    });

    it("should return a parent element if the given element's parent has the given class", () => {
      expect(
        agGridAdapterService.getElementOrParentWithClass(
          firstChildElement,
          'class1'
        )
      ).toEqual(parentElement);
    });

    it('should return undefined if neither the given element or its parent(s) have the given class', () => {
      expect(
        agGridAdapterService.getElementOrParentWithClass(
          firstChildElement,
          'fakeClass'
        )
      ).toBeUndefined();
    });
  });

  describe('setFocusedElementById', () => {
    it('should focus on the element in the given ref with the given ID', () => {
      expect(document.activeElement).not.toEqual(firstChildElement);

      agGridAdapterService.setFocusedElementById(parentElement, 'child1');

      expect(document.activeElement).toEqual(firstChildElement);
    });
  });

  describe('getFocusedElement', () => {
    it('should return the element that currently has focus', () => {
      parentElement.focus();

      expect(agGridAdapterService.getFocusedElement()).toEqual(parentElement);
    });
  });

  describe('getNextFocusableElement', () => {
    it('should return the next element to focus on when there is a focusable element after the currently focused one in the given parent element and focus is moving right', () => {
      expect(
        agGridAdapterService.getNextFocusableElement(
          firstChildElement,
          parentElement
        )
      ).toEqual(secondChildElement);
    });

    it('should return the previous element to focus on when there is a focusable element before the currently focused one in the given parent element and focus is moving left', () => {
      expect(
        agGridAdapterService.getNextFocusableElement(
          secondChildElement,
          parentElement,
          true
        )
      ).toEqual(firstChildElement);
    });

    it('should return undefined when there is no next focusable element after the currently focused one in the given parent element and focus is moving right', () => {
      expect(
        agGridAdapterService.getNextFocusableElement(
          secondChildElement,
          parentElement
        )
      ).toBeUndefined();
    });

    it('should return undefined when there is no focusable element before the currently focused one in the given parent element and focus is moving left', () => {
      expect(
        agGridAdapterService.getNextFocusableElement(
          firstChildElement,
          parentElement,
          true
        )
      ).toBeUndefined();
    });

    it('returns undefined if no parent element is given', () => {
      expect(
        agGridAdapterService.getNextFocusableElement(
          firstChildElement,
          undefined
        )
      ).toBeUndefined();
    });
  });

  describe('focusOnFocusableChildren', () => {
    it('should move focus to the first focusable child if there is one', () => {
      parentElement.focus();

      agGridAdapterService.focusOnFocusableChildren(parentElement);

      expect(document.activeElement).toEqual(firstChildElement);
    });

    it('should leave focus on the given element if it has no focusable children', () => {
      firstChildElement.focus();

      agGridAdapterService.focusOnFocusableChildren(firstChildElement);

      expect(document.activeElement).toEqual(firstChildElement);
    });
  });
});

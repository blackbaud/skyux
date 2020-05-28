import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyCoreAdapterService
} from '@skyux/core';

import {
  SkyAgGridAdapterFixtureComponent
} from './fixtures/ag-grid-adapter.component.fixture';

import {
  SkyAgGridAdapterService
} from './ag-grid-adapter.service';

describe('SkyAgGridAdapterService', () => {
  let agGridAdapterService: SkyAgGridAdapterService;
  let agGridAdapterServiceFixture: ComponentFixture<SkyAgGridAdapterFixtureComponent>;

  let parentElement: HTMLElement;
  let childElement: HTMLElement;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [SkyAgGridAdapterFixtureComponent],
      providers: [
        SkyAgGridAdapterService,
        SkyCoreAdapterService
      ]
    });

    agGridAdapterServiceFixture = TestBed.createComponent(SkyAgGridAdapterFixtureComponent);
    agGridAdapterService = TestBed.get(SkyAgGridAdapterService);
    parentElement = agGridAdapterServiceFixture.nativeElement.querySelector('#parent');
    childElement = agGridAdapterServiceFixture.nativeElement.querySelector('#child');
  });

  describe('elementOrParentHasClass', () => {
    it('should return true if an element has the given class', () => {
      expect(agGridAdapterService.elementOrParentHasClass(childElement, 'class2')).toBe(true);
    });

    it('should return true if an element\'s parent has the given class', () => {
      expect(agGridAdapterService.elementOrParentHasClass(childElement, 'class1')).toBe(true);
    });

    it('should return false if neither the element or it\'s parent has the given class', () => {
      expect(agGridAdapterService.elementOrParentHasClass(childElement, 'fakeClass')).toBe(false);
    });
  });

  describe('setFocusedElementById', () => {
    it('should focus on the element in the given ref with the given ID', () => {
      expect(document.activeElement).not.toEqual(childElement);

      agGridAdapterService.setFocusedElementById(parentElement, 'child');

      expect(document.activeElement).toEqual(childElement);
    });
  });

  describe('getFocusedElement', () => {
    it('should return the element that currently has focus', () => {
      parentElement.focus();

      expect(agGridAdapterService.getFocusedElement()).toEqual(parentElement);
    });
  });

  describe('focusOnFocusableChildren', () => {
    it('should move focus to the first focusable child if there is one', () => {
      parentElement.focus();

      agGridAdapterService.focusOnFocusableChildren(parentElement);

      expect(document.activeElement).toEqual(childElement);
    });

    it('should leave focus on the given element if it has no focusable children', () => {
      childElement.focus();

      agGridAdapterService.focusOnFocusableChildren(childElement);

      expect(document.activeElement).toEqual(childElement);
    });
  });
});

import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { TextExpandRepeaterTestComponent } from './fixtures/text-expand-repeater.component.fixture';
import { TextExpandRepeaterFixturesModule } from './fixtures/text-expand-repeater.module.fixture';

describe('Text expand repeater component', () => {
  let fixture: ComponentFixture<TextExpandRepeaterTestComponent>;
  let cmp: TextExpandRepeaterTestComponent;
  let el: HTMLElement;

  function clickTextExpandButton(buttonElem: HTMLElement) {
    buttonElem.click();
    fixture.detectChanges();
    tick(20);
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TextExpandRepeaterFixturesModule],
    });

    fixture = TestBed.createComponent(TextExpandRepeaterTestComponent);
    cmp = fixture.componentInstance as TextExpandRepeaterTestComponent;
    el = fixture.nativeElement as HTMLElement;
  });

  describe('basic behaviors', () => {
    it('should have necessary aria properties', fakeAsync(() => {
      cmp.data = ['john', 'bob', 'hank'];
      cmp.numItems = 2;

      fixture.detectChanges();
      const buttonElem = el.querySelector(
        '.sky-text-expand-repeater-see-more'
      ) as HTMLElement;

      expect(buttonElem.getAttribute('aria-expanded')).toBe('false');
      expect(buttonElem.getAttribute('aria-controls')).toBe(
        cmp.textExpand.first.contentSectionId
      );

      clickTextExpandButton(buttonElem);

      expect(buttonElem.getAttribute('aria-expanded')).toBe('true');
      expect(buttonElem.getAttribute('aria-controls')).toBe(
        cmp.textExpand.first.contentSectionId
      );
    }));

    it('should not have see more button if data is less than or equal to max items', () => {
      cmp.data = ['john', 'bob'];
      cmp.numItems = 2;

      fixture.detectChanges();

      const seeMoreButton: any = el.querySelector(
        '.sky-text-expand-repeater-see-more'
      );
      expect(seeMoreButton).toBeNull();
    });

    it('should have see more button if data is more than max items', () => {
      cmp.data = ['john', 'bob', 'hank'];
      cmp.numItems = 2;

      fixture.detectChanges();
      const seeMoreButton: any = el.querySelector(
        '.sky-text-expand-repeater-see-more'
      );
      expect(seeMoreButton).not.toBeNull();
      expect(seeMoreButton.innerText.trim()).toBe('See more');
    });

    it('should not have see more button or data if long data is changed to undefined', () => {
      cmp.data = ['john', 'bob', 'hank'];
      cmp.numItems = 2;

      fixture.detectChanges();
      let seeMoreButton: any = el.querySelector(
        '.sky-text-expand-repeater-see-more'
      );
      let displayedItems: NodeListOf<Element> = el.querySelectorAll(
        '.sky-text-expand-repeater-item'
      );
      expect(displayedItems.length).toBe(3);
      expect(seeMoreButton).not.toBeNull();
      expect(seeMoreButton.innerText.trim()).toBe('See more');

      cmp.data = undefined;

      fixture.detectChanges();
      displayedItems = el.querySelectorAll('.sky-text-expand-repeater-item');
      expect(displayedItems.length).toBe(0);
      seeMoreButton = el.querySelector('.sky-text-expand-repeater-see-more');
      expect(seeMoreButton).toBeNull();
    });

    it('should have see more button or data if long data is changed to undefined and back', () => {
      cmp.data = ['john', 'bob', 'hank'];
      cmp.numItems = 2;

      fixture.detectChanges();
      let seeMoreButton: any = el.querySelector(
        '.sky-text-expand-repeater-see-more'
      );
      let displayedItems: NodeListOf<Element> = el.querySelectorAll(
        '.sky-text-expand-repeater-item'
      );
      expect(displayedItems.length).toBe(3);
      expect(seeMoreButton).not.toBeNull();
      expect(seeMoreButton.innerText.trim()).toBe('See more');

      cmp.data = undefined;

      fixture.detectChanges();
      displayedItems = el.querySelectorAll('.sky-text-expand-repeater-item');
      expect(displayedItems.length).toBe(0);
      seeMoreButton = el.querySelector('.sky-text-expand-repeater-see-more');
      expect(seeMoreButton).toBeNull();

      cmp.data = ['john', 'bob', 'hank'];

      fixture.detectChanges();
      seeMoreButton = el.querySelector('.sky-text-expand-repeater-see-more');
      displayedItems = el.querySelectorAll('.sky-text-expand-repeater-item');
      expect(displayedItems.length).toBe(3);
      expect(seeMoreButton).not.toBeNull();
      expect(seeMoreButton.innerText.trim()).toBe('See more');
    });

    it('should not have see more button or data if long data is changed to shorter data', () => {
      cmp.data = ['john', 'bob', 'hank'];
      cmp.numItems = 2;

      fixture.detectChanges();
      let seeMoreButton: any = el.querySelector(
        '.sky-text-expand-repeater-see-more'
      );
      let displayedItems: NodeListOf<Element> = el.querySelectorAll(
        '.sky-text-expand-repeater-item'
      );
      expect(displayedItems.length).toBe(3);
      expect(seeMoreButton).not.toBeNull();
      expect(seeMoreButton.innerText.trim()).toBe('See more');

      cmp.data = ['john', 'bob'];

      fixture.detectChanges();
      displayedItems = el.querySelectorAll('.sky-text-expand-repeater-item');
      expect(displayedItems.length).toBe(2);
      seeMoreButton = el.querySelector('.sky-text-expand-repeater-see-more');
      expect(seeMoreButton).toBeNull();
    });

    it(`should set class on see more button when listStyle property is set to none`, () => {
      cmp.data = ['john', 'bob', 'hank'];
      cmp.numItems = 2;
      cmp.listStyle = 'unstyled';
      fixture.detectChanges();
      const seeMoreButton: any = el.querySelector(
        '.sky-text-expand-repeater-see-more'
      );
      expect(seeMoreButton).toHaveCssClass(
        'sky-text-expand-repeater-see-more-list-style-none'
      );
    });

    it(`should use an unordered list when listStyle property is not set`, () => {
      cmp.data = ['john', 'bob', 'hank'];
      cmp.numItems = 2;
      fixture.detectChanges();
      const contentSection: any = el.querySelector(
        'ul.sky-text-expand-repeater-container'
      );
      expect(contentSection).toExist();
    });

    it(`should use an ordered list when listStyle property is set to ordered`, () => {
      cmp.data = ['john', 'bob', 'hank'];
      cmp.numItems = 2;
      cmp.listStyle = 'ordered';
      fixture.detectChanges();
      const contentSection: any = el.querySelector(
        'ol.sky-text-expand-repeater-container'
      );
      expect(contentSection).toExist();
    });

    it('should expand and collapse correctly', fakeAsync(() => {
      cmp.data = ['john', 'bob', 'hank'];
      cmp.numItems = 2;

      const shownItemsSelector =
        '.sky-text-expand-repeater-item:not([style*="display: none"])';
      const hiddenItemsSelector =
        '.sky-text-expand-repeater-item[style*="display: none"]';

      fixture.detectChanges();
      const container: HTMLElement = document.querySelector(
        '.sky-text-expand-repeater-container'
      );
      let seeMoreButton: any = el.querySelector(
        '.sky-text-expand-repeater-see-more'
      );
      let shownItems: any = el.querySelectorAll(shownItemsSelector);
      let hiddenItems: any = el.querySelectorAll(hiddenItemsSelector);
      expect(seeMoreButton).not.toBeNull();
      expect(seeMoreButton.innerText.trim()).toBe('See more');
      expect(shownItems.length).toBe(2);
      expect(hiddenItems.length).toBe(1);

      clickTextExpandButton(seeMoreButton);

      shownItems = el.querySelectorAll(shownItemsSelector);
      hiddenItems = el.querySelectorAll(hiddenItemsSelector);
      seeMoreButton = el.querySelector('.sky-text-expand-repeater-see-more');
      expect(container.style.maxHeight).toBe('');
      expect(seeMoreButton.innerText.trim()).toBe('See less');
      expect(shownItems.length).toBe(3);
      expect(hiddenItems.length).toBe(0);

      clickTextExpandButton(seeMoreButton);

      shownItems = el.querySelectorAll(shownItemsSelector);
      hiddenItems = el.querySelectorAll(hiddenItemsSelector);
      seeMoreButton = el.querySelector('.sky-text-expand-repeater-see-more');
      expect(container.style.minHeight).toBe('');
      expect(seeMoreButton.innerText.trim()).toBe('See more');
      expect(shownItems.length).toBe(2);
      expect(hiddenItems.length).toBe(1);
    }));

    it('should not display anything if no value is given for the text', () => {
      cmp.data = undefined;
      cmp.numItems = 2;

      fixture.detectChanges();

      const seeMoreButton: any = el.querySelector(
        '.sky-text-expand-repeater-see-more'
      );
      const items: any = el.querySelectorAll('.sky-text-expand-repeater-item');
      expect(seeMoreButton).toBeNull();
      expect(items.length).toBe(0);
    });

    it('should be accessible', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });

  describe('custom templates', () => {
    it('should display custom repeater elements', () => {
      cmp.data = ['john', 'bob', 'hank'];
      cmp.customTemplateData = [
        {
          text: 'john',
          number: 1,
        },
        {
          text: 'bob',
          number: 2,
        },
        {
          text: 'hank',
          number: 3,
        },
      ];
      cmp.numItems = 2;

      fixture.detectChanges();

      const repeaters: NodeListOf<Element> = el.querySelectorAll(
        '.sky-text-expand-repeater'
      );
      const templateEls: NodeListOf<Element> = el.querySelectorAll(
        '.sky-test-custom-template'
      );

      expect(repeaters.length).toBe(2);
      expect(templateEls.length).toBe(3);
      expect(templateEls.item(0).innerHTML.trim()).toBe('john 1');
      expect(templateEls.item(1).innerHTML.trim()).toBe('bob 2');
      expect(templateEls.item(2).innerHTML.trim()).toBe('hank 3');
    });
  });
});

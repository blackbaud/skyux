import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { TextExpandTestComponent } from './fixtures/text-expand.component.fixture';
import { TextExpandFixturesModule } from './fixtures/text-expand.module.fixture';

describe('Text expand component', () => {
  const SHORT_TEXT =
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu';
  const SHORT_TEXT_WITH_NEWLINES =
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\nAenean commodo ligula eget dolor. Aenean massa.\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu';
  const LONG_TEXT =
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.';
  const LONG_TEXT_WITH_NEWLINES =
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\nAenean commodo ligula eget dolor. Aenean massa.\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.';
  const LONGER_TEXT =
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec foo bar.';
  const VERY_LONG_TEXT =
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies';
  const COLLAPSED_TEXT =
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec';

  let fixture: ComponentFixture<TextExpandTestComponent>;
  let cmp: TextExpandTestComponent;
  let el: HTMLElement;

  async function clickTextExpandButton(buttonElem: HTMLElement | null) {
    buttonElem?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TextExpandFixturesModule],
    });

    fixture = TestBed.createComponent(TextExpandTestComponent);
    cmp = fixture.componentInstance as TextExpandTestComponent;
    el = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('basic behaviors', () => {
    it('should have necessary aria properties', async () => {
      cmp.text = LONG_TEXT;

      fixture.detectChanges();
      const buttonElem = el.querySelector(
        '.sky-text-expand-see-more',
      ) as HTMLElement | null;

      expect(buttonElem?.getAttribute('aria-expanded')).toBe('false');
      expect(buttonElem?.getAttribute('aria-controls')).toBe(
        cmp.textExpand?.contentSectionId,
      );
      expect(buttonElem?.getAttribute('aria-haspopup')).toBeNull();

      await clickTextExpandButton(buttonElem);

      expect(buttonElem?.getAttribute('aria-expanded')).toBe('true');
      expect(buttonElem?.getAttribute('aria-controls')).toBe(
        cmp.textExpand?.contentSectionId,
      );
      expect(buttonElem?.getAttribute('aria-haspopup')).toBeNull();

      cmp.text = VERY_LONG_TEXT;
      fixture.detectChanges();

      expect(buttonElem?.getAttribute('aria-expanded')).toBeNull();
      expect(buttonElem?.getAttribute('aria-controls')).toBeNull();
      expect(buttonElem?.getAttribute('aria-haspopup')).toBe('dialog');
    });

    it('should not have see more button or ellipsis if text is short', () => {
      cmp.text = SHORT_TEXT;

      fixture.detectChanges();

      const ellipsis: HTMLElement | null = el.querySelector(
        '.sky-text-expand-ellipsis',
      );
      const seeMoreButton: HTMLElement | null = el.querySelector(
        '.sky-text-expand-see-more',
      );
      expect(ellipsis).toBeNull();
      expect(seeMoreButton).toBeNull();
    });

    it('should default to a max length of 200 when the max length is given as undefined', () => {
      cmp.text = LONG_TEXT;
      cmp.maxLength = undefined;

      fixture.detectChanges();

      const ellipsis: HTMLElement | null = el.querySelector(
        '.sky-text-expand-ellipsis',
      );
      const seeMoreButton: HTMLElement | null = el.querySelector(
        '.sky-text-expand-see-more',
      );
      expect(ellipsis).not.toBeNull();
      expect(seeMoreButton).not.toBeNull();
    });

    it('should not have see more button or ellipsis if text is long but less than the set max length', () => {
      cmp.text = LONGER_TEXT;
      cmp.maxLength = 400;

      fixture.detectChanges();

      const ellipsis: HTMLElement | null = el.querySelector(
        '.sky-text-expand-ellipsis',
      );
      const seeMoreButton: HTMLElement | null = el.querySelector(
        '.sky-text-expand-see-more',
      );
      expect(ellipsis).toBeNull();
      expect(seeMoreButton).toBeNull();
    });

    it('should have the see more button and ellipsis if text is longer', () => {
      cmp.text = LONG_TEXT;

      fixture.detectChanges();
      const ellipsis: HTMLElement | null = el.querySelector(
        '.sky-text-expand-ellipsis',
      );
      const seeMoreButton: HTMLElement | null = el.querySelector(
        '.sky-text-expand-see-more',
      );
      expect(ellipsis).not.toBeNull();
      expect(seeMoreButton).not.toBeNull();
      expect(seeMoreButton?.innerText.trim()).toBe('See more');
    });

    it('should not have a see more button if changed from long text to undefined', () => {
      cmp.text = LONG_TEXT;

      fixture.detectChanges();
      let ellipsis: HTMLElement | null = el.querySelector(
        '.sky-text-expand-ellipsis',
      );
      let seeMoreButton: HTMLElement | null = el.querySelector(
        '.sky-text-expand-see-more',
      );
      expect(ellipsis).not.toBeNull();
      expect(seeMoreButton).not.toBeNull();
      expect(seeMoreButton?.innerText.trim()).toBe('See more');

      cmp.text = undefined;

      fixture.detectChanges();
      ellipsis = el.querySelector('.sky-text-expand-ellipsis');
      seeMoreButton = el.querySelector('.sky-text-expand-see-more');
      expect(ellipsis).toBeNull();
      expect(seeMoreButton).toBeNull();
    });

    it('should have a see more button if changed from long text to undefined and back', () => {
      cmp.text = LONG_TEXT;

      fixture.detectChanges();
      let ellipsis: HTMLElement | null = el.querySelector(
        '.sky-text-expand-ellipsis',
      );
      let seeMoreButton: HTMLElement | null = el.querySelector(
        '.sky-text-expand-see-more',
      );
      expect(ellipsis).not.toBeNull();
      expect(seeMoreButton).not.toBeNull();
      expect(seeMoreButton?.innerText.trim()).toBe('See more');

      cmp.text = undefined;

      fixture.detectChanges();
      ellipsis = el.querySelector('.sky-text-expand-ellipsis');
      seeMoreButton = el.querySelector('.sky-text-expand-see-more');
      expect(ellipsis).toBeNull();
      expect(seeMoreButton).toBeNull();

      cmp.text = LONG_TEXT;

      fixture.detectChanges();
      ellipsis = el.querySelector('.sky-text-expand-ellipsis');
      seeMoreButton = el.querySelector('.sky-text-expand-see-more');
      expect(ellipsis).not.toBeNull();
      expect(seeMoreButton).not.toBeNull();
      expect(seeMoreButton?.innerText.trim()).toBe('See more');
    });

    it('should not have a see more button if changed from long text to short text', () => {
      cmp.text = LONG_TEXT;

      fixture.detectChanges();
      let ellipsis: HTMLElement | null = el.querySelector(
        '.sky-text-expand-ellipsis',
      );
      let seeMoreButton: HTMLElement | null = el.querySelector(
        '.sky-text-expand-see-more',
      );
      expect(ellipsis).not.toBeNull();
      expect(seeMoreButton).not.toBeNull();
      expect(seeMoreButton?.innerText.trim()).toBe('See more');

      cmp.text = SHORT_TEXT;

      fixture.detectChanges();
      ellipsis = el.querySelector('.sky-text-expand-ellipsis');
      seeMoreButton = el.querySelector('.sky-text-expand-see-more');
      expect(ellipsis).toBeNull();
      expect(seeMoreButton).toBeNull();
    });

    it('should not display anything if no value is given for the text', () => {
      cmp.text = undefined;

      fixture.detectChanges();

      const ellipsis: HTMLElement | null = el.querySelector(
        '.sky-text-expand-ellipsis',
      );
      const seeMoreButton: HTMLElement | null = el.querySelector(
        '.sky-text-expand-see-more',
      );
      const textArea: HTMLElement | null = el.querySelector(
        '.sky-text-expand-text',
      );
      expect(ellipsis).toBeNull();
      expect(seeMoreButton).toBeNull();
      expect(textArea?.innerText.trim()).toBe('');
    });

    it('should have the see more button or ellipsis if text is short but has newlines', () => {
      cmp.text = SHORT_TEXT_WITH_NEWLINES;

      fixture.detectChanges();

      const ellipsis: HTMLElement | null = el.querySelector(
        '.sky-text-expand-ellipsis',
      );
      const seeMoreButton: HTMLElement | null = el.querySelector(
        '.sky-text-expand-see-more',
      );
      expect(ellipsis).not.toBeNull();
      expect(seeMoreButton).not.toBeNull();
      expect(seeMoreButton?.innerText.trim()).toBe('See more');
    });

    it('should expand on click of the see more button', async () => {
      const expandedText = LONG_TEXT;
      cmp.text = expandedText;
      const collapsedText = COLLAPSED_TEXT;

      fixture.detectChanges();

      let ellipsis: HTMLElement | null = el.querySelector(
        '.sky-text-expand-ellipsis',
      );
      const seeMoreButton: HTMLElement | null = el.querySelector(
        '.sky-text-expand-see-more',
      );
      let textArea: HTMLElement | null = el.querySelector(
        '.sky-text-expand-text',
      );
      const container: HTMLElement | null = el.querySelector(
        '.sky-text-expand-container',
      );
      expect(ellipsis).not.toBeNull();
      expect(seeMoreButton?.innerText.trim()).toBe('See more');
      expect(textArea?.innerText.trim()).toBe(collapsedText);

      await clickTextExpandButton(seeMoreButton);

      ellipsis = el.querySelector('.sky-text-expand-ellipsis');
      textArea = el.querySelector('.sky-text-expand-text');

      expect(container?.style.maxHeight).toBe('');
      expect(seeMoreButton?.innerText.trim()).toBe('See less');
      expect(ellipsis).toBeNull();
      expect(textArea?.innerText.trim()).toBe(expandedText);

      await clickTextExpandButton(seeMoreButton);

      ellipsis = el.querySelector('.sky-text-expand-ellipsis');
      textArea = el.querySelector('.sky-text-expand-text');

      expect(container?.style.maxHeight).toBe('');
      expect(seeMoreButton?.innerText.trim()).toBe('See more');
      expect(ellipsis).not.toBeNull();
      expect(textArea?.innerText.trim()).toBe(collapsedText);
    });

    it('should render newlines if requested', () => {
      cmp.text = SHORT_TEXT_WITH_NEWLINES;
      cmp.truncateNewlines = false;

      fixture.detectChanges();

      const ellipsis: HTMLElement | null = el.querySelector(
        '.sky-text-expand-ellipsis',
      );
      const seeMoreButton: HTMLElement | null = el.querySelector(
        '.sky-text-expand-see-more',
      );
      expect(ellipsis).toBeNull();
      expect(seeMoreButton).toBeNull();
    });

    it('should expand text when the maxLength property is set', () => {
      cmp.text = SHORT_TEXT_WITH_NEWLINES;
      cmp.maxLength = 10;

      fixture.detectChanges();

      expect(el.textContent?.trim()).toContain('See more');
      expect(el.textContent?.trim()).not.toContain(cmp.text.trim());

      cmp.maxLength = cmp.text.length + 100;

      fixture.detectChanges();

      expect(el.textContent?.trim()).toContain(
        cmp.text.replace(/(?:\r\n|\r|\n)/g, ' '),
      );
    });

    it('should be accessible', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });

  describe('modal behaviors', () => {
    it('should open a modal when looking at very long text', () => {
      const expandedText = VERY_LONG_TEXT;
      cmp.text = expandedText;
      const collapsedText = COLLAPSED_TEXT;

      fixture.detectChanges();

      const ellipsis: HTMLElement | null = el.querySelector(
        '.sky-text-expand-ellipsis',
      );
      const seeMoreButton: HTMLElement | null = el.querySelector(
        '.sky-text-expand-see-more',
      );
      const textArea: HTMLElement | null = el.querySelector(
        '.sky-text-expand-text',
      );
      let modal = document.querySelector('.sky-modal');

      expect(ellipsis).not.toBeNull();
      expect(modal).toBeNull();
      expect(seeMoreButton?.innerText.trim()).toBe('See more');
      expect(textArea?.innerText.trim()).toBe(collapsedText);

      seeMoreButton?.click();
      fixture.detectChanges();

      modal = document.querySelector('.sky-modal');
      const modalHeader: HTMLElement | null =
        document.querySelector('sky-modal-heading');
      const modalContent: HTMLElement | null =
        document.querySelector('sky-modal-content');
      const closeButton: HTMLElement | null = document.querySelector(
        'sky-modal-footer button',
      );

      expect(modal).not.toBeNull();
      expect(modalHeader?.innerText.trim()).toBe('Expanded view');
      expect(modalContent?.innerText.trim()).toBe(expandedText);
      expect(closeButton?.innerText.trim()).toBe('Close');

      closeButton?.click();
      fixture.detectChanges();

      modal = document.querySelector('.sky-modal');

      expect(modal).toBeNull();
    });

    it('should open a modal when looking at long text with a shorter max expanded length', () => {
      const expandedText = LONG_TEXT;
      cmp.text = expandedText;
      cmp.maxExpandedLength = 299;
      const collapsedText = COLLAPSED_TEXT;

      fixture.detectChanges();

      const ellipsis: HTMLElement | null = el.querySelector(
        '.sky-text-expand-ellipsis',
      );
      const seeMoreButton: HTMLElement | null = el.querySelector(
        '.sky-text-expand-see-more',
      );
      const textArea: HTMLElement | null = el.querySelector(
        '.sky-text-expand-text',
      );
      let modal = document.querySelector('.sky-modal');

      expect(ellipsis).not.toBeNull();
      expect(modal).toBeNull();
      expect(seeMoreButton?.innerText.trim()).toBe('See more');
      expect(textArea?.innerText.trim()).toBe(collapsedText);

      seeMoreButton?.click();
      fixture.detectChanges();

      modal = document.querySelector('.sky-modal');
      const modalHeader: HTMLElement | null =
        document.querySelector('sky-modal-heading');
      const modalContent: HTMLElement | null =
        document.querySelector('sky-modal-content');
      const closeButton: HTMLElement | null = document.querySelector(
        'sky-modal-footer button',
      );

      expect(modal).not.toBeNull();
      expect(modalHeader?.innerText.trim()).toBe('Expanded view');
      expect(modalContent?.innerText.trim()).toBe(expandedText);
      expect(closeButton?.innerText.trim()).toBe('Close');

      closeButton?.click();
      fixture.detectChanges();

      modal = document.querySelector('.sky-modal');

      expect(modal).toBeNull();

      cmp.maxExpandedLength = undefined;
      fixture.detectChanges();

      modal = document.querySelector('.sky-modal');

      expect(ellipsis).not.toBeNull();
      expect(modal).toBeNull();
      expect(seeMoreButton?.innerText.trim()).toBe('See more');
      expect(textArea?.innerText.trim()).toBe(collapsedText);

      seeMoreButton?.click();
      fixture.detectChanges();

      modal = document.querySelector('.sky-modal');

      expect(modal).toBeNull();
    });

    it('should open a modal when the maximum newlines is exceeded', () => {
      const expandedText = LONG_TEXT_WITH_NEWLINES;
      cmp.maxExpandedNewlines = 1;
      cmp.text = expandedText;
      const collapsedText = COLLAPSED_TEXT;

      fixture.detectChanges();

      const ellipsis: HTMLElement | null = el.querySelector(
        '.sky-text-expand-ellipsis',
      );
      const seeMoreButton: HTMLElement | null = el.querySelector(
        '.sky-text-expand-see-more',
      );
      const textArea: HTMLElement | null = el.querySelector(
        '.sky-text-expand-text',
      );
      let modal = document.querySelector('.sky-modal');

      expect(ellipsis).not.toBeNull();
      expect(modal).toBeNull();
      expect(seeMoreButton?.innerText.trim()).toBe('See more');
      expect(textArea?.innerText.trim()).toBe(collapsedText);

      seeMoreButton?.click();
      fixture.detectChanges();

      modal = document.querySelector('.sky-modal');
      const modalHeader: HTMLElement | null =
        document.querySelector('sky-modal-heading');
      const modalContent: HTMLElement | null =
        document.querySelector('sky-modal-content');
      const closeButton: HTMLElement | null = document.querySelector(
        'sky-modal-footer button',
      );

      expect(modal).not.toBeNull();
      expect(modalHeader?.innerText.trim()).toBe('Expanded view');
      expect(modalContent?.innerText.trim()).toBe(expandedText);
      expect(closeButton?.innerText.trim()).toBe('Close');

      closeButton?.click();
      fixture.detectChanges();

      modal = document.querySelector('.sky-modal');

      expect(modal).toBeNull();

      cmp.maxExpandedNewlines = undefined;
      cmp.text = expandedText;

      fixture.detectChanges();
      modal = document.querySelector('.sky-modal');

      expect(ellipsis).not.toBeNull();
      expect(modal).toBeNull();
      expect(seeMoreButton?.innerText.trim()).toBe('See more');
      expect(textArea?.innerText.trim()).toBe(collapsedText);

      seeMoreButton?.click();
      fixture.detectChanges();

      modal = document.querySelector('.sky-modal');

      expect(modal).toBeNull();
    });
  });
});

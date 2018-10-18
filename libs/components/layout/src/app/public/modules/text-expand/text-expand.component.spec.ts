import {
  TestBed,
  inject,
  fakeAsync,
  tick,
  ComponentFixture,
  async
} from '@angular/core/testing';

import { BrowserModule } from '@angular/platform-browser';

import {
  RouterTestingModule
} from '@angular/router/testing';

import { SkyWindowRefService } from '@skyux/core/modules/window';
import { TextExpandTestComponent } from './fixtures/text-expand.component.fixture';
import { SkyTextExpandModule } from './text-expand.module';

import {
  SkyModalService,
  SkyModalModule
} from '@skyux/modals/modules/modal';

import {
  expect
} from '@skyux-sdk/testing';

describe('Text expand component', () => {
  const windowRef = new SkyWindowRefService();

  const mockWindowService = {
    getWindow(): any {
      return {
        document: windowRef.getWindow().document,
        setTimeout: (cb: Function) => cb()
      };
    }
  };

  // tslint:disable
  const SHORT_TEXT = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu';
  const SHORT_TEXT_WITH_NEWLINES = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\nAenean commodo ligula eget dolor. Aenean massa.\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu';
  const LONG_TEXT = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.';
  const LONGER_TEXT = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec foo bar.';
  const VERY_LONG_TEXT = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies';
  const COLLAPSED_TEXT = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec';
  // tslint:enable

  function clickTextExpandButton(buttonElem: HTMLElement, fixture: ComponentFixture<TextExpandTestComponent>) {
    buttonElem.click();
    fixture.detectChanges();
    tick(20);
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();
  }

  let fixture: ComponentFixture<TextExpandTestComponent>;
  let cmp: TextExpandTestComponent;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TextExpandTestComponent
      ],
      imports: [
        BrowserModule,
        RouterTestingModule,
        SkyTextExpandModule,
        SkyModalModule
      ],
      providers: [
        { provide: SkyWindowRefService, useValue: mockWindowService }
      ]
    });

    fixture = TestBed.createComponent(TextExpandTestComponent);
    cmp = fixture.componentInstance as TextExpandTestComponent;
    el = fixture.nativeElement as HTMLElement;
  });

  beforeEach(
    inject(
      [
        SkyModalService
      ],
      (
        _modalService: SkyModalService
      ) => {
        _modalService.dispose();
      }
    )
  );

  describe('basic behaviors', () => {

    it('should have necessary aria properties', fakeAsync(() => {
      // tslint:disable-next-line
      cmp.text = LONG_TEXT;

      fixture.detectChanges();
      const buttonElem = <HTMLElement>el.querySelector('.sky-text-expand-see-more');

      expect(buttonElem.getAttribute('aria-expanded')).toBe('false');
      expect(buttonElem.getAttribute('aria-controls')).toBe(cmp.textExpand.contentSectionId);
      expect(buttonElem.getAttribute('aria-haspopup')).toBeNull();

      clickTextExpandButton(buttonElem, fixture);

      expect(buttonElem.getAttribute('aria-expanded')).toBe('true');
      expect(buttonElem.getAttribute('aria-controls')).toBe(cmp.textExpand.contentSectionId);
      expect(buttonElem.getAttribute('aria-haspopup')).toBeNull();

      // tslint:disable-next-line
      cmp.text = VERY_LONG_TEXT;
      fixture.detectChanges();

      expect(buttonElem.getAttribute('aria-expanded')).toBeNull();
      expect(buttonElem.getAttribute('aria-controls')).toBeNull();
      expect(buttonElem.getAttribute('aria-haspopup')).toBe('dialog');
    }));

    it('should not have see more button or ellipsis if text is short', () => {
      // tslint:disable-next-line
      cmp.text = SHORT_TEXT;

      fixture.detectChanges();

      let ellipsis: any = el.querySelector('.sky-text-expand-ellipsis');
      let seeMoreButton: any = el.querySelector('.sky-text-expand-see-more');
      expect(ellipsis).toBeNull();
      expect(seeMoreButton).toBeNull();
    });

    // tslint:disable-next-line
    it('should not have see more button or ellipsis if text is long but less than the set max length', () => {
      // tslint:disable-next-line
      cmp.text = LONGER_TEXT;
      cmp.maxLength = 400;

      fixture.detectChanges();

      let ellipsis: any = el.querySelector('.sky-text-expand-ellipsis');
      let seeMoreButton: any = el.querySelector('.sky-text-expand-see-more');
      expect(ellipsis).toBeNull();
      expect(seeMoreButton).toBeNull();
    });

    it('should have the see more button and ellipsis if text is longer', () => {
      // tslint:disable-next-line
      cmp.text = LONG_TEXT;

      fixture.detectChanges();
      let ellipsis: any = el.querySelector('.sky-text-expand-ellipsis');
      let seeMoreButton: any = el.querySelector('.sky-text-expand-see-more');
      expect(ellipsis).not.toBeNull();
      expect(seeMoreButton).not.toBeNull();
      expect(seeMoreButton.innerText.trim()).toBe('See more');
    });

    it('should not have a see more button if changed from long text to undefined', () => {
      // tslint:disable-next-line
      cmp.text = LONG_TEXT;

      fixture.detectChanges();
      let ellipsis: any = el.querySelector('.sky-text-expand-ellipsis');
      let seeMoreButton: any = el.querySelector('.sky-text-expand-see-more');
      expect(ellipsis).not.toBeNull();
      expect(seeMoreButton).not.toBeNull();
      expect(seeMoreButton.innerText.trim()).toBe('See more');

      cmp.text = undefined;

      fixture.detectChanges();
      ellipsis = el.querySelector('.sky-text-expand-ellipsis');
      seeMoreButton = el.querySelector('.sky-text-expand-see-more');
      expect(ellipsis).toBeNull();
      expect(seeMoreButton).toBeNull();
    });

    it('should have a see more button if changed from long text to undefined and back', () => {
      // tslint:disable-next-line
      cmp.text = LONG_TEXT;

      fixture.detectChanges();
      let ellipsis: any = el.querySelector('.sky-text-expand-ellipsis');
      let seeMoreButton: any = el.querySelector('.sky-text-expand-see-more');
      expect(ellipsis).not.toBeNull();
      expect(seeMoreButton).not.toBeNull();
      expect(seeMoreButton.innerText.trim()).toBe('See more');

      cmp.text = undefined;

      fixture.detectChanges();
      ellipsis = el.querySelector('.sky-text-expand-ellipsis');
      seeMoreButton = el.querySelector('.sky-text-expand-see-more');
      expect(ellipsis).toBeNull();
      expect(seeMoreButton).toBeNull();

      // tslint:disable-next-line
      cmp.text = LONG_TEXT;

      fixture.detectChanges();
      ellipsis = el.querySelector('.sky-text-expand-ellipsis');
      seeMoreButton = el.querySelector('.sky-text-expand-see-more');
      expect(ellipsis).not.toBeNull();
      expect(seeMoreButton).not.toBeNull();
      expect(seeMoreButton.innerText.trim()).toBe('See more');
    });

    it('should not have a see more button if changed from long text to short text', () => {
      // tslint:disable-next-line
      cmp.text = LONG_TEXT;

      fixture.detectChanges();
      let ellipsis: any = el.querySelector('.sky-text-expand-ellipsis');
      let seeMoreButton: any = el.querySelector('.sky-text-expand-see-more');
      expect(ellipsis).not.toBeNull();
      expect(seeMoreButton).not.toBeNull();
      expect(seeMoreButton.innerText.trim()).toBe('See more');

      // tslint:disable-next-line
      cmp.text = SHORT_TEXT;

      fixture.detectChanges();
      ellipsis = el.querySelector('.sky-text-expand-ellipsis');
      seeMoreButton = el.querySelector('.sky-text-expand-see-more');
      expect(ellipsis).toBeNull();
      expect(seeMoreButton).toBeNull();
    });

    it('should not display anything if no value is given for the text', () => {
      // tslint:disable-next-line
      cmp.text = undefined;

      fixture.detectChanges();

      let ellipsis: any = el.querySelector('.sky-text-expand-ellipsis');
      let seeMoreButton: any = el.querySelector('.sky-text-expand-see-more');
      let textArea: HTMLElement = <HTMLElement>el.querySelector('.sky-text-expand-text');
      expect(ellipsis).toBeNull();
      expect(seeMoreButton).toBeNull();
      expect(textArea.innerText.trim()).toBe('');
    });

    it('should have the see more button or ellipsis if text is short but has newlines', () => {
      // tslint:disable-next-line
      cmp.text = SHORT_TEXT_WITH_NEWLINES;

      fixture.detectChanges();

      let ellipsis: any = el.querySelector('.sky-text-expand-ellipsis');
      let seeMoreButton: any = el.querySelector('.sky-text-expand-see-more');
      expect(ellipsis).not.toBeNull();
      expect(seeMoreButton).not.toBeNull();
      expect(seeMoreButton.innerText.trim()).toBe('See more');
    });

    it('should expand on click of the see more button', fakeAsync(() => {
      // tslint:disable-next-line
      let expandedText = LONG_TEXT;
      cmp.text = expandedText;
      // tslint:disable-next-line
      let collapsedText = COLLAPSED_TEXT;

      fixture.detectChanges();

      let ellipsis: any = el.querySelector('.sky-text-expand-ellipsis');
      let seeMoreButton: any = el.querySelector('.sky-text-expand-see-more');
      let textArea: HTMLElement = <HTMLElement>el.querySelector('.sky-text-expand-text');
      let container: HTMLElement = <HTMLElement>el.querySelector('.sky-text-expand-container');
      expect(ellipsis).not.toBeNull();
      expect(seeMoreButton.innerText.trim()).toBe('See more');
      expect(textArea.innerText.trim()).toBe(collapsedText);

      clickTextExpandButton(seeMoreButton, fixture);

      ellipsis = el.querySelector('.sky-text-expand-ellipsis');
      textArea = <HTMLElement>el.querySelector('.sky-text-expand-text');

      expect(container.style.maxHeight).toBe('');
      expect(seeMoreButton.innerText.trim())
        .toBe('See less');
      expect(ellipsis).toBeNull();
      expect(textArea.innerText.trim()).toBe(expandedText);

      clickTextExpandButton(seeMoreButton, fixture);

      ellipsis = el.querySelector('.sky-text-expand-ellipsis');
      textArea = <HTMLElement>el.querySelector('.sky-text-expand-text');

      expect(container.style.maxHeight).toBe('');
      expect(seeMoreButton.innerText.trim())
        .toBe('See more');
      expect(ellipsis).not.toBeNull();
      expect(textArea.innerText.trim()).toBe(collapsedText);

    }));

    it('should render newlines if requested', () => {
      // tslint:disable-next-line
      cmp.text = SHORT_TEXT_WITH_NEWLINES;
      cmp.truncateNewlines = false;

      fixture.detectChanges();

      let ellipsis: any = el.querySelector('.sky-text-expand-ellipsis');
      let seeMoreButton: any = el.querySelector('.sky-text-expand-see-more');
      expect(ellipsis).toBeNull();
      expect(seeMoreButton).toBeNull();
    });

    it('should expand text when the maxLength property is set', () => {
      // tslint:disable-next-line
      cmp.text = SHORT_TEXT_WITH_NEWLINES;
      cmp.maxLength = 10;

      fixture.detectChanges();

      expect(el.textContent.trim()).toContain('See more');
      expect(el.textContent.trim()).not.toContain(cmp.text.trim());

      cmp.maxLength = cmp.text.length + 100;

      fixture.detectChanges();

      expect(el.textContent.trim()).toContain(cmp.text.replace(/(?:\r\n|\r|\n)/g, ' '));
    });

    it('should be accessible', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });

  describe('modal behaviors', () => {
    it('should open a modal when looking at very long text', () => {
      // tslint:disable-next-line
      let expandedText = VERY_LONG_TEXT;
      cmp.text = expandedText;
      // tslint:disable-next-line
      let collapsedText = COLLAPSED_TEXT;

      fixture.detectChanges();

      let ellipsis: any = el.querySelector('.sky-text-expand-ellipsis');
      let seeMoreButton: any = el.querySelector('.sky-text-expand-see-more');
      let textArea: HTMLElement = <HTMLElement>el.querySelector('.sky-text-expand-text');
      let modal = document.querySelector('.sky-modal');

      expect(ellipsis).not.toBeNull();
      expect(modal).toBeNull();
      expect(seeMoreButton.innerText.trim()).toBe('See more');
      expect(textArea.innerText.trim()).toBe(collapsedText);

      seeMoreButton.click();
      fixture.detectChanges();

      modal = document.querySelector('.sky-modal');
      let modalHeader: HTMLElement = <HTMLElement>document.querySelector('sky-modal-header');
      let modalContent: HTMLElement = <HTMLElement>document.querySelector('sky-modal-content');
      let closeButton: HTMLElement =
        <HTMLElement>document.querySelector('sky-modal-footer button');

      expect(modal).not.toBeNull();
      expect(modalHeader.innerText.trim())
        .toBe('Expanded view');
      expect(modalContent.innerText.trim())
        .toBe(expandedText);
      expect(closeButton.innerText.trim()).toBe('Close');

      closeButton.click();
      fixture.detectChanges();

      modal = document.querySelector('.sky-modal');

      expect(modal).toBeNull();
    });
  });
});

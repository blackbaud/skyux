import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  FormsModule
} from '@angular/forms';

import {
  expect
} from '@skyux-sdk/testing';

import {
  MutationObserverService
} from '@skyux/core';

import { SkyTextHighlightTestComponent } from './fixtures/text-highlight.component.fixture';
import { SkyTextHighlightModule } from './text-highlight.module';

function updateInputText(fixture: ComponentFixture<SkyTextHighlightTestComponent>, text: string) {
  let params = {
    bubbles: false,
    cancelable: false
  };

  let inputEvent = document.createEvent('Event');
  inputEvent.initEvent('input', params.bubbles, params.cancelable);

  const inputEl = fixture.nativeElement.querySelector('.sky-input-search-term') as HTMLInputElement;
  inputEl.value = text;
  inputEl.dispatchEvent(inputEvent);
  fixture.detectChanges();
}

const additionalTextHidden = `
  <!--bindings={
  "ng-reflect-ng-if": "false"
}-->`;

const additionalTextVisible = `
  <!--bindings={
  "ng-reflect-ng-if": "true"
}-->`;

function getHtmlOutput(text: string) {
  return `${text}${additionalTextHidden}`;
}

function getHtmlOutputAdditionalText(text: string, additionalText: string) {
  return `${text}${additionalTextVisible}<div>
    ${additionalText}
  </div>`;
}

describe('Text Highlight', () => {

  let fixture: ComponentFixture<SkyTextHighlightTestComponent>;
  let component: SkyTextHighlightTestComponent;
  let nativeElement: HTMLElement;
  let callbacks: any[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SkyTextHighlightTestComponent
      ],
      imports: [
        SkyTextHighlightModule,
        FormsModule
      ],
      providers: [{
        provide: MutationObserverService,
        useValue: {
          create: function(callback: Function) {
            callbacks.push(callback);

            return {
              observe: () => {},
              disconnect: () => {}
            };
          }
        }
      }]
    });

    callbacks = [];
    fixture = TestBed.createComponent(SkyTextHighlightTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not highlight any text when search term is blank', async(() => {
    const containerEl = nativeElement.querySelector('.sky-test-div-container');
    const expectedHtml = getHtmlOutput('Here is some test text.');

    expect(containerEl.innerHTML.trim()).toBe(expectedHtml);

    // Accessibility checks
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));

  it('should highlight search term', async(() => {
    updateInputText(fixture, 'text');

    const containerEl = nativeElement.querySelector('.sky-test-div-container') as HTMLElement;
    const expectedHtml =
      getHtmlOutput('Here is some test <mark class="sky-highlight-mark">text</mark>.');

    expect(containerEl.innerHTML.trim()).toBe(expectedHtml);

    // Accessibility checks
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));

  it('should highlight case insensitive search term', () => {
    updateInputText(fixture, 'here');

    const containerEl = nativeElement.querySelector('.sky-test-div-container') as HTMLElement;
    const expectedHtml =
      getHtmlOutput('<mark class="sky-highlight-mark">Here</mark> is some test text.');

    expect(containerEl.innerHTML.trim()).toBe(expectedHtml);
  });

  it('should highlight search term in nested component', () => {
    component.showAdditionalContent = true;
    fixture.detectChanges();

    updateInputText(fixture, 'here');

    const containerEl = nativeElement.querySelector('.sky-test-div-container') as HTMLElement;
    const text = '<mark class="sky-highlight-mark">Here</mark> is some test text.';
    // tslint:disable-next-line:max-line-length
    const additional = '<mark class="sky-highlight-mark">Here</mark> is additional text that was previously hidden in src\\app.';
    const expectedHtml = getHtmlOutputAdditionalText(text, additional);

    expect(containerEl.innerHTML.trim()).toBe(expectedHtml);
  });

  it('should support backslashes in the search term', () => {
    component.showAdditionalContent = true;
    fixture.detectChanges();

    updateInputText(fixture, 'src\\app');

    const containerEl = nativeElement.querySelector('.sky-test-div-container') as HTMLElement;
    const text = 'Here is some test text.';
    const additional = 'Here is additional text that was previously hidden in <mark class="sky-highlight-mark">src\\app</mark>.';
    const expectedHtml = getHtmlOutputAdditionalText(text, additional);

    expect(containerEl.innerHTML.trim()).toBe(expectedHtml);
  });

  it('changed search term should highlight new term and old term should not highlight', () => {
    updateInputText(fixture, 'some');

    const containerEl = nativeElement.querySelector('.sky-test-div-container') as HTMLElement;
    const expectedHtml =
      getHtmlOutput('Here is <mark class="sky-highlight-mark">some</mark> test text.');

    expect(containerEl.innerHTML.trim()).toBe(expectedHtml);

    updateInputText(fixture, 'Here');

    const containerElChanged =
      nativeElement.querySelector('.sky-test-div-container') as HTMLElement;
    const expectedHtmlChanged =
      getHtmlOutput('<mark class="sky-highlight-mark">Here</mark> is some test text.');

    expect(containerElChanged.innerHTML.trim()).toBe(expectedHtmlChanged);
  });

  it('highlight search term of html that was previously hidden', () => {
    component.showAdditionalContent = false;
    fixture.detectChanges();

    updateInputText(fixture, 'is');

    const containerEl = nativeElement.querySelector('.sky-test-div-container') as HTMLElement;
    const expectedHtml =
      getHtmlOutput('Here <mark class="sky-highlight-mark">is</mark> some test text.');

    expect(containerEl.innerHTML.trim()).toBe(expectedHtml);

    // check box to show extra content
    const checkboxEl =
      fixture.nativeElement.querySelector('.sky-test-checkbox') as HTMLInputElement;

    checkboxEl.click();
    fixture.detectChanges();

    // mock the mutation observer callback on DOM change
    callbacks[0](undefined);

    fixture.detectChanges();

    const containerElUpdated =
      nativeElement.querySelector('.sky-test-div-container') as HTMLElement;

    const text = 'Here <mark class="sky-highlight-mark">is</mark> some test text.';
    // tslint:disable-next-line:max-line-length
    const additional = 'Here <mark class="sky-highlight-mark">is</mark> additional text that was previously hidden in src\\app.';
    const expectedHtmlChanged = getHtmlOutputAdditionalText(text, additional);

    expect(containerElUpdated.innerHTML.trim()).toBe(expectedHtmlChanged);
  });

  it('highlight hidden search term where only highlighted term was hidden', () => {
    component.showAdditionalContent = false;
    fixture.detectChanges();

    updateInputText(fixture, 'additional');

    const containerEl = nativeElement.querySelector('.sky-test-div-container') as HTMLElement;
    const expectedHtml =
      getHtmlOutput('Here is some test text.');

    expect(containerEl.innerHTML.trim()).toBe(expectedHtml);

    // check box to show extra content
    const checkboxEl =
      fixture.nativeElement.querySelector('.sky-test-checkbox') as HTMLInputElement;

    checkboxEl.click();
    fixture.detectChanges();

    // mock the mutation observer callback on DOM change
    callbacks[0](undefined);

    fixture.detectChanges();

    const containerElUpdated =
      nativeElement.querySelector('.sky-test-div-container') as HTMLElement;

    const text = 'Here is some test text.';
    // tslint:disable-next-line:max-line-length
    const additional = 'Here is <mark class="sky-highlight-mark">additional</mark> text that was previously hidden in src\\app.';
    const expectedHtmlChanged = getHtmlOutputAdditionalText(text, additional);

    expect(containerElUpdated.innerHTML.trim()).toBe(expectedHtmlChanged);
  });
});

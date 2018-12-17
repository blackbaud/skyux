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

import {
  SkyTextHighlightTestComponent
} from './fixtures/text-highlight.component.fixture';

import {
  SkyTextHighlightModule
} from './text-highlight.module';

function getContainerEl(fixture: ComponentFixture<SkyTextHighlightTestComponent>): HTMLElement {
  return fixture.nativeElement.querySelector('.sky-test-div-container') as HTMLElement;
}

function updateInputText(fixture: ComponentFixture<SkyTextHighlightTestComponent>, text: string): void {
  const params = {
    bubbles: false,
    cancelable: false
  };

  const inputEvent = document.createEvent('Event');
  inputEvent.initEvent('input', params.bubbles, params.cancelable);

  const inputEl = fixture.nativeElement.querySelector('.sky-input-search-term') as HTMLInputElement;
  inputEl.value = text;
  inputEl.dispatchEvent(inputEvent);
  fixture.detectChanges();
}

describe('Text Highlight', () => {

  let fixture: ComponentFixture<SkyTextHighlightTestComponent>;
  let component: SkyTextHighlightTestComponent;
  let nativeElement: HTMLElement;
  let callbacks: any[];
  let containerEl: HTMLElement;

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
          create: function(callback: Function): any {
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
    containerEl = getContainerEl(fixture);
  });

  it('should not highlight any text when search term is blank', async(() => {
    expect(containerEl.querySelector('mark')).toBeFalsy();

    // Accessibility checks
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));

  it('should highlight on startup if search term is set in component', async(() => {
    fixture = TestBed.createComponent(SkyTextHighlightTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;

    component.searchTerm = 'test';
    fixture.detectChanges();
    containerEl = getContainerEl(fixture);

    const mark = containerEl.querySelector('mark');
    expect(mark).toBeTruthy();
    expect(mark.innerHTML.trim()).toBe('test');
  }));

  it('should highlight search term', async(() => {
    updateInputText(fixture, 'text');

    const mark = fixture.nativeElement.querySelector('mark');
    expect(mark).toBeTruthy();
    expect(mark.innerHTML.trim()).toBe('text');

    // Accessibility checks
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));

  it('highlight should NOT be called when DOM attributes are changed', ((done) => {
    const spy = spyOn<any>(component.textHighlightDirective, 'highlight').and.callThrough();

    updateInputText(fixture, 'text');

    const div = nativeElement.querySelector('.sky-test-div-container');
    div.setAttribute('foo', 'bar');
    fixture.detectChanges();

    window.setTimeout(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  }));

  it('should highlight case insensitive search term', () => {
    updateInputText(fixture, 'here');

    const mark = fixture.nativeElement.querySelector('mark');
    expect(mark).toBeTruthy();
    expect(mark.innerHTML.trim()).toBe('Here');
  });

  it('should highlight search term in nested component', () => {
    component.showAdditionalContent = true;
    fixture.detectChanges();
    updateInputText(fixture, 'here');

    const mark = fixture.nativeElement.querySelectorAll('mark');
    expect(mark.length).toBe(2);
    expect(mark[0].innerHTML.trim()).toBe('Here');
    expect(mark[1].innerHTML.trim()).toBe('Here');
  });

  it('should support illegal characters in the search term', () => {
    component.innerText1 = 'foo-\/^$*+?.()|{}[]bar';
    fixture.detectChanges();
    updateInputText(fixture, '-\/^$*+?.()|{}[]');

    const mark = fixture.nativeElement.querySelector('mark');
    expect(mark).toBeTruthy();
    expect(mark.innerHTML.trim()).toBe('-\/^$*+?.()|{}[]');
  });

  it('changed search term should highlight new term and old term should not highlight', () => {
    updateInputText(fixture, 'some');
    let mark = fixture.nativeElement.querySelector('mark');
    expect(mark).toBeTruthy();
    expect(mark.innerHTML.trim()).toBe('some');

    updateInputText(fixture, 'Here');
    mark = fixture.nativeElement.querySelector('mark');
    expect(mark).toBeTruthy();
    expect(mark.innerHTML.trim()).toBe('Here');
  });

  it('highlight search term of html that was previously hidden', () => {
    component.showAdditionalContent = false;
    fixture.detectChanges();

    updateInputText(fixture, 'is');

    const mark = fixture.nativeElement.querySelector('mark');
    expect(mark).toBeTruthy();
    expect(mark.innerHTML.trim()).toBe('is');

    // check box to show extra content
    const checkboxEl =
      fixture.nativeElement.querySelector('.sky-test-checkbox') as HTMLInputElement;

    checkboxEl.click();
    fixture.detectChanges();

    // mock the mutation observer callback on DOM change
    callbacks[0](undefined);
    fixture.detectChanges();

    const marks = fixture.nativeElement.querySelectorAll('mark');
    expect(marks.length).toBe(2);
    expect(marks[0].innerHTML.trim()).toBe('is');
    expect(marks[1].innerHTML.trim()).toBe('is');
  });

  it('highlight hidden search term where only highlighted term was hidden', () => {
    component.showAdditionalContent = false;
    fixture.detectChanges();

    updateInputText(fixture, 'additional');
    let mark = fixture.nativeElement.querySelector('mark');
    expect(mark).toBeFalsy();

    // check box to show extra content
    const checkboxEl =
      fixture.nativeElement.querySelector('.sky-test-checkbox') as HTMLInputElement;

    checkboxEl.click();
    fixture.detectChanges();

    // mock the mutation observer callback on DOM change
    callbacks[0](undefined);
    fixture.detectChanges();

    mark = fixture.nativeElement.querySelector('mark');
    expect(mark).toBeTruthy();
    expect(mark.innerHTML.trim()).toBe('additional');
  });
});

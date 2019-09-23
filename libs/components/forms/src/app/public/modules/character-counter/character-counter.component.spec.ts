import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  CharacterCountTestComponent
} from './fixtures/character-count.component.fixture';

import {
  CharacterCountNoIndicatorTestComponent
} from './fixtures/character-count-no-indicator.component.fixture';

import {
  CharacterCountTestModule
} from './fixtures/character-count.module.fixture';

import {
  SkyCharacterCounterIndicatorComponent
} from './character-counter-indicator.component';

describe('Character Counter component', () => {

  function setInputWithKeyupEvent(
    element: HTMLElement,
    text: string,
    fixture: ComponentFixture<any>
  ): void {
    const inputEl = element.querySelector('input');
    inputEl.value = text;
    fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(inputEl, 'keyup');
    fixture.detectChanges();
    tick();
  }

  function setInputWithInputEvent(
    element: HTMLElement,
    text: string,
    fixture: ComponentFixture<any>
  ): void {
    const inputEl = element.querySelector('input');
    inputEl.value = text;
    fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(inputEl, 'input');
    fixture.detectChanges();
    tick();
  }

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        CharacterCountTestModule
      ]
    });
  });

  describe('standard behavior', () => {
    let fixture: ComponentFixture<CharacterCountTestComponent>;
    let component: CharacterCountTestComponent;
    let nativeElement: HTMLElement;
    let characterCountComponent: SkyCharacterCounterIndicatorComponent;
    let characterCountLabel: HTMLLabelElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(CharacterCountTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;

      fixture.detectChanges();

      characterCountComponent = component.inputDirective.skyCharacterCounterIndicator;
      characterCountLabel = nativeElement.querySelector('.sky-character-count-label') as HTMLLabelElement;
    });

    it('should set the count with the initial length', () => {
      expect(characterCountComponent.characterCount).toBe(4);
      expect(characterCountLabel.innerText.trim()).toBe('4/5');
    });

    it('should update the count on input', fakeAsync(() => {
      setInputWithInputEvent(nativeElement, 'abc', fixture);

      expect(characterCountComponent.characterCount).toBe(3);
      expect(characterCountLabel.innerText.trim()).toBe('3/5');

      setInputWithInputEvent(nativeElement, 'abcd', fixture);

      expect(characterCountComponent.characterCount).toBe(4);
      expect(characterCountLabel.innerText.trim()).toBe('4/5');
    }));

    it('should handle undefined input', fakeAsync(() => {
      const inputEl = nativeElement.querySelector('input');
      /* tslint:disable */
      inputEl.value = null;
      /* tslint:enable */
      fixture.detectChanges();

      SkyAppTestUtility.fireDomEvent(inputEl, 'keyup');
      fixture.detectChanges();
      tick();

      expect(characterCountComponent.characterCount).toBe(0);
      expect(characterCountLabel.innerText.trim()).toBe('0/5');
      expect(component.firstName.valid).toBeTruthy();
    }));

    it('should show the error icon on the character count when appropriate', fakeAsync(() => {
      setInputWithInputEvent(nativeElement, 'abcde', fixture);
      expect(characterCountLabel.classList.contains('sky-error-label')).toBeFalsy();

      setInputWithInputEvent(nativeElement, 'abcdef', fixture);
      expect(characterCountLabel.classList.contains('sky-error-label')).toBeTruthy();
    }));

    it('should show the error detail message when appropriate', fakeAsync(() => {
      setInputWithKeyupEvent(nativeElement, 'abcde', fixture);
      expect(component.firstName.valid).toBeTruthy();

      setInputWithInputEvent(nativeElement, 'abcdef', fixture);
      expect(component.firstName.valid).toBeTruthy();

      setInputWithKeyupEvent(nativeElement, 'abcdef', fixture);
      expect(component.firstName.valid).toBeFalsy();
    }));

    it('should handle changes to max character count', fakeAsync(() => {
      component.setCharacterCountLimit(3);
      fixture.detectChanges();
      expect(component.firstName.valid).toBeFalsy();
      expect(characterCountLabel.classList.contains('sky-error-label')).toBeTruthy();

      component.setCharacterCountLimit(4);
      fixture.detectChanges();
      expect(component.firstName.valid).toBeTruthy();
      expect(characterCountLabel.classList.contains('sky-error-label')).toBeFalsy();
    }));

    it('should pass accessibility', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });

  describe('without count indicator', () => {
    let fixture: ComponentFixture<CharacterCountNoIndicatorTestComponent>;
    let component: CharacterCountNoIndicatorTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(CharacterCountNoIndicatorTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should handle undefined input', fakeAsync(() => {
      const inputEl = nativeElement.querySelector('input');
      /* tslint:disable */
      inputEl.value = null;
      /* tslint:enable */
      fixture.detectChanges();

      SkyAppTestUtility.fireDomEvent(inputEl, 'keyup');
      fixture.detectChanges();
      tick();

      expect(component.firstName.valid).toBeTruthy();
    }));

    it('should show the error detail message when appropriate', fakeAsync(() => {
      setInputWithKeyupEvent(nativeElement, 'abcde', fixture);
      expect(component.firstName.valid).toBeTruthy();

      setInputWithInputEvent(nativeElement, 'abcdef', fixture);
      expect(component.firstName.valid).toBeTruthy();

      setInputWithKeyupEvent(nativeElement, 'abcdef', fixture);
      expect(component.firstName.valid).toBeFalsy();
    }));

    it('should handle changes to max character count', fakeAsync(() => {
      component.setCharacterCountLimit(3);
      fixture.detectChanges();
      expect(component.firstName.valid).toBeFalsy();

      component.setCharacterCountLimit(4);
      fixture.detectChanges();
      expect(component.firstName.valid).toBeTruthy();
    }));

    it('should pass accessibility', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });
});

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';

import { SkyCharacterCounterIndicatorComponent } from './character-counter-indicator.component';
import { CharacterCountNoIndicatorTestComponent } from './fixtures/character-count-no-indicator.component.fixture';
import { CharacterCountTestComponent } from './fixtures/character-count.component.fixture';
import { CharacterCountTestModule } from './fixtures/character-count.module.fixture';

describe('Character Counter component', () => {
  function focusFirstNameInput(
    fixture: ComponentFixture<
      CharacterCountTestComponent | CharacterCountNoIndicatorTestComponent
    >,
  ): void {
    const inputElement = fixture.debugElement.query(
      By.css('#first-name-input'),
    ).nativeElement;
    inputElement.focus();
    SkyAppTestUtility.fireDomEvent(inputElement, 'focusin');
    fixture.detectChanges();
    tick();
  }

  function removeFirstNameFocus(
    fixture: ComponentFixture<
      CharacterCountTestComponent | CharacterCountNoIndicatorTestComponent
    >,
  ): void {
    const inputElement = fixture.debugElement.query(
      By.css('#first-name-input'),
    ).nativeElement;
    SkyAppTestUtility.fireDomEvent(inputElement, 'focusout');
    fixture.detectChanges();
    tick();
  }

  function setInputValue(
    fixture: ComponentFixture<
      CharacterCountTestComponent | CharacterCountNoIndicatorTestComponent
    >,
    value: string | null,
  ): void {
    fixture.componentInstance.firstName.setValue(value);
    fixture.detectChanges();
    tick();
  }

  function getScreenReaderText(
    fixture: ComponentFixture<
      CharacterCountTestComponent | CharacterCountNoIndicatorTestComponent
    >,
  ): string | null | undefined {
    const screenReaderElement: HTMLElement | undefined =
      fixture.debugElement.query(
        By.css('.sky-screen-reader-only'),
      ).nativeElement;
    return screenReaderElement?.textContent;
  }

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [CharacterCountTestModule],
    });
  });

  describe('standard behavior', () => {
    let fixture: ComponentFixture<CharacterCountTestComponent>;
    let component: CharacterCountTestComponent;
    let nativeElement: HTMLElement;
    let characterCountComponent: SkyCharacterCounterIndicatorComponent;
    let characterCountLabel: HTMLLabelElement;
    let characterCountLabelLastName: HTMLLabelElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(CharacterCountTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;

      fixture.detectChanges();

      characterCountComponent = component.inputDirective
        ?.skyCharacterCounterIndicator as SkyCharacterCounterIndicatorComponent;
      characterCountLabel = nativeElement.querySelector(
        '.input-count-example-wrapper .sky-character-count-label',
      ) as HTMLLabelElement;
      characterCountLabelLastName = nativeElement.querySelector(
        '.input-count-example-wrapper-last-name .sky-character-count-label',
      ) as HTMLLabelElement;
    });

    it('should set the count with the initial length', () => {
      expect(characterCountComponent.characterCount).toBe(4);
      expect(characterCountLabel.innerText.trim()).toBe('4/5');
    });

    it('should update the count on input', fakeAsync(() => {
      setInputValue(fixture, 'abc');

      expect(characterCountComponent.characterCount).toBe(3);
      expect(characterCountLabel.innerText.trim()).toBe('3/5');

      setInputValue(fixture, 'abcd');

      expect(characterCountComponent.characterCount).toBe(4);
      expect(characterCountLabel.innerText.trim()).toBe('4/5');
    }));

    it('should handle undefined input', fakeAsync(() => {
      setInputValue(fixture, null);

      expect(characterCountComponent.characterCount).toBe(0);
      expect(characterCountLabel.innerText.trim()).toBe('0/5');
      expect(component.firstName.valid).toBeTruthy();
    }));

    it('should show the error icon on the character count when appropriate', fakeAsync(() => {
      setInputValue(fixture, 'abcde');
      expect(
        characterCountLabel.classList.contains('sky-error-label'),
      ).toBeFalsy();

      setInputValue(fixture, 'abcdef');
      expect(
        characterCountLabel.classList.contains('sky-error-label'),
      ).toBeTruthy();
    }));

    it('should show the error detail message when appropriate', fakeAsync(() => {
      setInputValue(fixture, 'abcde');
      expect(component.firstName.valid).toBeTruthy();

      setInputValue(fixture, 'abcdef');
      expect(component.firstName.valid).toBeFalsy();
    }));

    it('should handle changes to max character count', fakeAsync(() => {
      setInputValue(fixture, '1234');
      component.setCharacterCountLimit(3);
      fixture.detectChanges();
      expect(component.firstName.valid).toBeFalsy();
      expect(
        characterCountLabel.classList.contains('sky-error-label'),
      ).toBeTruthy();

      component.setCharacterCountLimit(4);
      fixture.detectChanges();
      expect(component.firstName.valid).toBeTruthy();
      expect(
        characterCountLabel.classList.contains('sky-error-label'),
      ).toBeFalsy();
    }));

    it('should only update the limit if different', () => {
      const spy = spyOnProperty(
        characterCountComponent,
        'characterCountLimit',
        'set',
      ).and.callThrough();

      component.setCharacterCountLimit(15);
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(15);
      spy.calls.reset();

      component.setCharacterCountLimit(15);
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
      spy.calls.reset();

      component.setCharacterCountLimit(10);
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(10);
    });

    it('should default the limit to zero', fakeAsync(() => {
      component.setCharacterCountLimit(5);
      fixture.detectChanges();

      expect(characterCountComponent.characterCountLimit).toEqual(5);

      component.setCharacterCountLimit(undefined);
      fixture.detectChanges();

      expect(characterCountComponent.characterCountLimit).toEqual(0);
    }));

    it('should allow character limit and indicator to be set in any order', () => {
      expect(characterCountComponent.characterCount).toBe(4);
      expect(characterCountLabelLastName.innerText.trim()).toBe('4/5');
    });

    it('should announce to screen readers every 10 characters when within 50 characters of the limit', fakeAsync(() => {
      component.setCharacterCountLimit(49);
      fixture.detectChanges();

      setInputValue(fixture, '1'.repeat(9));
      expect(getScreenReaderText(fixture)).toBe('');

      setInputValue(fixture, '1'.repeat(10));
      expect(getScreenReaderText(fixture)).toBe('10 characters out of 49');

      setInputValue(fixture, '');
      expect(getScreenReaderText(fixture)).toBe('0 characters out of 49');
    }));

    it('should announce to screen readers every 50 characters when not within 50 characters of the limit', fakeAsync(() => {
      component.setCharacterCountLimit(99);
      fixture.detectChanges();

      setInputValue(fixture, '1'.repeat(9));
      expect(getScreenReaderText(fixture)).toBe('');

      setInputValue(fixture, '1'.repeat(10));
      expect(getScreenReaderText(fixture)).toBe('');

      setInputValue(fixture, '1'.repeat(50));
      expect(getScreenReaderText(fixture)).toBe('50 characters out of 99');

      setInputValue(fixture, '1'.repeat(60));
      expect(getScreenReaderText(fixture)).toBe('60 characters out of 99');

      setInputValue(fixture, '');
      expect(getScreenReaderText(fixture)).toBe('0 characters out of 99');
    }));

    it('should announce to screen readers when reaching the limit', fakeAsync(() => {
      component.setCharacterCountLimit(99);
      fixture.detectChanges();

      setInputValue(fixture, '1'.repeat(98));
      expect(getScreenReaderText(fixture)).toBe('');

      setInputValue(fixture, '1'.repeat(90));
      expect(getScreenReaderText(fixture)).toBe('90 characters out of 99');

      setInputValue(fixture, '1'.repeat(99));
      expect(getScreenReaderText(fixture)).toBe('99 characters out of 99');
    }));

    it('should announce to screen readers when over the limit', fakeAsync(() => {
      component.setCharacterCountLimit(99);
      fixture.detectChanges();

      setInputValue(fixture, '1'.repeat(99));
      expect(getScreenReaderText(fixture)).toBe('99 characters out of 99');

      setInputValue(fixture, '1'.repeat(100));
      expect(getScreenReaderText(fixture)).toBe(
        'You are over the character limit.',
      );
    }));

    it('should announce to screen readers when the input is focused even when not at a standard announcement point', fakeAsync(() => {
      component.setCharacterCountLimit(99);
      fixture.detectChanges();

      setInputValue(fixture, '1'.repeat(98));
      expect(getScreenReaderText(fixture)).toBe('');

      focusFirstNameInput(fixture);
      expect(getScreenReaderText(fixture)).toBe('98 characters out of 99');
    }));

    it('should clear the screen reader announcement when removing focus from the input so that it can be put back when refocused', fakeAsync(() => {
      component.setCharacterCountLimit(99);
      fixture.detectChanges();

      setInputValue(fixture, '1'.repeat(98));
      expect(getScreenReaderText(fixture)).toBe('');

      // Baseline that focusing works
      focusFirstNameInput(fixture);
      expect(getScreenReaderText(fixture)).toBe('98 characters out of 99');

      // Clear screen reader when focus is removed (and ensure no new announcement is made)
      removeFirstNameFocus(fixture);
      expect(getScreenReaderText(fixture)).toBe('');

      // Ensure a new announcement works if refocused.
      setInputValue(fixture, '1'.repeat(60));
      focusFirstNameInput(fixture);
      expect(getScreenReaderText(fixture)).toBe('60 characters out of 99');

      // Clear screen reader when focus is removed (and ensure no new announcement is made) when the count is a standard announcement interval
      removeFirstNameFocus(fixture);
      expect(getScreenReaderText(fixture)).toBe('');
    }));

    it('should pass accessibility', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });

  describe('without count indicator', () => {
    let fixture: ComponentFixture<CharacterCountNoIndicatorTestComponent>;
    let component: CharacterCountNoIndicatorTestComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(CharacterCountNoIndicatorTestComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should handle undefined input', fakeAsync(() => {
      setInputValue(fixture, null);

      expect(component.firstName.valid).toBeTruthy();
    }));

    it('should show the error detail message when appropriate', fakeAsync(() => {
      setInputValue(fixture, 'abcde');
      expect(component.firstName.valid).toBeTruthy();

      setInputValue(fixture, 'abcdef');
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

    it('should pass accessibility', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});

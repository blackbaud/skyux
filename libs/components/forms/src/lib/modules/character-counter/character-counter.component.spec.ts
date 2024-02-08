import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyCharacterCounterIndicatorComponent } from './character-counter-indicator.component';
import { CharacterCountNoIndicatorTestComponent } from './fixtures/character-count-no-indicator.component.fixture';
import { CharacterCountTestComponent } from './fixtures/character-count.component.fixture';
import { CharacterCountTestModule } from './fixtures/character-count.module.fixture';

describe('Character Counter component', () => {
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

  function validateScreenReaderTextForCount(
    fixture: ComponentFixture<
      CharacterCountTestComponent | CharacterCountNoIndicatorTestComponent
    >,
    characterCount: number,
    expectedCountOrText: number | string,
    characterCountLimit: number,
  ): void {
    setInputValue(fixture, '1'.repeat(characterCount));
    expect(getScreenReaderText(fixture)).toBe(
      typeof expectedCountOrText === 'string'
        ? expectedCountOrText
        : `${expectedCountOrText} characters out of ${characterCountLimit}`,
    );
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
      // Sets the screen reader to the initial state
      expect(getScreenReaderText(fixture)).toBe('4 characters out of 5');
      component.setCharacterCountLimit(49);
      fixture.detectChanges();

      // Sets currently typed characters do not change until a breakpoint
      validateScreenReaderTextForCount(fixture, 9, 4, 49);

      validateScreenReaderTextForCount(fixture, 10, 10, 49);

      validateScreenReaderTextForCount(fixture, 0, 0, 49);
    }));

    it('should announce to screen readers every 50 characters when not within 50 characters of the limit', fakeAsync(() => {
      // Sets the screen reader to the initial state
      expect(getScreenReaderText(fixture)).toBe('4 characters out of 5');
      component.setCharacterCountLimit(99);
      fixture.detectChanges();

      // Sets currently typed characters do not change until a breakpoint
      validateScreenReaderTextForCount(fixture, 9, 4, 99);

      validateScreenReaderTextForCount(fixture, 10, 4, 99);

      // Should not update when 50 characters is hit on a non-multiple of 10
      validateScreenReaderTextForCount(fixture, 49, 4, 99);

      validateScreenReaderTextForCount(fixture, 50, 50, 99);

      validateScreenReaderTextForCount(fixture, 60, 60, 99);

      validateScreenReaderTextForCount(fixture, 0, 0, 99);
    }));

    it('should announce to screen readers when backspacing at breakpoints', fakeAsync(() => {
      // Sets the screen reader to the initial state
      expect(getScreenReaderText(fixture)).toBe('4 characters out of 5');
      component.setCharacterCountLimit(99);
      fixture.detectChanges();

      validateScreenReaderTextForCount(fixture, 60, 60, 99);

      validateScreenReaderTextForCount(fixture, 59, 60, 99);

      validateScreenReaderTextForCount(fixture, 50, 50, 99);

      validateScreenReaderTextForCount(fixture, 49, 50, 99);

      validateScreenReaderTextForCount(fixture, 5, 50, 99);

      validateScreenReaderTextForCount(fixture, 0, 0, 99);
    }));

    it('should announce to screen readers when jumping from the initial value to a value past an announcement point', fakeAsync(() => {
      // Sets the screen reader to the initial state
      expect(getScreenReaderText(fixture)).toBe('4 characters out of 5');
      component.setCharacterCountLimit(99);
      fixture.detectChanges();

      validateScreenReaderTextForCount(fixture, 98, 90, 99);
    }));

    it('should announce to screen readers when reaching the limit', fakeAsync(() => {
      // Sets the screen reader to the initial state
      expect(getScreenReaderText(fixture)).toBe('4 characters out of 5');
      component.setCharacterCountLimit(99);
      fixture.detectChanges();

      validateScreenReaderTextForCount(fixture, 90, 90, 99);

      validateScreenReaderTextForCount(fixture, 99, 99, 99);
    }));

    it('should announce to screen readers when over the limit', fakeAsync(() => {
      component.setCharacterCountLimit(99);
      fixture.detectChanges();

      validateScreenReaderTextForCount(fixture, 99, 99, 99);

      validateScreenReaderTextForCount(
        fixture,
        100,
        'You are over the character limit.',
        99,
      );
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

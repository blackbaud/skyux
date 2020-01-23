import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  expect
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

  function setInputValue(
    fixture: ComponentFixture<CharacterCountTestComponent | CharacterCountNoIndicatorTestComponent>,
    value: string
  ): void {
    fixture.componentInstance.firstName.setValue(value);
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
      setInputValue(fixture, 'abc');

      expect(characterCountComponent.characterCount).toBe(3);
      expect(characterCountLabel.innerText.trim()).toBe('3/5');

      setInputValue(fixture, 'abcd');

      expect(characterCountComponent.characterCount).toBe(4);
      expect(characterCountLabel.innerText.trim()).toBe('4/5');
    }));

    it('should handle undefined input', fakeAsync(() => {
      /* tslint:disable */
      setInputValue(fixture, null);
      /* tslint:enable */

      expect(characterCountComponent.characterCount).toBe(0);
      expect(characterCountLabel.innerText.trim()).toBe('0/5');
      expect(component.firstName.valid).toBeTruthy();
    }));

    it('should show the error icon on the character count when appropriate', fakeAsync(() => {
      setInputValue(fixture, 'abcde');
      expect(characterCountLabel.classList.contains('sky-error-label')).toBeFalsy();

      setInputValue(fixture, 'abcdef');
      expect(characterCountLabel.classList.contains('sky-error-label')).toBeTruthy();
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
      expect(characterCountLabel.classList.contains('sky-error-label')).toBeTruthy();

      component.setCharacterCountLimit(4);
      fixture.detectChanges();
      expect(component.firstName.valid).toBeTruthy();
      expect(characterCountLabel.classList.contains('sky-error-label')).toBeFalsy();
    }));

    it('should only update the limit if different', async(() => {
      const spy = spyOnProperty(characterCountComponent, 'characterCountLimit', 'set').and.callThrough();

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
    }));

    it('should default the limit to zero', fakeAsync(() => {
      component.setCharacterCountLimit(5);
      fixture.detectChanges();

      expect(characterCountComponent.characterCountLimit).toEqual(5);

      component.setCharacterCountLimit(undefined);
      fixture.detectChanges();

      expect(characterCountComponent.characterCountLimit).toEqual(0);
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

    beforeEach(() => {
      fixture = TestBed.createComponent(CharacterCountNoIndicatorTestComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should handle undefined input', fakeAsync(() => {
      /* tslint:disable */
      setInputValue(fixture, null);
      /* tslint:enable */

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

    it('should pass accessibility', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });
});

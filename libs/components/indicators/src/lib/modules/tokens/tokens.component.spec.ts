import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyLiveAnnouncerService } from '@skyux/core';

import { Subject } from 'rxjs';

import { SkyTokensFixturesModule } from './fixtures/tokens-fixtures.module';
import { SkyTokensTestComponent } from './fixtures/tokens.component.fixture';
import { SkyTokensMessageType } from './types/tokens-message-type';

describe('Tokens component', () => {
  let fixture: ComponentFixture<SkyTokensTestComponent>;
  let component: SkyTokensTestComponent;

  let liveAnnouncerSpy: jasmine.Spy;

  function getTokenElements(): NodeListOf<HTMLElement> {
    const tokensElement = component.tokensElementRef?.nativeElement;
    const tokenElements = tokensElement.querySelectorAll('sky-token');
    return tokenElements as NodeListOf<HTMLElement>;
  }

  function verifyArrowKeyNavigation(keyRight: string, keyLeft: string): void {
    fixture.detectChanges();
    component.publishTokens();

    fixture.detectChanges();
    expect(component.tokensComponent?.activeIndex).toEqual(0);

    const tokenElements = getTokenElements();
    SkyAppTestUtility.fireDomEvent(tokenElements.item(0), 'keydown', {
      keyboardEventInit: { key: keyRight },
    });

    fixture.detectChanges();
    expect(component.tokensComponent?.activeIndex).toEqual(1);
    expect(document.activeElement).toEqual(
      tokenElements.item(1).querySelector('.sky-token-btn-action'),
    );

    SkyAppTestUtility.fireDomEvent(tokenElements.item(1), 'keydown', {
      keyboardEventInit: { key: keyLeft },
    });
    fixture.detectChanges();

    expect(component.tokensComponent?.activeIndex).toEqual(0);
    expect(document.activeElement).toEqual(
      tokenElements.item(0).querySelector('.sky-token-btn-action'),
    );
  }

  function verifyItemFocusedWithMessage(
    type: SkyTokensMessageType,
    index: number,
  ): void {
    component.messageStream?.next({ type });
    fixture.detectChanges();

    const tokenElements = fixture.nativeElement.querySelectorAll(
      '.sky-token-btn-action',
    );
    const focusedToken = tokenElements[index] as HTMLElement;

    expect(component.tokensComponent?.activeIndex).toEqual(index);
    expect(document.activeElement).toEqual(focusedToken);
  }

  function removeActiveItemAndVerifyLength(length: number): void {
    component.messageStream?.next({
      type: SkyTokensMessageType.RemoveActiveToken,
    });
    fixture.detectChanges();

    const tokenElements = fixture.nativeElement.querySelectorAll('.sky-token');
    expect(tokenElements.length).toEqual(length);
    expect(component.tokens?.length).toEqual(length);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyTokensFixturesModule],
    });

    fixture = TestBed.createComponent(SkyTokensTestComponent);
    component = fixture.componentInstance;

    liveAnnouncerSpy = spyOn(
      TestBed.inject(SkyLiveAnnouncerService),
      'announce',
    );
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('basic setup', () => {
    it('should set defaults', async () => {
      fixture.detectChanges();
      expect(component.tokensComponent?.tokens).toEqual([]);
      fixture.detectChanges();
      expect(component.tokensComponent?.disabled).toEqual(false);
      expect(component.tokensComponent?.dismissible).toEqual(true);
      expect(component.tokensComponent?.displayWith).toEqual('name');
      expect(component.tokensComponent?.activeIndex).toEqual(0);
      expect(component.tokensComponent?.messageStream).toEqual(
        jasmine.any(Subject),
      );

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should wrap internal content', () => {
      fixture.detectChanges();
      expect(component.tokensElementRef?.nativeElement).toHaveText(
        'INNER CONTENT',
      );
    });

    it('should respect trackWith', () => {
      component.trackWith = 'id';
      component.data = [
        { id: 1, name: 'Red' },
        { id: 2, name: 'White' },
        { id: 3, name: 'Blue' },
      ];

      component.publishTokens();
      fixture.detectChanges();

      const tokenElements = getTokenElements();

      expect(tokenElements.length).toBe(3);

      component.data = [
        { id: 1, name: 'Red' },
        { id: 2, name: 'White' },
        { id: 3, name: 'Blue' },
        { id: 4, name: 'Black' },
      ];

      component.publishTokens();
      fixture.detectChanges();

      const newTokenElements = getTokenElements();

      expect(newTokenElements.length).toBe(4);

      // ngFor should not recreate these items since the bound data have the same ID.
      expect(newTokenElements[0]).toBe(tokenElements[0]);
      expect(newTokenElements[1]).toBe(tokenElements[1]);
      expect(newTokenElements[2]).toBe(tokenElements[2]);
    });
  });

  describe('events', () => {
    it('should fire the change and rendered events when the tokens change', () => {
      const changeSpy = spyOn(component, 'onTokensChange');
      const renderedSpy = spyOn(component, 'onTokensRendered');
      component.publishTokens();
      fixture.detectChanges();
      expect(changeSpy).toHaveBeenCalled();
      expect(renderedSpy).not.toHaveBeenCalled();

      // Simulate the CSS animation completing on a token element.
      const tokenEl = fixture.nativeElement.querySelector('sky-token');
      tokenEl.dispatchEvent(
        new AnimationEvent('animationend', {
          animationName: 'sky-token-enter-animation',
        }),
      );
      fixture.detectChanges();
      expect(renderedSpy).toHaveBeenCalled();
    });

    it('should emit when the focus index is greater than the number of tokens', () => {
      component.publishMessageStream();
      fixture.detectChanges();
      component.publishTokens();

      fixture.detectChanges();

      if (component.tokensComponent) {
        component.tokensComponent.activeIndex = 2;
      }

      const tokenElements = getTokenElements();
      const spy = spyOn(component, 'onFocusIndexOverRange').and.callThrough();

      SkyAppTestUtility.fireDomEvent(tokenElements.item(2), 'keydown', {
        keyboardEventInit: { key: 'ArrowRight' },
      });
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
      expect(component.tokensComponent?.activeIndex).toEqual(2);
    });

    it('should emit when the focus index is less than zero', () => {
      component.publishMessageStream();
      fixture.detectChanges();
      component.publishTokens();

      fixture.detectChanges();

      if (component.tokensComponent) {
        component.tokensComponent.activeIndex = 0;
      }

      const tokenElements = getTokenElements();
      const spy = spyOn(component, 'onFocusIndexUnderRange').and.callThrough();

      SkyAppTestUtility.fireDomEvent(tokenElements.item(0), 'keydown', {
        keyboardEventInit: { key: 'ArrowLeft' },
      });
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
      expect(component.tokensComponent?.activeIndex).toEqual(0);
    });

    it('should emit when token is selected on click', () => {
      const spy = spyOn(component, 'onTokenSelected').and.callThrough();

      component.publishMessageStream();
      fixture.detectChanges();
      component.publishTokens();
      fixture.detectChanges();

      const tokenElements = getTokenElements();
      tokenElements.item(0).click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith({
        token: component.tokensComponent?.tokens[0],
      });
    });

    it('should use inputted values for ariaLabel', fakeAsync(() => {
      component.ariaLabel = 'this is a custom label';
      component.includeSingleToken = true;

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const token = fixture.nativeElement.querySelector('.sky-token-btn-close');
      expect(token.getAttribute('aria-label')).toBe('this is a custom label');
      expect(token.getAttribute('title')).toBe('this is a custom label');
    }));

    it('should not emit when token is clicked if disabled', () => {
      component.disabled = true;
      const spy = spyOn(component, 'onTokenSelected').and.callThrough();

      fixture.detectChanges();
      component.publishTokens();
      fixture.detectChanges();

      const tokenElements = getTokenElements();
      tokenElements.item(0).click();
      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('message stream', () => {
    it('should focus previous and next items', () => {
      component.publishMessageStream();
      fixture.detectChanges();
      component.publishTokens();
      fixture.detectChanges();

      verifyItemFocusedWithMessage(SkyTokensMessageType.FocusNextToken, 1);
      verifyItemFocusedWithMessage(SkyTokensMessageType.FocusPreviousToken, 0);
    });

    it('should focus active item', () => {
      component.publishMessageStream();
      fixture.detectChanges();
      component.publishTokens();
      fixture.detectChanges();

      verifyItemFocusedWithMessage(SkyTokensMessageType.FocusActiveToken, 0);
    });

    it('should focus last item', () => {
      component.publishMessageStream();
      fixture.detectChanges();
      component.publishTokens();
      fixture.detectChanges();

      const tokenElements =
        fixture.nativeElement.querySelectorAll('.sky-token');
      verifyItemFocusedWithMessage(
        SkyTokensMessageType.FocusLastToken,
        tokenElements.length - 1,
      );
    });

    it('should remove items', () => {
      component.publishMessageStream();
      fixture.detectChanges();
      component.publishTokens();
      fixture.detectChanges();

      expect(component.tokens?.length).toEqual(3);

      removeActiveItemAndVerifyLength(2);
      expect((component.tokens || [])[0].value.name).toEqual('White');

      removeActiveItemAndVerifyLength(1);
      expect((component.tokens || [])[0].value.name).toEqual('Blue');

      removeActiveItemAndVerifyLength(0);

      // Run it again to make sure it works when zero items exist.
      removeActiveItemAndVerifyLength(0);
    });

    it('should handle async message stream init', () => {
      fixture.detectChanges();
      component.publishTokens();
      fixture.detectChanges();

      component.publishMessageStream();
      fixture.detectChanges();

      component.messageStream?.next({
        type: SkyTokensMessageType.FocusLastToken,
      });

      fixture.detectChanges();

      component.publishMessageStream();
      fixture.detectChanges();

      component.messageStream?.next({
        type: SkyTokensMessageType.FocusLastToken,
      });

      fixture.detectChanges();

      const tokenElements = fixture.nativeElement.querySelectorAll(
        '.sky-token-btn-action',
      );
      const lastToken = tokenElements[tokenElements.length - 1] as HTMLElement;

      expect(component.tokensComponent?.activeIndex).toEqual(
        tokenElements.length - 1,
      );

      expect(document.activeElement).toEqual(lastToken);
    });

    it('should handle empty tokens', () => {
      component.publishMessageStream();
      fixture.detectChanges();

      component.disabled = true;
      fixture.detectChanges();
      expect(component.tokensComponent?.activeIndex).toEqual(0);

      component.messageStream?.next({
        type: SkyTokensMessageType.FocusLastToken,
      });
      fixture.detectChanges();
      expect(component.tokensComponent?.activeIndex).toEqual(0);
    });
  });

  describe('keyboard interactions', () => {
    it('should navigate token focus with arrow keys', () => {
      component.publishMessageStream();
      verifyArrowKeyNavigation('ArrowRight', 'ArrowLeft');
    });

    it('should navigate token focus with arrow keys (Edge/IE)', () => {
      component.publishMessageStream();
      verifyArrowKeyNavigation('Right', 'Left');
    });

    it('should ignore keydown if disabled', () => {
      component.disabled = true;
      component.publishMessageStream();
      fixture.detectChanges();
      component.publishTokens();
      fixture.detectChanges();

      const tokenElements = getTokenElements();

      let messageStreamUpdated = false;
      component.messageStream?.subscribe(() => (messageStreamUpdated = true));

      SkyAppTestUtility.fireDomEvent(tokenElements.item(0), 'keydown', {
        keyboardEventInit: { key: 'ArrowLeft' },
      });
      fixture.detectChanges();

      expect(messageStreamUpdated).toBeFalse();
    });

    it('should select token with enter keyup', () => {
      const spy = spyOn(component, 'onTokenSelected').and.callThrough();

      fixture.detectChanges();
      component.publishTokens();
      fixture.detectChanges();

      const tokenElements = getTokenElements();
      SkyAppTestUtility.fireDomEvent(tokenElements.item(0), 'keyup', {
        keyboardEventInit: { key: 'Enter' },
      });
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith({
        token: component.tokensComponent?.tokens[0],
      });
    });

    it('should ignore keyup events if tokens are disabled', () => {
      component.disabled = true;
      const spy = spyOn(component, 'onTokenSelected').and.callThrough();

      fixture.detectChanges();
      component.publishTokens();
      fixture.detectChanges();

      const tokenElements = getTokenElements();
      SkyAppTestUtility.fireDomEvent(tokenElements.item(0), 'keyup', {
        keyboardEventInit: { key: 'Enter' },
      });
      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('token component', () => {
    it('should dismiss a token when close button clicked', () => {
      fixture.detectChanges();
      component.publishTokens();
      fixture.detectChanges();
      expect(component.tokensComponent?.tokens.length).toEqual(3);

      const removedToken = (component.tokensComponent?.tokens || [])[0];

      let tokenElements = getTokenElements();
      (
        tokenElements
          .item(0)
          .querySelector('.sky-token-btn-close') as HTMLElement
      ).click();
      fixture.detectChanges();

      tokenElements = getTokenElements();
      expect(component.tokensComponent?.tokens).not.toContain(removedToken);
      expect(component.tokensComponent?.tokens.length).toEqual(2);
      expect(liveAnnouncerSpy).toHaveBeenCalledOnceWith('Red removed');
    });

    it('should add a sky-btn-disabled class if disabled', async () => {
      component.disabled = true;
      fixture.detectChanges();
      component.publishTokens();
      fixture.detectChanges();

      expect(component.tokensComponent?.tokens.length).toEqual(3);

      let tokenElements = getTokenElements();
      (
        tokenElements
          .item(0)
          .querySelector('.sky-token-btn-close') as HTMLElement
      ).click();
      fixture.detectChanges();

      tokenElements = getTokenElements();
      expect(
        tokenElements.item(0).querySelector('.sky-btn-disabled'),
      ).not.toBeNull();
      expect(component.tokensComponent?.tokens.length).toEqual(3);

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should adjust the tabindex if set to not-focusable', async () => {
      fixture.detectChanges();
      component.publishTokens();
      fixture.detectChanges();

      let tokenButtons: NodeListOf<HTMLDivElement> =
        component.tokensElementRef?.nativeElement.querySelectorAll(
          '.sky-token-btn-action',
        );

      expect(tokenButtons.item(0).tabIndex).toEqual(0);

      component.focusable = false;
      fixture.detectChanges();
      tokenButtons =
        component.tokensElementRef?.nativeElement.querySelectorAll(
          '.sky-token',
        );
      expect(tokenButtons.item(0).tabIndex).toEqual(-1);

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });

  describe('a11y', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SkyTokensTestComponent);
      component = fixture.componentInstance;
      component.publishTokens();
      fixture.detectChanges();
    });

    it('should be accessible (disabled: false, dismissible: false, focusable: false, trackWith: undefined)', async () => {
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (disabled: true, dismissible: false, focusable: false, trackWith: undefined)', async () => {
      component.disabled = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (disabled: false, dismissible: false, focusable: true, trackWith: undefined)', async () => {
      component.focusable = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();

      fixture.nativeElement.querySelector('.sky-token-btn-action').focus();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (disabled: true, dismissible: false, focusable: true, trackWith: undefined)', async () => {
      component.disabled = true;
      component.focusable = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (disabled: false, dismissible: true, focusable: false, trackWith: undefined)', async () => {
      component.dismissible = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();

      fixture.nativeElement.querySelector('.sky-token-btn-close').focus();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (disabled: true, dismissible: true, focusable: false, trackWith: undefined)', async () => {
      component.disabled = true;
      component.dismissible = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (disabled: false, dismissible: true, focusable: true, trackWith: undefined)', async () => {
      component.dismissible = true;
      component.focusable = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();

      fixture.nativeElement.querySelector('.sky-token-btn-action').focus();

      await expectAsync(fixture.nativeElement).toBeAccessible();

      fixture.nativeElement.querySelector('.sky-token-btn-close').focus();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (disabled: true, dismissible: true, focusable: true, trackWith: undefined)', async () => {
      component.disabled = true;
      component.dismissible = true;
      component.focusable = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (disabled: false, dismissible: false, focusable: false, trackWith: "name")', async () => {
      component.trackWith = 'name';
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (disabled: true, dismissible: false, focusable: false, trackWith: "name")', async () => {
      component.disabled = true;
      component.trackWith = 'name';
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (disabled: false, dismissible: false, focusable: true, trackWith: "name")', async () => {
      component.focusable = true;
      component.trackWith = 'name';
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();

      fixture.nativeElement.querySelector('.sky-token-btn-action').focus();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (disabled: true, dismissible: false, focusable: true, trackWith: "name")', async () => {
      component.disabled = true;
      component.focusable = true;
      component.trackWith = 'name';
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (disabled: false, dismissible: true, focusable: false, trackWith: "name")', async () => {
      component.dismissible = true;
      component.trackWith = 'name';
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();

      fixture.nativeElement.querySelector('.sky-token-btn-close').focus();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (disabled: true, dismissible: true, focusable: false, trackWith: "name")', async () => {
      component.disabled = true;
      component.dismissible = true;
      component.trackWith = 'name';
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (disabled: false, dismissible: true, focusable: true, trackWith: "name")', async () => {
      component.dismissible = true;
      component.focusable = true;
      component.trackWith = 'name';
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();

      fixture.nativeElement.querySelector('.sky-token-btn-action').focus();

      await expectAsync(fixture.nativeElement).toBeAccessible();

      fixture.nativeElement.querySelector('.sky-token-btn-close').focus();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (disabled: true, dismissible: true, focusable: true, trackWith: "name")', async () => {
      component.disabled = true;
      component.dismissible = true;
      component.focusable = true;
      component.trackWith = 'name';
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();

      component.trackWith = 'id';
      component.data = [
        { id: 1, name: 'Red' },
        { id: 2, name: 'White' },
        { id: 3, name: 'Blue' },
      ];

      component.publishTokens();
      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (contains form-control)', async () => {
      component.innerContent = 'form-control';
      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();

      component.trackWith = 'id';
      component.data = [
        { id: 1, name: 'Red' },
        { id: 2, name: 'White' },
        { id: 3, name: 'Blue' },
      ];

      component.publishTokens();
      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});

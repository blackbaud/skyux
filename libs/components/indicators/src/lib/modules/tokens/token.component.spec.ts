import { TestBed } from '@angular/core/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { SkyTokenComponent } from '../tokens/token.component';
import { SkyTokensModule } from '../tokens/tokens.module';

import { SkyTokenTestComponent } from './fixtures/token.component.fixture';

describe('Token component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyTokensModule],
    });
  });

  function validateActive(elClass: string): void {
    const fixture = TestBed.createComponent(SkyTokenComponent);
    fixture.detectChanges();

    const tokenEl = fixture.debugElement.nativeElement;

    const el = tokenEl.querySelector(`.${elClass}`);

    expect(el).not.toHaveClass(`${elClass}-active`);

    SkyAppTestUtility.fireDomEvent(el, 'mousedown');
    fixture.detectChanges();

    expect(el).toHaveClass(`${elClass}-active`);

    SkyAppTestUtility.fireDomEvent(document, 'mouseup');
    fixture.detectChanges();

    expect(el).not.toHaveClass(`${elClass}-active`);
  }

  it('should toggle the token active state', () => {
    validateActive('sky-token');
  });

  it('should toggle the close button active state', () => {
    validateActive('sky-token-btn-close');
  });

  it('should emit when token focused', () => {
    const fixture = TestBed.createComponent(SkyTokenComponent);
    const tokenEl = fixture.nativeElement.querySelector('.sky-token');

    const focusSpy = spyOn(
      fixture.componentInstance.tokenFocus,
      'emit'
    ).and.callThrough();

    fixture.componentInstance.focusable = true;
    fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(tokenEl, 'focusin');
    fixture.detectChanges();

    // Ensure CSS class is added on focus.
    expect(tokenEl).toHaveClass('sky-token-focused');
    expect(focusSpy).toHaveBeenCalled();

    SkyAppTestUtility.fireDomEvent(tokenEl, 'focusout', {
      customEventInit: {
        // Mock an element that is not a child of the token.
        relatedTarget: document.createElement('div'),
      },
    });
    fixture.detectChanges();

    // Ensure CSS class is removed on blur.
    expect(tokenEl).not.toHaveClass('sky-token-focused');
  });

  it('should use the specified ARIA label', () => {
    const fixture = TestBed.createComponent(SkyTokenTestComponent);

    fixture.componentInstance.ariaLabel = 'test';
    fixture.detectChanges();

    const btnEl = fixture.nativeElement.querySelector(
      'sky-token .sky-token-btn-close'
    );

    expect(btnEl.getAttribute('aria-label')).toBe('test');

    fixture.componentInstance.ariaLabel = undefined;
    fixture.detectChanges();

    expect(btnEl.getAttribute('aria-label')).toBe('Remove item');
  });

  it('should not have a role by default', () => {
    const fixture = TestBed.createComponent(SkyTokenTestComponent);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.sky-token').getAttribute('role')
    ).toBeNull();
  });
});

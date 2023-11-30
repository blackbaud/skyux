import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAppTestUtility, expectAsync } from '@skyux-sdk/testing';

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

  describe('a11y', () => {
    let fixture: ComponentFixture<SkyTokenTestComponent>;
    let component: SkyTokenTestComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(SkyTokenTestComponent);
      component = fixture.componentInstance;
    });
    it('should use the specified ARIA label', () => {
      component.ariaLabel = 'test';
      component.dismissible = true;
      fixture.detectChanges();

      const btnEl = fixture.nativeElement.querySelector(
        'sky-token .sky-token-btn-close'
      );

      expect(btnEl.getAttribute('aria-label')).toBe('test');

      component.ariaLabel = undefined;
      fixture.detectChanges();

      expect(btnEl.getAttribute('aria-label')).toBe('Remove item');
    });

    it('should not have a role by default', () => {
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('.sky-token').getAttribute('role')
      ).toBeNull();
    });

    it('should be accessible (ariaLabel: undefined, disabled: false, dismissible: false, focusable: false)', async () => {
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (ariaLabel: undefined, disabled: false, dismissible: false, focusable: true)', async () => {
      component.focusable = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();

      fixture.nativeElement.querySelector('.sky-token-btn-action').focus();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (ariaLabel: undefined, disabled: false, dismissible: true, focusable: false)', async () => {
      component.dismissible = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();

      fixture.nativeElement.querySelector('.sky-token-btn-close').focus();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (ariaLabel: undefined, disabled: false, dismissible: true, focusable: true)', async () => {
      component.dismissible = true;
      component.focusable = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();

      fixture.nativeElement.querySelector('.sky-token-btn-action').focus();

      await expectAsync(fixture.nativeElement).toBeAccessible();

      fixture.nativeElement.querySelector('.sky-token-btn-close').focus();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (ariaLabel: undefined, disabled: true, dismissible: false, focusable: false)', async () => {
      component.disabled = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (ariaLabel: undefined, disabled: true, dismissible: false, focusable: true)', async () => {
      component.disabled = true;
      component.focusable = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (ariaLabel: undefined, disabled: true, dismissible: true, focusable: false)', async () => {
      component.disabled = true;
      component.dismissible = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (ariaLabel: undefined, disabled: true, dismissible: true, focusable: true)', async () => {
      component.disabled = true;
      component.dismissible = true;
      component.focusable = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (ariaLabel: "test", disabled: false, dismissible: false, focusable: false)', async () => {
      component.ariaLabel = 'test';
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (ariaLabel: "test", disabled: false, dismissible: false, focusable: true)', async () => {
      component.ariaLabel = 'test';
      component.focusable = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();

      fixture.nativeElement.querySelector('.sky-token-btn-action').focus();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (ariaLabel: "test", disabled: false, dismissible: true, focusable: false)', async () => {
      component.ariaLabel = 'test';
      component.dismissible = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();

      fixture.nativeElement.querySelector('.sky-token-btn-close').focus();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (ariaLabel: "test", disabled: false, dismissible: true, focusable: true)', async () => {
      component.ariaLabel = 'test';
      component.dismissible = true;
      component.focusable = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();

      fixture.nativeElement.querySelector('.sky-token-btn-action').focus();

      await expectAsync(fixture.nativeElement).toBeAccessible();

      fixture.nativeElement.querySelector('.sky-token-btn-close').focus();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (ariaLabel: "test", disabled: true, dismissible: false, focusable: false)', async () => {
      component.ariaLabel = 'test';
      component.disabled = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (ariaLabel: "test", disabled: true, dismissible: false, focusable: true)', async () => {
      component.ariaLabel = 'test';
      component.disabled = true;
      component.focusable = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (ariaLabel: "test", disabled: true, dismissible: true, focusable: false)', async () => {
      component.disabled = true;
      component.dismissible = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (ariaLabel: "test", disabled: true, dismissible: true, focusable: true)', async () => {
      component.ariaLabel = 'test';
      component.disabled = true;
      component.dismissible = true;
      component.focusable = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});

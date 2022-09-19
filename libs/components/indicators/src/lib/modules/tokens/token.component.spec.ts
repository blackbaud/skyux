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
});

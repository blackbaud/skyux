import { TestBed } from '@angular/core/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { SkyTokenComponent } from '../tokens/token.component';
import { SkyTokensModule } from '../tokens/tokens.module';

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

    const tokenCloseBtnEl = tokenEl.querySelector(`.${elClass}`);

    expect(tokenCloseBtnEl).not.toHaveClass(`${elClass}-active`);

    SkyAppTestUtility.fireDomEvent(tokenCloseBtnEl, 'mousedown');
    fixture.detectChanges();

    expect(tokenCloseBtnEl).toHaveClass(`${elClass}-active`);

    SkyAppTestUtility.fireDomEvent(document, 'mouseup');
    fixture.detectChanges();

    expect(tokenCloseBtnEl).not.toHaveClass(`${elClass}-active`);
  }

  it('should toggle the token active state', () => {
    validateActive('sky-token');
  });

  it('should toggle the close button active state', () => {
    validateActive('sky-token-btn-close');
  });
});

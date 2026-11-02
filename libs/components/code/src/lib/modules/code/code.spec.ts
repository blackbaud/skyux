import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyCodeTestComponent } from './fixtures/code.component.fixture';

describe('Code component', () => {
  let fixture: ComponentFixture<SkyCodeTestComponent>;

  function getCodeElement(skyId: string): HTMLElement {
    return fixture.nativeElement.querySelector(
      `[data-sky-id="${skyId}"] code.sky-code`,
    );
  }

  function verifyLinkStyles(): void {
    const linkStyle = getComputedStyle(
      fixture.nativeElement.querySelector('[data-sky-id="inner-link"]'),
    );

    expect(linkStyle.color).toBe(
      getComputedStyle(getCodeElement('code-with-link')).color,
    );
    expect(linkStyle.textDecorationLine).toBe('underline');
    expect(
      getComputedStyle(getCodeElement('code-in-link')).textDecorationLine,
    ).toBe('underline');
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(SkyCodeTestComponent);
  });

  it('should render projected content in a code element', async () => {
    await fixture.whenStable();

    expect(getCodeElement('plain-code')).toHaveText('.npmrc');
  });

  it('should show links in the code text color, always underlined', async () => {
    await fixture.whenStable();

    verifyLinkStyles();
  });

  it('should be accessible', async () => {
    await fixture.whenStable();

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  describe('in modern theme', () => {
    beforeEach(() => {
      document.body.classList.add('sky-theme-modern', 'sky-theme-brand-base');
    });

    afterEach(() => {
      document.body.classList.remove(
        'sky-theme-modern',
        'sky-theme-brand-base',
      );
    });

    it('should show links in the code text color, always underlined', async () => {
      await fixture.whenStable();

      verifyLinkStyles();
    });

    it('should be accessible', async () => {
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});

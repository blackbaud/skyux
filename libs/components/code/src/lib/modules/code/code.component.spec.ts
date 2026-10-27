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

  function getLink(skyId: string): HTMLAnchorElement {
    return fixture.nativeElement.querySelector(`[data-sky-id="${skyId}"]`);
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(SkyCodeTestComponent);
  });

  it('should render projected content in a code element', async () => {
    await fixture.whenStable();

    expect(getCodeElement('plain-code')).toHaveText('.npmrc');
  });

  it('should underline links inside the code element in the code text color', async () => {
    await fixture.whenStable();

    const linkStyle = getComputedStyle(getLink('inner-link'));

    expect(linkStyle.textDecorationLine).toBe('underline');
    expect(linkStyle.color).toBe(
      getComputedStyle(getCodeElement('code-with-link')).color,
    );
  });

  it('should underline the code element when it is inside a link', async () => {
    await fixture.whenStable();

    expect(
      getComputedStyle(getCodeElement('code-in-link')).textDecorationLine,
    ).toBe('underline');
  });

  describe('a11y', () => {
    it('should be accessible', async () => {
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});

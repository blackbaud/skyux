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

  beforeEach(() => {
    fixture = TestBed.createComponent(SkyCodeTestComponent);
  });

  it('should render projected content in a code element', async () => {
    await fixture.whenStable();

    expect(getCodeElement('plain-code')).toHaveText('.npmrc');
  });

  describe('a11y', () => {
    it('should be accessible', async () => {
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});

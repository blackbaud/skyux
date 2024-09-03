import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@skyux-sdk/testing';

import { RichTextDisplayFixtureComponent } from './fixtures/rich-text-display-fixture.component';
import { SkyRichTextDisplayModule } from './rich-text-display.module';

describe('rich text display', () => {
  let fixture: ComponentFixture<RichTextDisplayFixtureComponent>;

  function validate(
    richText: string | undefined,
    expectedSanitizedText: string,
  ): void {
    fixture.componentInstance.richText = richText;
    fixture.detectChanges();

    const textEl = fixture.nativeElement.querySelector(
      '.sky-rich-text-display-text',
    );
    expect(textEl.textContent).toBe(expectedSanitizedText);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, SkyRichTextDisplayModule],
      declarations: [RichTextDisplayFixtureComponent],
    });

    fixture = TestBed.createComponent(RichTextDisplayFixtureComponent);
  });

  it('should display inline', () => {
    validate(
      '<font style="font-size: 16px" color="#a25353"><b><i><u>Super styled text</u></i></b></font>',
      'Super styled text',
    );
  });

  it('should remove malicious content', () => {
    validate('<a id="hyperlink" href="javascript:alert(1)">foo</a>', 'foo');

    expect(
      fixture.nativeElement.querySelector('#hyperlink').getAttribute('href'),
    ).toBeNull();
  });

  it('should handle undefined rich text', () => {
    validate(undefined, '');
  });

  it('should clear and reset correctly', () => {
    validate(
      '<font style="font-size: 16px" color="#a25353"><b><i><u>Super styled text</u></i></b></font>',
      'Super styled text',
    );
    validate(undefined, '');
    validate(
      '<font style="font-size: 16px" color="#a25353"><b><i><u>Super styled text</u></i></b></font>',
      'Super styled text',
    );
  });
});

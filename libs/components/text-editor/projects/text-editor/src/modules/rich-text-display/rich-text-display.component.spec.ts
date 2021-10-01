import {
  CommonModule
} from '@angular/common';

import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  FormsModule
} from '@angular/forms';

import {
  expect
} from '@skyux-sdk/testing';

import {
  RichTextDisplayFixtureComponent
} from './fixtures/rich-text-display-fixture.component';

import {
  SkyRichTextDisplayModule
} from './rich-text-display.module';

//#region helpers
function detectChanges(fixture: ComponentFixture<any>): void {
  fixture.detectChanges();
  tick();
  fixture.detectChanges();
}

function getText(fixture: ComponentFixture<any>): HTMLElement {
  return fixture.nativeElement.querySelector('.sky-rich-text-display-text');
}
//#endregion

describe('Rich text display', () => {
  let fixture: ComponentFixture<RichTextDisplayFixtureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule,
        SkyRichTextDisplayModule
      ],
      declarations: [
        RichTextDisplayFixtureComponent
      ]
    });

    fixture = TestBed.createComponent(RichTextDisplayFixtureComponent);
  });

  it('Should display inline', fakeAsync(() => {
    fixture.componentInstance.richText = `<font style=\"font-size: 16px\" color=\"#a25353\"><b><i><u>Super styled text</u></i></b></font>`;
    detectChanges(fixture);

    const text = getText(fixture);
    expect(text.textContent).toBe('Super styled text');
  }));

  it('Should remove malicious content', fakeAsync(() => {
    fixture.componentInstance.richText = '<a id="hyperlink" href="javascript:alert(1)">foo</a>';
    detectChanges(fixture);

    const text = getText(fixture);
    expect(text.textContent).toBe('foo');
    expect(fixture.nativeElement.querySelector('#hyperlink').getAttribute('href')).toBeNull();
  }));
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheCodeBlockTestComponent } from './fixtures/code-block.component.fixture';
import { StacheCodeBlockComponent } from './code-block.component';

describe('StacheCodeBlockComponent', () => {
  let component: StacheCodeBlockComponent;
  let fixture: ComponentFixture<StacheCodeBlockComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheCodeBlockTestComponent,
        StacheCodeBlockComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheCodeBlockComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should accept a string of code in the [code] attribute', () => {
    const code = '<p>asdf</p>';
    component.code = code;
    fixture.detectChanges();
    expect(element.querySelector('.stache-code-output')).toHaveText(code);
  });

  it('should not honor angular bindings in the [code] attribute', () => {
    const code = '<p>{{asdf}}</p>';
    component.code = code;
    fixture.detectChanges();
    expect(element.querySelector('.stache-code-output')).toHaveText(code);
  });

  it('should convert inner HTML to a string', () => {
    const code = '$(document).ready(() => {';
    const testFixture = TestBed.createComponent(StacheCodeBlockTestComponent);
    const testElement = testFixture.nativeElement;
    testFixture.detectChanges();
    expect(testElement.querySelector('.stache-code-output').innerText).toContain(code);
  });

  it('should not honor angular bindings in the inner HTML', () => {
    const code = '<p>Hey! {{name}}</p>';
    const testFixture = TestBed.createComponent(StacheCodeBlockTestComponent);
    const testElement = testFixture.nativeElement;
    testFixture.detectChanges();
    expect(testElement.querySelector('.stache-code-output').innerText).toContain(code);
  });

  it('should handle invalid language types', () => {
    const code = '<p></p>';
    component.code = code;
    fixture.detectChanges();
    expect(element.querySelector('code.language-markup')).toExist();

    component.languageType = 'invalidType';
    fixture.detectChanges();
    expect(element.querySelector('code.language-markup')).toExist();

    component.languageType = 'javascript';
    fixture.detectChanges();
    expect(element.querySelector('code.language-javascript')).toExist();
  });
});

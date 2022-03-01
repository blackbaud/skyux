import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect } from '@skyux-sdk/testing';
import { SkyLabelModule } from '@skyux/indicators';

import { FormatFixtureComponent } from './fixtures/format.component.fixture';
import { SkyFormatModule } from './format.module';

describe('Format component', () => {
  function validateFormattedText(
    fixture: ComponentFixture<FormatFixtureComponent>,
    expectedText: string
  ): void {
    const formatTestEl = fixture.debugElement.query(By.css('.format-test'));
    const innerText = formatTestEl.nativeElement.innerText.replace(/\s+/g, ' ');

    expect(innerText).toBe(expectedText);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormatFixtureComponent],
      imports: [SkyFormatModule, SkyLabelModule],
    });
  });

  it('should display the expected formatted text with the specified templates', () => {
    const fixture = TestBed.createComponent(FormatFixtureComponent);

    fixture.detectChanges();

    validateFormattedText(fixture, 'Zero hello One Hi Zero.');
  });

  it('should support updating the text after initial render', () => {
    const fixture = TestBed.createComponent(FormatFixtureComponent);

    fixture.detectChanges();

    fixture.componentInstance.text = 'foo {0}';

    fixture.detectChanges();

    validateFormattedText(fixture, 'foo Zero');
  });

  it('should allow user interaction with elements inside a template', () => {
    const fixture = TestBed.createComponent(FormatFixtureComponent);

    fixture.detectChanges();

    // Test the button click handler.
    const testClickSpy = spyOn(fixture.componentInstance, 'testClick');

    const btnEl = fixture.debugElement.query(By.css('button'));

    btnEl.triggerEventHandler('click', {});

    expect(testClickSpy).toHaveBeenCalled();
  });
});

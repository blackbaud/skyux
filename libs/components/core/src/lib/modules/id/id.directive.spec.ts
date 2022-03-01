import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect } from '@skyux-sdk/testing';

import { IdDirectiveFixtureComponent } from './fixtures/id.directive.fixture';
import { SkyIdModule } from './id.module';

describe('ID directive', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyIdModule],
      declarations: [IdDirectiveFixtureComponent],
    });
  });

  it('should assign a unique ID and provide it through its API to other controls', async(() => {
    const fixture = TestBed.createComponent(IdDirectiveFixtureComponent);

    fixture.detectChanges();

    const label1El = fixture.debugElement.query(
      By.css('.test-label1')
    ).nativeElement;
    const input1El = fixture.debugElement.query(
      By.css('.test-input1')
    ).nativeElement;

    const label2El = fixture.debugElement.query(
      By.css('.test-label2')
    ).nativeElement;
    const input2El = fixture.debugElement.query(
      By.css('.test-input2')
    ).nativeElement;

    expect(label1El.htmlFor).toBe(input1El.id);
    expect(label2El.htmlFor).toBe(input2El.id);

    expect(fixture.nativeElement).toBeAccessible();
  }));
});

import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { IdDirectiveFixtureComponent } from './fixtures/id.directive.fixture';
import { SkyIdModule } from './id.module';

describe('ID directive', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyIdModule],
      declarations: [IdDirectiveFixtureComponent],
    });
  });

  it('should assign a unique ID and provide it through its API to other controls', async () => {
    const fixture = TestBed.createComponent(IdDirectiveFixtureComponent);

    fixture.detectChanges();

    const label1El = fixture.debugElement.query(By.css('.test-label1'));
    const input1El = fixture.debugElement.query(By.css('.test-input1'));

    const label2El = fixture.debugElement.query(By.css('.test-label2'));
    const input2El = fixture.debugElement.query(By.css('.test-input2'));

    expect(label1El.attributes['for']).toBe(input1El.attributes['id']);
    expect(label2El.attributes['for']).toBe(input2El.attributes['id']);

    expect(input1El.attributes['id']).not.toBe(input2El.attributes['id']);

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should include a timestamp in the generated ID to avoid clashes across sessions', () => {
    spyOn(Date.prototype, 'getTime').and.returnValue(12345);

    const fixture = TestBed.createComponent(IdDirectiveFixtureComponent);

    fixture.detectChanges();

    const input1El = fixture.debugElement.query(By.css('.test-input1'));

    expect(input1El.attributes['id']).toMatch(/sky-id-gen__12345__[0-9]+/);
  });
});

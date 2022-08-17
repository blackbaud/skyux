import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { IdDirectiveFixtureComponent } from './fixtures/id.directive.fixture';
import { SkyIdModule } from './id.module';
import { SkyIdService } from './id.service';

describe('ID directive', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyIdModule],
      declarations: [IdDirectiveFixtureComponent],
      providers: [
        {
          provide: SkyIdService,
          useValue: {
            generateId() {
              return 'MOCK_SKY_ID';
            },
          },
        },
      ],
    });
  });

  it('should assign an ID and provide it through its API to other controls', async () => {
    const fixture = TestBed.createComponent(IdDirectiveFixtureComponent);

    fixture.detectChanges();

    const label1El = fixture.debugElement.query(By.css('.test-label1'));
    const input1El = fixture.debugElement.query(By.css('.test-input1'));

    expect(label1El.attributes['for']).toBe(input1El.attributes['id']);
    expect(input1El.attributes['id']).toBe('MOCK_SKY_ID');

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});

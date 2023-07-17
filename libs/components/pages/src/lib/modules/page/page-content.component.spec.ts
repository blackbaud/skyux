import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { PageContentFixtureComponent } from './fixtures/page-content-fixture.component';
import { SkyPageContentComponent } from './page-content.component';

describe('PageContentComponent', () => {
  let fixture: ComponentFixture<SkyPageContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageContentFixtureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageContentFixtureComponent);
    fixture.detectChanges();
  });

  it('should display projected content', () => {
    expect(fixture.nativeElement).toHaveText('Some content');
  });
});

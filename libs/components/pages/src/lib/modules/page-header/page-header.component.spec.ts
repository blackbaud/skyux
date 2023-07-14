import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@skyux-sdk/testing';

import { PageHeaderFixturesComponent } from './fixtures/page-header-fixtures.component';
import { SkyPageHeaderModule } from './page-header.module';

describe('Page header component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PageHeaderFixturesComponent,
        RouterModule,
        SkyPageHeaderModule,
        RouterTestingModule.withRoutes([]),
      ],
    });
  });

  it('should create a page header', () => {
    const fixture = TestBed.createComponent(PageHeaderFixturesComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement).toHaveText('Parent Link Page Title');
  });
});

import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { expect } from '@skyux-sdk/testing';
import { SkyIconModule } from '@skyux/indicators';
import { SkyAppLinkModule } from '@skyux/router';
import { SkyThemeModule } from '@skyux/theme';

import { PageHeaderFixturesComponent } from './fixtures/page-header-fixtures.component';
import { SkyPageHeaderComponent } from './page-header.component';

describe('Page header component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageHeaderFixturesComponent, SkyPageHeaderComponent],
      imports: [
        RouterModule,
        CommonModule,
        SkyAppLinkModule,
        SkyThemeModule,
        SkyIconModule
      ]
    });
  });

  it('should create a page header', () => {
    const fixture = TestBed.createComponent(PageHeaderFixturesComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement).toHaveText('Parent Link Page Title');
  });
});

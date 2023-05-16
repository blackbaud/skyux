import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@skyux-sdk/testing';

import { PageHeaderFixturesComponent } from './fixtures/page-header-fixtures.component';
import { SkyPageHeaderModule } from './page-header.module';

describe('Page header component', () => {
  function getHeaderContentEl(
    fixture: ComponentFixture<PageHeaderFixturesComponent>
  ): HTMLDivElement {
    return fixture.nativeElement.querySelector('.sky-page-header-content');
  }

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

  it('should project inner content', () => {
    const fixture = TestBed.createComponent(PageHeaderFixturesComponent);
    fixture.detectChanges();

    const headerContentEl = getHeaderContentEl(fixture);

    expect(headerContentEl).toHaveText('', true);

    fixture.componentInstance.headerContent = 'Hello world';
    fixture.detectChanges();

    expect(headerContentEl).toHaveText('Hello world', true);
  });
});

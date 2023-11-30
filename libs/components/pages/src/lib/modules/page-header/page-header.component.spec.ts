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
    expect(fixture.nativeElement).toHaveText(
      'Parent Link Page Title  Details about the page header.',
    );
  });

  it('should render page header buttons', () => {
    const fixture = TestBed.createComponent(PageHeaderFixturesComponent);
    fixture.componentInstance.showButtons = true;
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('.sky-btn');

    expect(btn).toBeVisible();
  });

  it('should render an avatar at size large when page is at a large breakpoint', () => {
    const fixture = TestBed.createComponent(PageHeaderFixturesComponent);
    fixture.componentInstance.showAvatar = true;
    fixture.componentInstance.width = 900;
    fixture.detectChanges();

    const largeAvatar = fixture.nativeElement.querySelector(
      '.sky-avatar-wrapper-size-large',
    );

    expect(largeAvatar).toBeVisible();
  });

  it('should render an avatar at size small when page is at an xs breakpoint', () => {
    const fixture = TestBed.createComponent(PageHeaderFixturesComponent);
    fixture.componentInstance.showAvatar = true;
    fixture.detectChanges();

    const smallAvatar = fixture.nativeElement.querySelector(
      '.sky-avatar-wrapper-size-small',
    );

    expect(smallAvatar).toBeVisible();
  });

  it('should render a page header alert', () => {
    const fixture = TestBed.createComponent(PageHeaderFixturesComponent);
    fixture.componentInstance.showAlert = true;
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('sky-alert');

    expect(alert).toBeVisible();
  });
});

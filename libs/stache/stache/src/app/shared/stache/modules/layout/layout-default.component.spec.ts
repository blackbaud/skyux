import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheLayoutDefaultComponent } from './layout-default.component';

describe('StacheLayoutDefaultComponent', () => {
  let component: StacheLayoutDefaultComponent;
  let fixture: ComponentFixture<StacheLayoutDefaultComponent>;
  let sampleRoutes = [{ name: 'test', path: '/test' }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheLayoutDefaultComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheLayoutDefaultComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should have a pageTitle input', () => {
    component.pageTitle = 'test';
    fixture.detectChanges();
    expect(component.pageTitle).toBe('test');
  });

  it('should have a breadcrumbsRoutes input', () => {
    component.breadcrumbsRoutes = sampleRoutes;
    fixture.detectChanges();
    expect(component.breadcrumbsRoutes.length).toBe(1);
  });

  it('should have an inPageRoutes input', () => {
    component.inPageRoutes = sampleRoutes;
    fixture.detectChanges();
    expect(component.inPageRoutes.length).toBe(1);
  });

  it('should have a showBackToTop input', () => {
    component.showBackToTop = true;
    fixture.detectChanges();
    expect(component.showBackToTop).toBe(true);
  });

  it('should have a showBreadcrumbs input', () => {
    component.showBreadcrumbs = true;
    fixture.detectChanges();
    expect(component.showBreadcrumbs).toBe(true);
  });

  it('should have a showTableOfContents input', () => {
    component.showTableOfContents = true;
    fixture.detectChanges();
    expect(component.showTableOfContents).toBe(true);
  });

});

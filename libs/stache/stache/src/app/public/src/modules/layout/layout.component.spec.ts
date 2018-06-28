import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheLayoutComponent } from './layout.component';
import { StacheWindowRef } from '../shared';

describe('StacheLayoutComponent', () => {
  let component: StacheLayoutComponent;
  let fixture: ComponentFixture<StacheLayoutComponent>;
  let sampleRoutes = [{ name: 'test', path: '/test' }];
  let mockWindowRef: any;

  class MockWindowRef {
    public nativeWindow = {
      document: {
        body: document.createElement('div')
      }
    };
  }

  beforeEach(() => {
    mockWindowRef = new MockWindowRef;
    TestBed.configureTestingModule({
      declarations: [
        StacheLayoutComponent
      ],
      providers: [
        { provide: StacheWindowRef, useValue: mockWindowRef }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should have a pageTitle input', () => {
    component.pageTitle = 'Test Title';
    fixture.detectChanges();
    expect(component.pageTitle).toBe('Test Title');
  });

  it('should have a layoutType input', () => {
    component.layoutType = 'sidebar';
    fixture.detectChanges();
    expect(component.layoutType).toBe('sidebar');
  });

  it('should have an inPageRoutes input', () => {
    component.inPageRoutes = sampleRoutes;
    fixture.detectChanges();
    expect(component.inPageRoutes.length).toBe(1);
  });

  it('should have a showTableOfContents input', () => {
    component.showTableOfContents = true;
    fixture.detectChanges();
    expect(component.showTableOfContents).toBe(true);
  });

  it('should have a sidebarRoutes input', () => {
    component.sidebarRoutes = sampleRoutes;
    fixture.detectChanges();
    expect(component.sidebarRoutes.length).toBe(1);
  });

  it('should have a breadcrumbsRoutes input', () => {
    component.breadcrumbsRoutes = sampleRoutes;
    fixture.detectChanges();
    expect(component.breadcrumbsRoutes.length).toBe(1);
  });

  it('should have a showBreadcrumbs input', () => {
    component.showBreadcrumbs = false;
    fixture.detectChanges();
    expect(component.showBreadcrumbs).toBe(false);
  });

  it('should have a showEditButton input', () => {
    component.showBreadcrumbs = true;
    fixture.detectChanges();
    expect(component.showBreadcrumbs).toBe(true);
  });

  it('should have a showBackToTop input', () => {
    component.showBackToTop = true;
    fixture.detectChanges();
    expect(component.showBackToTop).toBe(true);
  });

  it('should set the input, layoutType, to sidebar by default', () => {
    fixture.detectChanges();
    expect(component.layoutType).toBe('sidebar');
  });

  it('should set the template ref to blank given the layoutType', () => {
    component.layoutType = 'blank';
    fixture.detectChanges();
    let layout = component['blankTemplateRef'];
    expect(component.templateRef).toBe(layout);
  });

  it('should set the template ref to container given the layoutType', () => {
    component.layoutType = 'container';
    fixture.detectChanges();
    let layout = component['containerTemplateRef'];
    expect(component.templateRef).toBe(layout);
  });

  it('should set the template ref to sidebar given the layoutType', () => {
    component.layoutType = 'sidebar';
    fixture.detectChanges();
    let layout = component['sidebarTemplateRef'];
    expect(component.templateRef).toBe(layout);
  });

});

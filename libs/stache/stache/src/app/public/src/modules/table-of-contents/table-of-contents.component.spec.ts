import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheTableOfContentsComponent } from './table-of-contents.component';
import { StacheNavComponent, StacheNavService } from '../nav';
import {
  StacheWindowRef,
  StacheRouteService } from '../shared';

describe('StacheTableOfContentsComponent', () => {
  let component: StacheTableOfContentsComponent;
  let fixture: ComponentFixture<StacheTableOfContentsComponent>;

  class MockRouter {
    public url: string = '/';
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheNavComponent,
        StacheTableOfContentsComponent
      ],
      providers: [
        { provide: Router, useClass: MockRouter },
        StacheWindowRef,
        StacheNavService,
        StacheRouteService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheTableOfContentsComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should display navigation links', () => {
    component.routes = [
      { name: 'Test 1', path: [] },
      { name: 'Test 2', path: [] }
    ];

    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.stache-nav-anchor'));

    expect(links.length).toBe(2);
  });
});

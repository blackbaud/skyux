import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

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
      imports: [
        RouterTestingModule
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
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';
import { SkyAppWindowRef } from '@blackbaud/skyux-builder/runtime';

import { StacheSidebarComponent } from './sidebar.component';
import { StacheNavModule } from '../nav/nav.module';

describe('StacheSidebarComponent', () => {
  let component: StacheSidebarComponent;
  let fixture: ComponentFixture<StacheSidebarComponent>;

  class MockRouter {
    public url: string = '/';
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StacheNavModule
      ],
      declarations: [
        StacheSidebarComponent
      ],
      providers: [
        { provide: Router, useClass: MockRouter },
        SkyAppWindowRef
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheSidebarComponent);
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

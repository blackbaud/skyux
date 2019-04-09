import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StacheInternalDirective } from './internal.directive';
import { StacheAuthService } from './auth.service';
import { ViewContainerRef, TemplateRef } from '@angular/core';
import { StacheInternalTestComponent } from './fixtures/internal.component.fixture';
import { By } from '@angular/platform-browser';
import { StacheWindowRef } from '../shared';
import { BehaviorSubject } from 'rxjs';

class MockViewContainer {
  public createEmbeddedView(ref: any) {
    return true;
  }

  public clear() {
    return true;
  }
}

describe('StacheInternalDirective', () => {
  let component: StacheInternalTestComponent;
  let fixture: ComponentFixture<StacheInternalTestComponent>;
  let directiveElement: any;
  let mockAuth: any;
  let mockViewContainer: any;

  it('should authenticate', () => {
    mockAuth = {
      isAuthenticated: new BehaviorSubject(true)
    };
    mockViewContainer = new MockViewContainer();

    TestBed.configureTestingModule({
      declarations: [
        StacheInternalTestComponent,
        StacheInternalDirective
      ],
      providers: [
        StacheInternalDirective,
        TemplateRef,
        StacheWindowRef,
        { provide: StacheAuthService, useValue: mockAuth },
        { provide: ViewContainerRef, useValue: mockViewContainer }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StacheInternalTestComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.css('div'));

    expect(directiveElement).toBeTruthy();
  });

  it('should not authenticate', () => {
    mockAuth = {
      isAuthenticated: new BehaviorSubject(false)
    };
    mockViewContainer = new MockViewContainer();

    TestBed.configureTestingModule({
      declarations: [
        StacheInternalTestComponent,
        StacheInternalDirective
      ],
      providers: [
        StacheInternalDirective,
        TemplateRef,
        StacheWindowRef,
        { provide: StacheAuthService, useValue: mockAuth },
        { provide: ViewContainerRef, useValue: mockViewContainer }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StacheInternalTestComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.css('div'));

    expect(directiveElement).not.toBeTruthy();
  });
});

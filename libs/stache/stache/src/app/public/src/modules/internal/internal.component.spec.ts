import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';
import { StacheInternalComponent } from './internal.component';
import { Observable } from 'rxjs';
import { StacheAuthService } from './auth.service';

class MockAuth {
  public isAuthenticated = Observable.of(true);
}

describe('StacheInternalComponent', () => {
  let component: StacheInternalComponent;
  let fixture: ComponentFixture<StacheInternalComponent>;
  let mockAuth: any;

  beforeEach(() => {
    mockAuth = new MockAuth();

    TestBed.configureTestingModule({
      declarations: [
        StacheInternalComponent
      ],
      providers: [
        { provide: StacheAuthService, useValue: mockAuth }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheInternalComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should authenticate', () => {
    expect(component.isAuthenticated).toBeTruthy();
  });
});

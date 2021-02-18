import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  MockSkyRestrictedViewAuthService
} from './fixtures/mock-restricted-view-auth.service';

import {
  RestrictedViewTestComponent
} from './fixtures/restricted-view.component.fixture';

import {
  RestrictedViewFixtureModule
} from './fixtures/restricted-view.module.fixture';

import {
  SkyRestrictedViewAuthService
} from './restricted-view-auth.service';

describe('SkyRestrictedViewComponent', () => {
  let fixture: ComponentFixture<RestrictedViewTestComponent>;
  let mockAuth: MockSkyRestrictedViewAuthService;

  beforeEach(() => {
    mockAuth = new MockSkyRestrictedViewAuthService();

    TestBed.configureTestingModule({
      imports: [
        RestrictedViewFixtureModule
      ],
      providers: [
        {
          provide: SkyRestrictedViewAuthService,
          useValue: mockAuth
        }
      ]
    });

    fixture = TestBed.createComponent(RestrictedViewTestComponent);
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should display content if the user is authenticated', () => {
    mockAuth.isAuthenticated.next(true);

    fixture.detectChanges();
    const element = fixture.elementRef.nativeElement.querySelector('p');
    expect(element).toBeTruthy();
  });

  it('should not display content if the user is not authenticated', () => {
    mockAuth.isAuthenticated.next(false);

    fixture.detectChanges();
    const element = fixture.elementRef.nativeElement.querySelector('p');
    expect(element).not.toBeTruthy();
  });
});

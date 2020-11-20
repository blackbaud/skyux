import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  ViewContainerRef
} from '@angular/core';

import {
  By
} from '@angular/platform-browser';

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

class MockViewContainer {
  public createEmbeddedView(ref: any) {
    return true;
  }

  public clear() {
    return true;
  }
}

describe('SkyRestrictedViewDirective', () => {
  let fixture: ComponentFixture<RestrictedViewTestComponent>;
  let directiveElement: any;
  let mockAuth: MockSkyRestrictedViewAuthService;
  let mockViewContainer: any;

  beforeEach(() => {
    mockAuth = new MockSkyRestrictedViewAuthService();
    mockViewContainer = new MockViewContainer();

    TestBed.configureTestingModule({
      imports: [
        RestrictedViewFixtureModule
      ],
      providers: [
        {
          provide: SkyRestrictedViewAuthService,
          useValue: mockAuth
        },
        {
          provide: ViewContainerRef,
          useValue: mockViewContainer
        }
      ]
    });

    fixture = TestBed.createComponent(RestrictedViewTestComponent);
  });

  it('should display content if user is authenticated', () => {
    directiveElement = fixture.debugElement.query(By.css('.skyux-restricted-view'));
    expect(directiveElement).toBeTruthy();
  });

  it('should not display content if use is not authenticated', () => {
    mockAuth.isAuthenticated.next(false);
    directiveElement = fixture.debugElement.query(By.css('.skyux-restricted-view'));
    expect(directiveElement).not.toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { MockSkyRestrictedViewAuthService } from './fixtures/mock-restricted-view-auth.service';
import { RestrictedViewTestComponent } from './fixtures/restricted-view.component.fixture';
import { RestrictedViewFixtureModule } from './fixtures/restricted-view.module.fixture';
import { SkyRestrictedViewAuthService } from './restricted-view-auth.service';

describe('Restricted content alert component', () => {
  let mockAuth: MockSkyRestrictedViewAuthService;
  let fixture: ComponentFixture<RestrictedViewTestComponent>;

  /**
   * This configureTestingModule function imports SkyAppTestModule, which brings in all of
   * the SKY UX modules and components in your application for testing convenience. If this has
   * an adverse effect on your test performance, you can individually bring in each of your app
   * components and the SKY UX modules that those components rely upon.
   */
  beforeEach(() => {
    mockAuth = new MockSkyRestrictedViewAuthService();

    TestBed.configureTestingModule({
      imports: [RestrictedViewFixtureModule],
      providers: [
        {
          provide: SkyRestrictedViewAuthService,
          useValue: mockAuth,
        },
      ],
    });

    fixture = TestBed.createComponent(RestrictedViewTestComponent);
  });

  it('should render the component', () => {
    fixture.detectChanges();
    expect(fixture).toExist();
  });

  it('should display not display the alert if the user is authenticated', () => {
    fixture.detectChanges();
    mockAuth.isAuthenticated.next(true);

    fixture.detectChanges();
    const element = fixture.elementRef.nativeElement.querySelector('sky-alert');
    expect(element).toBeNull();
  });

  it('should not display the alert if the user is not authenticated and the user was not previously authenticated', () => {
    fixture.detectChanges();
    mockAuth.isAuthenticated.next(false);

    fixture.detectChanges();
    const element = fixture.elementRef.nativeElement.querySelector('sky-alert');
    expect(element).toBeNull();
  });

  it('should not display the alert if the user authentication has not been established', () => {
    fixture.detectChanges();
    mockAuth.hasBeenAuthenticated = true;

    fixture.detectChanges();
    const element = fixture.elementRef.nativeElement.querySelector('sky-alert');
    expect(element).toBeNull();
  });

  it('should display the alert if the user is not authenticated but the user was previously authenticated', () => {
    fixture.detectChanges();
    mockAuth.hasBeenAuthenticated = true;
    mockAuth.isAuthenticated.next(false);

    fixture.detectChanges();
    const element = fixture.elementRef.nativeElement.querySelector('sky-alert');
    expect(element).not.toBeNull();
  });

  it('clearing the alert should clear the memory of the user being previously logged in', () => {
    fixture.detectChanges();
    mockAuth.hasBeenAuthenticated = true;
    mockAuth.isAuthenticated.next(false);

    fixture.detectChanges();
    let element = fixture.elementRef.nativeElement.querySelector('sky-alert');
    expect(element).not.toBeNull();

    spyOn(mockAuth, 'clearHasBeenAuthenticated').and.callThrough();

    fixture.elementRef.nativeElement.querySelector('.sky-alert-close').click();
    fixture.detectChanges();

    element = fixture.elementRef.nativeElement.querySelector('sky-alert');
    expect(element).not.toBeNull();
    expect(
      element.querySelector('.sky-alert').attributes['hidden']
    ).not.toBeNull();
    expect(mockAuth.clearHasBeenAuthenticated).toHaveBeenCalled();
  });
});

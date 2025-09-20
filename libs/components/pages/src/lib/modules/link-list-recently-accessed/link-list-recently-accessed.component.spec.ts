import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyRecentlyAccessedService } from '@skyux/router';

import { of } from 'rxjs';

import { SkyLinkListRecentlyAccessedComponent } from './link-list-recently-accessed.component';

describe('SkyLinkListRecentlyAccessedComponent', () => {
  let component: SkyLinkListRecentlyAccessedComponent;
  let fixture: ComponentFixture<SkyLinkListRecentlyAccessedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyLinkListRecentlyAccessedComponent],
      providers: [
        {
          provide: SkyRecentlyAccessedService,
          useValue: {
            getLinks: () =>
              of({
                links: [
                  {
                    label: 'Test 1',
                    url: '/test1',
                    lastAccessed: new Date(2024, 1, 1),
                  },
                  {
                    label: 'Test 2',
                    url: '/test2',
                    lastAccessed: new Date(2024, 1, 2),
                  },
                ],
              }),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(SkyLinkListRecentlyAccessedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show recent links', async () => {
    fixture.componentRef.setInput('recentLinks', { requestedRoutes: [] });
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.sky-link-list')).toBeTruthy();
    expect(
      Array.from(
        (fixture.nativeElement as HTMLElement).querySelectorAll(
          '.sky-link-list a',
        ),
      ).map((el) => el.textContent?.trim()),
    ).toEqual(['Test 2', 'Test 1']);
  });
});

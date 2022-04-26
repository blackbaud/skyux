import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyKeyInfoModule } from '@skyux/indicators';
import {
  SkyRecentlyAccessedLinkList,
  SkyRecentlyAccessedService,
} from '@skyux/router';

import { AsyncSubject, of } from 'rxjs';

import { SkyActionHubModule } from './action-hub.module';
import { ActionHubAsyncFixtureComponent } from './fixtures/action-hub-async-fixture.component';
import { ActionHubContentFixtureComponent } from './fixtures/action-hub-content-fixture.component';
import { ActionHubInputsFixtureComponent } from './fixtures/action-hub-inputs-fixture.component';
import { ActionHubRecentSvcFixtureComponent } from './fixtures/action-hub-recent-svc-fixture.component';
import { ActionHubSyncFixtureComponent } from './fixtures/action-hub-sync-fixture.component';
import { SkyRecentLink } from './types/recent-link';

describe('Action hub component', () => {
  function validateLinkList(
    fixture: ComponentFixture<unknown>,
    listType: 'recent' | 'related',
    links: {
      label: string;
      url: string;
    }[]
  ): void {
    const listIndex = listType === 'recent' ? 1 : 0;

    const linkListEl =
      fixture.nativeElement.querySelectorAll('sky-link-list')[listIndex];

    const linkEls = linkListEl.querySelectorAll('a');

    expect(linkEls.length).toBe(links.length);

    for (let i = 0; i < links.length; i++) {
      const linkEl = linkEls[i];
      const link = links[i];

      expect(linkEl).toHaveText(link.label);
      expect(linkEl.href).toBe(link.url);
    }
  }

  describe('Synchronous', () => {
    let fixture: ComponentFixture<ActionHubSyncFixtureComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ActionHubSyncFixtureComponent],
        imports: [SkyActionHubModule, RouterTestingModule.withRoutes([])],
      });
      fixture = TestBed.createComponent(ActionHubSyncFixtureComponent);
    });

    it('should show the title', () => {
      fixture.componentInstance.title = 'Test Hub';

      fixture.detectChanges();
      const h1 = fixture.nativeElement.querySelector('h1');
      expect(h1).toHaveText('Test Hub');
    });

    it('should show related links', () => {
      fixture.componentInstance.title = 'Test Hub';
      fixture.componentInstance.relatedLinks = [
        {
          label: 'Test Link B',
          permalink: {
            url: 'https://example.com/link-b',
          },
        },
        {
          label: 'Test Link B',
          permalink: {
            url: 'https://example.com/link-b',
          },
        },
        {
          label: 'Test Link C',
          permalink: {
            url: 'https://example.com/link-c',
          },
        },
        {
          label: 'Test Link A',
          permalink: {
            url: 'https://example.com/link-a',
          },
        },
      ];

      fixture.detectChanges();

      validateLinkList(fixture, 'related', [
        {
          label: 'Test Link A',
          url: 'https://example.com/link-a',
        },
        {
          label: 'Test Link B',
          url: 'https://example.com/link-b',
        },
        {
          label: 'Test Link B',
          url: 'https://example.com/link-b',
        },
        {
          label: 'Test Link C',
          url: 'https://example.com/link-c',
        },
      ]);
    });

    it('should sort recently accessed links', () => {
      fixture.componentInstance.title = 'Test Hub';
      fixture.componentInstance.recentLinks = [
        {
          label: 'Recent Link B',
          permalink: {
            url: 'https://example.com/recent-b',
          },
          lastAccessed: '2011-10-05T14:48:00.000Z',
        },
        {
          label: 'Recent Link A',
          permalink: {
            url: 'https://example.com/recent-a',
          },
          lastAccessed: new Date('2011-10-06T14:48:00.000Z'),
        },
        {
          label: 'Recent Link C',
          permalink: {
            url: 'https://example.com/recent-c',
          },
          lastAccessed: new Date('2011-10-04T14:48:00.000Z'),
        },
        {
          label: 'Recent Link D',
          permalink: {
            url: 'https://example.com/recent-d',
          },
          lastAccessed: '2011-10-04T14:48:00.000Z',
        },
      ];

      fixture.detectChanges();

      validateLinkList(fixture, 'recent', [
        {
          label: 'Recent Link A',
          url: 'https://example.com/recent-a',
        },
        {
          label: 'Recent Link B',
          url: 'https://example.com/recent-b',
        },
        {
          label: 'Recent Link C',
          url: 'https://example.com/recent-c',
        },
        {
          label: 'Recent Link D',
          url: 'https://example.com/recent-d',
        },
      ]);
    });

    it('should handle undefined recently accessed links', () => {
      fixture.componentInstance.title = 'Test Hub';
      fixture.componentInstance.recentLinks = undefined;
      fixture.detectChanges();

      validateLinkList(fixture, 'recent', []);

      fixture.componentInstance.recentLinks = [
        {
          label: 'Recent Link A',
          lastAccessed: new Date('2011-10-06T14:48:00.000Z'),
          permalink: {
            url: 'https://example.com/recent-a',
          },
        },
      ];

      fixture.detectChanges();

      validateLinkList(fixture, 'recent', [
        {
          label: 'Recent Link A',
          url: 'https://example.com/recent-a',
        },
      ]);

      fixture.componentInstance.recentLinks = undefined;

      fixture.detectChanges();

      validateLinkList(fixture, 'recent', []);
    });

    it('should show loading', fakeAsync(() => {
      fixture.componentInstance.needsAttention = 'loading';
      fixture.detectChanges();
      const skyWait = fixture.nativeElement.querySelector('.sky-wait');
      expect(skyWait).toExist();
    }));
  });

  describe('Asynchronous', () => {
    let fixture: ComponentFixture<ActionHubAsyncFixtureComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ActionHubAsyncFixtureComponent],
        imports: [SkyActionHubModule, RouterTestingModule.withRoutes([])],
      });
      fixture = TestBed.createComponent(ActionHubAsyncFixtureComponent);
    });

    it('should show loading and then content', fakeAsync(() => {
      fixture.detectChanges();
      const skyWait = fixture.nativeElement.querySelector('.sky-wait');
      expect(skyWait).toExist();
      fixture.componentInstance.relatedLinks.next([]);
      fixture.componentInstance.recentLinks.next([
        {
          label: 'Recent Link',
          permalink: {
            url: '#',
          },
          lastAccessed: new Date(),
        },
      ]);
      fixture.componentInstance.needsAttention.next([]);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.sky-wait').length).toBe(
        0
      );
      const recent1 = fixture.nativeElement.querySelector(
        'sky-link-list[ng-reflect-title="Recently Accessed"] a'
      );
      expect(recent1).toHaveText('Recent Link');
    }));

    it('should show empty needs attention language', fakeAsync(() => {
      fixture.componentInstance.needsAttention.next('loading');
      fixture.detectChanges();
      const skyWait = fixture.nativeElement.querySelector('.sky-wait');
      expect(skyWait).toExist();
      fixture.componentInstance.title.next('Page title');
      fixture.componentInstance.needsAttention.next([]);
      fixture.componentInstance.relatedLinks.next([]);
      fixture.componentInstance.recentLinks.next([]);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.sky-wait').length).toBe(
        0
      );
      expect(fixture.nativeElement.textContent).toContain(
        'No issues currently need attention'
      );
    }));
  });

  describe('Inputs', () => {
    let fixture: ComponentFixture<ActionHubInputsFixtureComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ActionHubInputsFixtureComponent],
        imports: [SkyActionHubModule, RouterTestingModule.withRoutes([])],
      });
      fixture = TestBed.createComponent(ActionHubInputsFixtureComponent);
    });

    it('should load with separate inputs', fakeAsync(() => {
      fixture.componentInstance.needsAttention = 'loading';
      fixture.componentInstance.relatedLinks = 'loading';
      fixture.componentInstance.recentLinks = 'loading';
      fixture.detectChanges();
      const skyWait = fixture.nativeElement.querySelector('.sky-wait');
      expect(skyWait).toExist();
      fixture.componentInstance.needsAttention = [
        {
          title: '1',
          message: 'Action',
          permalink: {
            url: '/',
          },
        },
      ];

      fixture.componentInstance.relatedLinks = [
        {
          label: 'Related',
          permalink: {
            url: '/',
          },
        },
      ];

      fixture.componentInstance.recentLinks = [
        {
          label: 'Recent',
          permalink: {
            url: 'https://example.com/recent',
          },
          lastAccessed: new Date(),
        },
      ];

      fixture.componentInstance.parentLink = {
        label: 'Parent',
        permalink: {
          url: '/',
        },
      };

      fixture.componentInstance.title = 'Action Hub';

      fixture.componentInstance.loading = false;

      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.sky-wait').length).toBe(
        0
      );

      validateLinkList(fixture, 'recent', [
        {
          label: 'Recent',
          url: 'https://example.com/recent',
        },
      ]);
    }));
  });

  describe('Embedded ng-content', () => {
    let fixture: ComponentFixture<ActionHubContentFixtureComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ActionHubContentFixtureComponent],
        imports: [
          SkyActionHubModule,
          SkyKeyInfoModule,
          RouterTestingModule.withRoutes([]),
        ],
      });
      fixture = TestBed.createComponent(ActionHubContentFixtureComponent);
    });

    it('should show changes in embedded content', fakeAsync(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('hello world');
      fixture.componentInstance.label = 'bar';
      fixture.componentInstance.value = 'foo';
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('foo bar');
    }));
  });

  describe('with recently accessed service', () => {
    let fixture: ComponentFixture<ActionHubRecentSvcFixtureComponent>;
    let mockRecentlyAccessedSvc: Partial<
      jasmine.SpyObj<SkyRecentlyAccessedService>
    >;

    beforeEach(() => {
      mockRecentlyAccessedSvc = {
        getLinks: jasmine.createSpy('getLinks'),
      };

      TestBed.configureTestingModule({
        declarations: [ActionHubRecentSvcFixtureComponent],
        imports: [SkyActionHubModule, RouterTestingModule.withRoutes([])],
        providers: [
          {
            provide: SkyRecentlyAccessedService,
            useValue: mockRecentlyAccessedSvc,
          },
        ],
      });

      fixture = TestBed.createComponent(ActionHubRecentSvcFixtureComponent);
    });

    it('should retrieve links from the service when a SkyRecentlyAccessedGetLinksArgs is specified', () => {
      mockRecentlyAccessedSvc.getLinks.and.returnValue(
        of<SkyRecentlyAccessedLinkList>({
          links: [
            {
              label: 'Test 1',
              lastAccessed: new Date('2022-03-01'),
              url: 'https://example.com/recent1/',
            },
            {
              label: 'Test 2',
              lastAccessed: new Date('2022-03-07'),
              url: 'https://example.com/recent2/',
            },
          ],
        })
      );

      fixture.componentInstance.recentLinks = {
        requestedRoutes: [
          {
            app: 'recent1',
            route: '/',
          },
          {
            app: 'recent2',
            route: '/',
          },
        ],
      };

      fixture.detectChanges();

      validateLinkList(fixture, 'recent', [
        {
          label: 'Test 2',
          url: 'https://example.com/recent2/',
        },
        {
          label: 'Test 1',
          url: 'https://example.com/recent1/',
        },
      ]);
    });

    it('should cancel retrieval of links from the service when a new SkyRecentlyAccessedGetLinksArgs is specified', () => {
      const testObs = new AsyncSubject<SkyRecentlyAccessedLinkList>();

      mockRecentlyAccessedSvc.getLinks.and.callFake((args) => {
        if (args.requestedRoutes[0].app === 'recent2') {
          return testObs;
        }

        return of({
          links: [
            {
              label: 'Test 1',
              lastAccessed: new Date('2022-03-01'),
              url: 'https://example.com/recent1/',
            },
          ],
        });
      });

      fixture.componentInstance.recentLinks = {
        requestedRoutes: [
          {
            app: 'recent2',
            route: '/',
          },
        ],
      };

      fixture.detectChanges();

      expect(testObs.observers.length).toBe(1);

      fixture.componentInstance.recentLinks = {
        requestedRoutes: [
          {
            app: 'recent1',
            route: '/',
          },
        ],
      };

      fixture.detectChanges();

      expect(testObs.observers.length).toBe(0);

      validateLinkList(fixture, 'recent', [
        {
          label: 'Test 1',
          url: 'https://example.com/recent1/',
        },
      ]);
    });

    it('should cancel retrieval of links from the service when a SkyRecentLink array is specified', () => {
      const testObs = new AsyncSubject<SkyRecentlyAccessedLinkList>();

      mockRecentlyAccessedSvc.getLinks.and.returnValue(testObs);

      fixture.componentInstance.recentLinks = {
        requestedRoutes: [
          {
            app: 'recent1',
            route: '/',
          },
        ],
      };

      fixture.detectChanges();

      expect(testObs.observers.length).toBe(1);

      fixture.componentInstance.recentLinks = [
        {
          label: 'Test 1',
          lastAccessed: '2022-03-09',
          permalink: {
            url: 'https://example.com/recent1/',
          },
        },
      ] as SkyRecentLink[];

      fixture.detectChanges();

      expect(testObs.observers.length).toBe(0);

      validateLinkList(fixture, 'recent', [
        {
          label: 'Test 1',
          url: 'https://example.com/recent1/',
        },
      ]);
    });
  });

  describe('without recently accessed service', () => {
    let fixture: ComponentFixture<ActionHubRecentSvcFixtureComponent>;
    let mockRecentlyAccessedSvc: Partial<
      jasmine.SpyObj<SkyRecentlyAccessedService>
    >;

    beforeEach(() => {
      mockRecentlyAccessedSvc = {
        getLinks: jasmine.createSpy('getLinks'),
      };

      TestBed.configureTestingModule({
        declarations: [ActionHubRecentSvcFixtureComponent],
        imports: [SkyActionHubModule, RouterTestingModule.withRoutes([])],
      });

      fixture = TestBed.createComponent(ActionHubRecentSvcFixtureComponent);
    });

    it('should display no links when a SkyRecentlyAccessedGetLinksArgs is specified', () => {
      mockRecentlyAccessedSvc.getLinks.and.returnValue(
        of<SkyRecentlyAccessedLinkList>({
          links: [
            {
              label: 'Test 1',
              lastAccessed: new Date('2022-03-01'),
              url: 'https://example.com/recent1/',
            },
            {
              label: 'Test 2',
              lastAccessed: new Date('2022-03-07'),
              url: 'https://example.com/recent2/',
            },
          ],
        })
      );

      fixture.componentInstance.recentLinks = {
        requestedRoutes: [
          {
            app: 'recent1',
            route: '/',
          },
          {
            app: 'recent2',
            route: '/',
          },
        ],
      };

      fixture.detectChanges();

      validateLinkList(fixture, 'recent', []);
    });
  });
});

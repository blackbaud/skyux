import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {Pipe, PipeTransform} from '@angular/core';

import { expect } from '@blackbaud/skyux-lib-testing';

import { StacheFooterComponent } from './footer.component';
import { StacheNavModule } from '../nav';
import { StacheConfigService, StacheWindowRef, StacheRouteService } from '../shared';
import { SkyAppResourcesService } from '@blackbaud/skyux-builder/runtime/i18n';
import { SkyMediaQueryModule } from '@blackbaud/skyux/dist/core';

@Pipe({
  name: 'skyAppResources'
})
export class MockSkyAppResourcesPipe implements PipeTransform {
  public transform(value: number): number {
    return value;
  }
}

class MockSkyAppResourcesService {
  public getString(val: string): any {
    return {
      subscribe: (cb: any) => {
        cb();
      },
      take: () => {
        return {
          subscribe: (cb: any) => {
            if (val === 'stache_copyright_label') {
              cb('Blackbaud, Inc. All rights reserved.');
              return;
            }
            cb();
          }
        };
      }
    };
  }
}

describe('StacheFooterComponent', () => {
  let component: StacheFooterComponent;
  let fixture: ComponentFixture<StacheFooterComponent>;
  let mockConfigService: any;
  let mockRouterService: any;
  let mockSkyAppResourcesService: any;

  let footerConfig = {
    nav: {
      items: [
      {
        title: 'Privacy Policy',
        route: '/demos/privacy-policy'
      },
      {
        title: 'Terms of Use',
        route: '/demos/anchor-link'
      }
    ]},
    copyrightLabel: 'test copyright'
  };

  class MockConfigService {
    public skyux = {
      app: {
        title: 'Some Name'
      },
      appSettings: {
        stache: {
          footer: footerConfig
        }
      }
    };
  }

  class MockRouterService {
    public getActiveUrl() { }
  }

  beforeEach(() => {
    mockConfigService = new MockConfigService();
    mockRouterService = new MockRouterService();
    mockSkyAppResourcesService = new MockSkyAppResourcesService();
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StacheNavModule,
        SkyMediaQueryModule
      ],
      declarations: [
        StacheFooterComponent,
        MockSkyAppResourcesPipe
      ],
      providers: [
        StacheWindowRef,
        { provide: SkyAppResourcesService, useValue: mockSkyAppResourcesService },
        { provide: StacheRouteService, useValue: mockRouterService },
        { provide: StacheConfigService, useValue: mockConfigService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StacheFooterComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should update the footer settings based on the skyux config', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.footerLinks).toExist();
    expect(component.copyrightLabel).toBe(footerConfig.copyrightLabel);
    expect(component.siteName).toBe(mockConfigService.skyux.app.title);
  });

  it('should map the footerLinks from the skyux config to stacheNavLinks', () => {
    component.ngOnInit();
    fixture.detectChanges();

    let mappedFooterLinks = footerConfig.nav.items.map((navItem: any) => {
      return {
        name: navItem.title,
        path: navItem.route
      };
    });

    expect(component.footerLinks).toEqual(mappedFooterLinks);
  });

  it('should provide defaults if no values are supplied', () => {
    mockConfigService.skyux.appSettings.stache.footer = {};
    mockConfigService.skyux.app.title = undefined;
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.footerLinks).not.toEqual(footerConfig.nav);
    expect(component.footerLinks).toEqual([]);

    expect(component.copyrightLabel).not.toEqual(footerConfig.copyrightLabel);
    expect(component.copyrightLabel).toEqual('Blackbaud, Inc. All rights reserved.');

    expect(component.siteName).toBe(undefined);
  });

  it('should be accessible', async(() => {
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement).toBeAccessible();
  }));
});

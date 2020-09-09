import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  ActivatedRoute
} from '@angular/router';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  of
} from 'rxjs';

import {
  SkyDocsSupportalService
} from '../../shared/docs-tools-supportal.service';

import {
  DemoPageFixtureComponent
} from './demo-page.component.fixture';

import {
  SkyDocsDemoPageDomAdapterService
} from '../demo-page-dom-adapter.service';

import {
  SkyDocsDemoPageModule
} from '../demo-page.module';

import {
  SkyDocsDemoPageTitleService
} from '../demo-page-title.service';

class MockActivatedRoute {
  public fragment = of({});
  public queryParams = of({});
  public params = of({});
  public url = of([]);
}

class MockSkyAppConfig {
  public runtime: any = {
    command: 'build',
    app: {
      base: '/demo-test-base/'
    },
    routes: []
  };

  public skyux: any = {
    app: 'demo-test',
    appSettings: {
      myLibrary: {
        name: 'DemoTestLibrary'
      },
      stache: {
        googleAnalytics: {
          clientId: ''
        }
      }
    },
    host: {
      url: 'https://www.example.com'
    },
    name: 'demo-test'
  };
}

@NgModule({
  imports: [
    CommonModule,
    RouterTestingModule,
    SkyDocsDemoPageModule
  ],
  exports: [
    DemoPageFixtureComponent
  ],
  declarations: [
    DemoPageFixtureComponent
  ],
  providers: [
    {
      provide: ActivatedRoute,
      useClass: MockActivatedRoute
    },
    {
      provide: SkyAppConfig,
      useClass: MockSkyAppConfig
    },
    SkyDocsDemoPageDomAdapterService,
    SkyDocsDemoPageTitleService,
    SkyDocsSupportalService
  ]
})
export class DemoPageFixturesModule { }

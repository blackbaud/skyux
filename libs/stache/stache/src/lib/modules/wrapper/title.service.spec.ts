import {
  Title
} from '@angular/platform-browser';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  StacheTitleService
} from './title.service';

class MockSkyAppConfig {
  public skyux = {
    app: {
      title: 'My Title'
    }
  };

  public runtime = { };
}

class MockTitle extends Title {
  constructor() {
    super({});
  }
}

describe('StacheTitleService', () => {
  let titleService: StacheTitleService;
  let ngTitle: MockTitle;

  beforeEach(() => {
    const appConfig = new MockSkyAppConfig() as SkyAppConfig;
    ngTitle = new MockTitle();
    titleService = new StacheTitleService(ngTitle as Title, appConfig);
  });

  it('should set the window title with the config app title', () => {
    titleService.setTitle();
    expect(ngTitle.getTitle()).toBe('My Title');
  });

  it('should set the window title with the config app title and a provided value', () => {
    titleService.setTitle('My Page');
    expect(ngTitle.getTitle()).toBe('My Page - My Title');
  });
});

import { Title } from '@angular/platform-browser';

import { SkyAppConfig } from '@blackbaud/skyux-builder/runtime';
import { SkyuxConfig } from '@blackbaud/skyux-builder/runtime/config';

import { StacheTitleService } from './title.service';

describe('StacheTitleService', () => {
  let titleService: StacheTitleService;
  let ngTitle: Title;

  beforeEach(() => {
    let skyAppConfig = new SkyAppConfig();
    ngTitle = new Title();

    skyAppConfig.skyux = {
      app: {
        title: 'My Title'
      }
    } as SkyuxConfig;

    titleService = new StacheTitleService(ngTitle, skyAppConfig);
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

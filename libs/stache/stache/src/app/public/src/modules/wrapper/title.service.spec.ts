import { Title } from '@angular/platform-browser';

import { StacheTitleService } from './title.service';
import { StacheConfigService } from '../shared';

class MockStacheConfigService {
  public skyux = {
    app: {
      title: 'My Title'
    }
  };

  public runtime = { };
}

describe('StacheTitleService', () => {
  let titleService: StacheTitleService;
  let ngTitle: Title;

  beforeEach(() => {
    const appConfig = new MockStacheConfigService() as StacheConfigService;
    ngTitle = new Title();
    titleService = new StacheTitleService(ngTitle, appConfig);
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

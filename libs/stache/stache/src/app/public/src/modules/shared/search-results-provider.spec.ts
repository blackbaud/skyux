import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';
import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { StacheSearchResultsProvider, StacheHttpService, StacheConfigService } from './index';

class MockHttpService {
  public post = jasmine.createSpy('post').and.callFake((url: string, body: any) => {
    console.log(url);
    console.log(body);
    let options = new ResponseOptions({
      body: {
        count: 2,
        results: [
          {
            document: {
              title: 'Test Page',
              site_name: 'stache2',
              text: 'This is a page',
              host: 'https://host.nxt.blackbaud.com',
              path: '/test-one'
            }
          },
          {
            document: {
              title: 'Test With Highlights',
              site_name: 'stache2',
              text: 'This is a page with highlights',
              host: 'https://host.nxt.blackbaud.com',
              path: '/test-highlight'
            },
            highlights: {
              text: ['Highlight one', 'Highlight two']
            }
          }
        ]
      },
      url: url
    });
    let response = new Response(options);
    return Observable.of(response);
  });
  public get = function () {};
}

class MockConfigService {
  public runtime: any = {};
  public skyux: any = {
    name: 'stache2',
    auth: true,
    appSettings: {
      stache: {
        searchConfig: {

        }
      }
    }
  };
}

describe('Stache Search Results Provider', () => {
  let stacheSearchResultsProvider: StacheSearchResultsProvider;
  let mockHttpService: MockHttpService;
  let mockConfigService: MockConfigService;
  let searchObject: any = {
    searchText: 'test'
  };

  beforeEach(() => {
    mockHttpService = new MockHttpService();
    mockConfigService = new MockConfigService();

    stacheSearchResultsProvider = new StacheSearchResultsProvider(
      mockHttpService as StacheHttpService,
      mockConfigService as StacheConfigService
    );
  });

  it('should have a getSearchResults method', () => {
    expect(stacheSearchResultsProvider.getSearchResults).toBeDefined();
  });

  it('should use all defaults if config not provided', () => {
    mockConfigService.skyux.appSettings.stache = undefined;
    stacheSearchResultsProvider = new StacheSearchResultsProvider(
      mockHttpService as StacheHttpService,
      mockConfigService as StacheConfigService
    );
    stacheSearchResultsProvider.getSearchResults(searchObject)
      .then((results: any) => {
        expect(console.log).toHaveBeenCalledWith('Auth HTTP');
        expect(console.log).toHaveBeenCalledWith('https://stache-search-query.sky.blackbaud.com/query');
      });
  });

  it('should query the internal endpoint by default', () => {
    spyOn(console, 'log');
    stacheSearchResultsProvider.getSearchResults(searchObject)
      .then((results: any) => {
        expect(console.log).toHaveBeenCalledWith('https://stache-search-query.sky.blackbaud.com/query');
      });
  });

  it('should query the public endpoint if is_internal is false', () => {
    spyOn(console, 'log');
    mockConfigService.skyux.appSettings.stache.searchConfig.is_internal = false;
    stacheSearchResultsProvider = new StacheSearchResultsProvider(
      mockHttpService as StacheHttpService,
      mockConfigService as StacheConfigService
    );

    stacheSearchResultsProvider.getSearchResults(searchObject)
      .then((results: any) => {
        expect(console.log).toHaveBeenCalledWith('https://stache-search-query.sky.blackbaud.com/query-public');
        expect(console.log).toHaveBeenCalledWith({
          site_names: ['stache2'],
          search_string: 'test'
        });
      });
  });

  it('should use the custom endpoints if provided', () => {
    spyOn(console, 'log');
    mockConfigService.skyux.appSettings.stache.searchConfig.endpoints = {
      internal: 'internal-test',
      public: 'public-test'
    };
    stacheSearchResultsProvider = new StacheSearchResultsProvider(
      mockHttpService as StacheHttpService,
      mockConfigService as StacheConfigService
    );

    stacheSearchResultsProvider.getSearchResults(searchObject)
      .then((results: any) => {
        expect(console.log).toHaveBeenCalledWith('https://stache-search-query.sky.blackbaud.com/internal-test');
      });
  });

  it('should use the custom site_names if provided', () => {
    spyOn(console, 'log');
    mockConfigService.skyux.appSettings.stache.searchConfig.site_names = [
      'test',
      'stache2'
    ];
    stacheSearchResultsProvider = new StacheSearchResultsProvider(
      mockHttpService as StacheHttpService,
      mockConfigService as StacheConfigService
    );

    stacheSearchResultsProvider.getSearchResults(searchObject)
      .then((results: any) => {
        expect(console.log).toHaveBeenCalledWith({
          site_names: ['test', 'stache2'],
          search_string: 'test'
        });
      });
  });

  it('should use the custom query url if provided', () => {
    spyOn(console, 'log');
    mockConfigService.skyux.appSettings.stache.searchConfig.url = 'https://google.com';
    stacheSearchResultsProvider = new StacheSearchResultsProvider(
      mockHttpService as StacheHttpService,
      mockConfigService as StacheConfigService
    );

    stacheSearchResultsProvider.getSearchResults(searchObject)
      .then((results: any) => {
        expect(console.log).toHaveBeenCalledWith('https://google.com/query');
      });
  });

  it('should use the custom results config options if provided', () => {
    mockConfigService.skyux.appSettings.stache.searchConfig.moreResultsUrl = 'https://google.com';
    mockConfigService.skyux.appSettings.stache.searchConfig.moreResultsLabel = 'Test Label';
    mockConfigService.skyux.appSettings.stache.searchConfig.htmlFields = {
      title: true,
      description: true
    };

    stacheSearchResultsProvider = new StacheSearchResultsProvider(
      mockHttpService as StacheHttpService,
      mockConfigService as StacheConfigService
    );

    stacheSearchResultsProvider.getSearchResults(searchObject)
      .then((results: any) => {
        expect(results.moreResults.label).toBe('Test Label');
        expect(results.moreResults.url).toBe('https://google.com');
        expect(results.htmlFields.length).toBe(2);
        expect(results.htmlFields.title).toBe(true);
      });
  });

  it('should handle results with highlights and without highlights', () => {
    stacheSearchResultsProvider.getSearchResults(searchObject)
      .then((results: any) => {
        expect(results.items.length).toBe(2);
        expect(results.items[1].description).toContain('Highlight one');
        expect(results.items[0].description).not.toBeDefined();
      });
  });

  it('should return a message if there are no search results', () => {
    mockHttpService.post = jasmine.createSpy('post').and.callFake(() => {
      let options = new ResponseOptions({
        body: {
          count: 0
        }
      });
      let response = new Response(options);
      return Observable.of(response);
    });
    stacheSearchResultsProvider = new StacheSearchResultsProvider(
      mockHttpService as StacheHttpService,
      mockConfigService as StacheConfigService
    );

    stacheSearchResultsProvider.getSearchResults(searchObject)
      .then((results: any) => {
        expect(results.items.length).toBe(1);
        expect(results.items[0].title).toBe('No results found.');
      });
  });

  it('should show more search results if the count is greater than 10 and the results url is defined', () => {
    mockConfigService.skyux.appSettings.stache.searchConfig.moreResultsUrl = 'https://google.com';
    mockHttpService.post = jasmine.createSpy('post').and.callFake(() => {
      let options = new ResponseOptions({
        body: {
          count: 11,
          results: [{
            document: {
              title: 'Test Page',
              site_name: 'stache2',
              text: 'This is a page',
              host: 'https://host.nxt.blackbaud.com',
              path: '/test-one'
            }
          },
          {
            document: {
              title: 'Test With Highlights',
              site_name: 'stache2',
              text: 'This is a page with highlights',
              host: 'https://host.nxt.blackbaud.com',
              path: '/test-highlight'
            },
            highlights: {
              text: ['Highlight one', 'Highlight two']
            }
          },
          {
            document: {
              title: 'Test With Highlights',
              site_name: 'stache2',
              text: 'This is a page with highlights',
              host: 'https://host.nxt.blackbaud.com',
              path: '/test-highlight'
            },
            highlights: {
              text: ['Highlight one', 'Highlight two']
            }
          },
          {
            document: {
              title: 'Test With Highlights',
              site_name: 'stache2',
              text: 'This is a page with highlights',
              host: 'https://host.nxt.blackbaud.com',
              path: '/test-highlight'
            },
            highlights: {
              text: ['Highlight one', 'Highlight two']
            }
          },
          {
            document: {
              title: 'Test With Highlights',
              site_name: 'stache2',
              text: 'This is a page with highlights',
              host: 'https://host.nxt.blackbaud.com',
              path: '/test-highlight'
            },
            highlights: {
              text: ['Highlight one', 'Highlight two']
            }
          },
          {
            document: {
              title: 'Test With Highlights',
              site_name: 'stache2',
              text: 'This is a page with highlights',
              host: 'https://host.nxt.blackbaud.com',
              path: '/test-highlight'
            },
            highlights: {
              text: ['Highlight one', 'Highlight two']
            }
          },
          {
            document: {
              title: 'Test With Highlights',
              site_name: 'stache2',
              text: 'This is a page with highlights',
              host: 'https://host.nxt.blackbaud.com',
              path: '/test-highlight'
            },
            highlights: {
              text: ['Highlight one', 'Highlight two']
            }
          },
          {
            document: {
              title: 'Test With Highlights',
              site_name: 'stache2',
              text: 'This is a page with highlights',
              host: 'https://host.nxt.blackbaud.com',
              path: '/test-highlight'
            },
            highlights: {
              text: ['Highlight one', 'Highlight two']
            }
          },
          {
            document: {
              title: 'Test With Highlights',
              site_name: 'stache2',
              text: 'This is a page with highlights',
              host: 'https://host.nxt.blackbaud.com',
              path: '/test-highlight'
            },
            highlights: {
              text: ['Highlight one', 'Highlight two']
            }
          },
          {
            document: {
              title: 'Test With Highlights',
              site_name: 'stache2',
              text: 'This is a page with highlights',
              host: 'https://host.nxt.blackbaud.com',
              path: '/test-highlight'
            },
            highlights: {
              text: ['Highlight one', 'Highlight two']
            }
          },
          {
            document: {
              title: 'Test With Highlights',
              site_name: 'stache2',
              text: 'This is a page with highlights',
              host: 'https://host.nxt.blackbaud.com',
              path: '/test-highlight'
            },
            highlights: {
              text: ['Highlight one', 'Highlight two']
            }
          }]
        }
      });
      let response = new Response(options);
      return Observable.of(response);
    });
    stacheSearchResultsProvider = new StacheSearchResultsProvider(
      mockHttpService as StacheHttpService,
      mockConfigService as StacheConfigService
    );

    stacheSearchResultsProvider.getSearchResults(searchObject)
      .then((results: any) => {
        console.log('RESULTS', results);
        expect(results.items.length).toBe(11);
        expect(results.moreResults.label).toBe('Show More');
        expect(results.moreResults.url).toBe('https://google.com');
      });
  });

  it('should return an error if there is a problem with the query', () => {
    mockHttpService.post = jasmine.createSpy('post').and.callFake(() => {
      let options = new ResponseOptions({
        status: 500
      });
      let response = new Response(options);
      return Observable.of(response);
    });
    stacheSearchResultsProvider = new StacheSearchResultsProvider(
      mockHttpService as StacheHttpService,
      mockConfigService as StacheConfigService
    );

    stacheSearchResultsProvider.getSearchResults(searchObject)
      .catch((error: any) => {
        expect(error).toBeDefined();
      });
  });

});

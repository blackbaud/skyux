import { Injectable, Optional } from '@angular/core';
import { SkyAuthHttp } from '@blackbaud/skyux-builder/runtime';
import { HttpClient } from '@angular/common/http';
import { StacheConfigService } from './config.service';
import { StacheSearchResult } from './search-result';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class StacheSearchResultsProvider {

  private moreResultsUrl: string;
  private moreResultsLabel: string = 'Show More';
  private htmlFields: any = {
    description: true
  };
  private isInternal: boolean = true;
  private siteNames: string[] = [];
  private endpoints: any = {
    internal: 'query',
    public: 'query-public'
  };
  private queryUrlBase: string = 'https://stache-search-query.sky.blackbaud.com';
  private searchConfig: any  = {};

  constructor(
    private http: HttpClient,
    private config: StacheConfigService,
    @Optional() private authHttp: SkyAuthHttp
  ) {
    this.initSearchConfig();
    this.initResultsConfig();
    this.initIsInternal();
    this.initEndpoints();
    this.initSiteNames();
    this.initUrl();
  }

  public getSearchResults(searchArgs: any): Promise<any> {
    let body = {
      site_names: this.siteNames,
      search_string: searchArgs.searchText
    };

    const handleError = (error: any) => {
      console.log('Unable to process search request.');
    };

    const handleResponse = (res: any) => {
      let response = res.json();
      if (response.count === 0) {
        return {
          items: [{ title: 'No results found.' }]
        };
      }

      let results: any = {
        htmlFields: this.htmlFields,
        items: response.results.map((item: StacheSearchResult) => {
          return {
            title: item.document.title,
            subtitle: item.document.site_name,
            description: item.highlights ? item.highlights.text[0] : undefined,
            url: item.document.host + '/' + item.document.site_name + item.document.path
          };
        })
      };

      if (response.count > 10 && this.moreResultsUrl !== undefined) {
        results.moreResults = {
          label: this.moreResultsLabel,
          url: this.moreResultsUrl
        };
      }

      return results;
    };

    if (this.config.skyux.auth === true) {
      return this.authHttp.post(this.getQueryUrl(), body)
        .toPromise()
        .then(handleResponse)
        .catch(handleError);
    }

    return this.http.post(this.getQueryUrl(), body)
      .toPromise()
      .then(handleResponse)
      .catch(handleError);
  }

  private getQueryUrl(): string {
    if (!this.isInternal) {
      return `${this.queryUrlBase}/${this.endpoints.public}`;
    } else {
      return `${this.queryUrlBase}/${this.endpoints.internal}`;
    }
  }

  private initSearchConfig(): void {
    if (
      this.config &&
      this.config.skyux.appSettings &&
      this.config.skyux.appSettings.stache &&
      this.config.skyux.appSettings.stache.searchConfig !== undefined
    ) {
      this.searchConfig = this.config.skyux.appSettings.stache.searchConfig;
    }
  }

  private initEndpoints(): void {
    if (this.searchConfig.endpoints !== undefined) {
      this.endpoints = this.searchConfig.endpoints;
    }
  }

  private initIsInternal(): void {
    if (this.searchConfig.is_internal !== undefined) {
      this.isInternal = this.searchConfig.is_internal;
    }
  }

  private initResultsConfig(): void {
    if (this.searchConfig.moreResultsUrl !== undefined) {
      this.moreResultsUrl = this.searchConfig.moreResultsUrl;
    }

    if (this.searchConfig.moreResultsLabel !== undefined) {
      this.moreResultsLabel = this.searchConfig.moreResultsLabel;
    }

    if (this.searchConfig.htmlFields !== undefined) {
      this.htmlFields = this.searchConfig.htmlFields;
    }
  }

  private initSiteNames(): void {
    if (this.searchConfig.site_names !== undefined) {
      this.siteNames = this.searchConfig.site_names;
    } else {
      this.siteNames = [this.config.skyux.name];
    }
  }

  private initUrl(): void {
    if (this.searchConfig.url !== undefined) {
      this.queryUrlBase = this.searchConfig.url;
    }
  }

}

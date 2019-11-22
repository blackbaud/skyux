import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import {
  SkyDocsComponentInfo
} from './docs-tools-component-info';

@Injectable()
export class SkyDocsSupportalService {
  constructor(
    private http: HttpClient
  ) {}

  public getComponentsInfo(): Observable<SkyDocsComponentInfo[]> {
    return this.http
      .get('https://sky-pusa01.app.blackbaud.net/skysp/v1/docs/components-info')
      .map((results: any) => results['components'])
      .share();
  }
}

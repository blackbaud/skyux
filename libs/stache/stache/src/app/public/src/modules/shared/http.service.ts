import { Injectable } from '@angular/core';
import { RequestOptionsArgs } from '@angular/http';

@Injectable()
export class StacheHttpService {
  public post(url: string, body: any, options?: RequestOptionsArgs): any { }
  public get(url: string, options?: RequestOptionsArgs): any { }
}

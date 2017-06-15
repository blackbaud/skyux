import { Injectable } from '@angular/core';

@Injectable()
export class StacheConfigService {
  public skyux: any = {
    app: {
      title: ''
    }
  };

  public runtime: any = {
    routes: []
  };
}

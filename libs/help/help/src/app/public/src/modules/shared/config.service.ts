import { Injectable } from '@angular/core';

@Injectable()
export class BBHelpConfigService {
  public skyux: any = {
    app: {
      title: ''
    }
  };

  public runtime: any = {
    routes: []
  };
}

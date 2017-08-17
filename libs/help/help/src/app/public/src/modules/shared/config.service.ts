import { Injectable } from '@angular/core';

@Injectable()
export class LibraryConfigService {
  public skyux: any = {
    app: {
      title: ''
    }
  };

  public runtime: any = {
    routes: []
  };
}

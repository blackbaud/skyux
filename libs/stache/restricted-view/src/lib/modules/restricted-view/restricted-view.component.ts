import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { SkyRestrictedViewAuthService } from './restricted-view-auth.service';

@Component({
  selector: 'sky-restricted-view',
  templateUrl: './restricted-view.component.html',
})
export class SkyRestrictedViewComponent {
  public isAuthenticated: Observable<boolean>;

  constructor(private authService: SkyRestrictedViewAuthService) {
    this.isAuthenticated = this.authService.isAuthenticated;
  }
}

import { Component } from '@angular/core';
import { StacheAuthService } from './auth.service';

@Component({
  selector: 'stache-internal',
  templateUrl: './internal.component.html'
})
export class StacheInternalComponent {
  public isAuthenticated: boolean = false;
  constructor(private authService: StacheAuthService) {
    this.authService.isAuthenticated.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
  }
 }

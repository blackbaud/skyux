import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SkyAppViewportService } from '@skyux/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public height = 60;

  constructor(public router: Router, viewportSvc: SkyAppViewportService) {
    viewportSvc.reserveSpace({
      id: 'controls',
      position: 'top',
      size: this.height,
    });
  }
}

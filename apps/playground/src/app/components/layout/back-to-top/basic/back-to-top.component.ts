import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  templateUrl: './back-to-top.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BackToTopComponent {}

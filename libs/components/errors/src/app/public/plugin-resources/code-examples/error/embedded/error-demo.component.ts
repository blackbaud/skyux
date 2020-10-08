import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-error-demo',
  templateUrl: './error-demo.component.html',
  styles: [`
    ::ng-deep .sky-error {
      margin: 40px 0;
    }
  `]
})
export class ErrorDemoComponent {

  public customAction(): void {
    alert('action clicked!');
  }

}

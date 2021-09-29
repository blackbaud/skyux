import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-url-validation-demo',
  templateUrl: './url-validation-demo.component.html'
})
export class UrlValidationDemoComponent {

  public demoModel: {
    url?: string;
  } = {};

}

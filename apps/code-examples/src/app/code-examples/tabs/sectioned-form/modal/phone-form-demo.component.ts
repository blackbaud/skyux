import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-phone-form-demo',
  templateUrl: './phone-form-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneFormDemoComponent {}

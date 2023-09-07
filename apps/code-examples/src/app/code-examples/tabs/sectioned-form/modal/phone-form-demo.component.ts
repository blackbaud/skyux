import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-phone-form-demo',
  templateUrl: './phone-form-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class PhoneFormDemoComponent {}

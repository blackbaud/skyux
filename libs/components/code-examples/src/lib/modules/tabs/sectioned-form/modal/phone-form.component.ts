import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-phone-form',
  template: `<div>Phone form</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneFormComponent {}

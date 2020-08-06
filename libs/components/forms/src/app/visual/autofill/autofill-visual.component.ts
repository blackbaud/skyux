import {
  Component
} from '@angular/core';

@Component({
  selector: 'autofill-visual',
  templateUrl: './autofill-visual.component.html'
})
export class AutofillVisualComponent {

  public autofill: string = 'on';

  public onToggleAutofillClick(): void {
    this.autofill === 'on' ? this.autofill = 'off' : this.autofill = 'on';
  }
}

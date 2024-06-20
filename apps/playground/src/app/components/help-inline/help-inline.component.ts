import { ChangeDetectorRef, Component, inject } from '@angular/core';

@Component({
  selector: 'app-help-inline',
  templateUrl: './help-inline.component.html',
})
export class HelpInlineComponent {
  public popoverOpen = false;

  #changeDetector = inject(ChangeDetectorRef);

  public popoverChange(isOpen): void {
    this.popoverOpen = isOpen;
    this.#changeDetector.markForCheck();
  }
}

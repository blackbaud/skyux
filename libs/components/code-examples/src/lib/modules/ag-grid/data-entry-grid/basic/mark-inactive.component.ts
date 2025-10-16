import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-mark-inactive',
  templateUrl: './mark-inactive.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkInactiveComponent {
  @Input()
  public set name(value: string | undefined) {
    this.#_name = value;
    if (value) {
      this.markInactiveAriaLabel = `Mark ${value} inactive`;
    }
  }

  public get name(): string | undefined {
    return this.#_name;
  }

  protected markInactiveAriaLabel = '';

  #_name: string | undefined;

  protected markInactive(): void {
    console.error(`Mark inactive action clicked for ${this.name}`);
  }
}

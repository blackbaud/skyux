import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

/**
 * Wraps all behavior demo components and handles the configuration and appearance of the behavior demo.
 * @example
 * ```markup
 * <sky-docs-demo>
 *   Demo content here.
 * </sky-docs-demo>
 * ```
 */
@Component({
  selector: 'sky-docs-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoComponent {

  public get toggleOptionsButtonIcon(): string {
    return (this.areOptionsVisible) ? 'chevron-up' : 'chevron-down';
  }

  public areOptionsVisible = false;

  public onToggleOptionsButtonClick(): void {
    this.areOptionsVisible = !this.areOptionsVisible;
  }

}

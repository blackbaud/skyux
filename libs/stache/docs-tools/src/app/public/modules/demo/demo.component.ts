import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  QueryList
} from '@angular/core';

import {
  SkyDocsDemoContentAlignment
} from './demo-content-alignment';

import {
  SkyDocsDemoControlPanelComponent
} from './demo-control-panel.component';

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

  @Input()
  public set alignContents(value: SkyDocsDemoContentAlignment) {
    this._alignContents = value;
  }

  public get alignContents(): SkyDocsDemoContentAlignment {
    return this._alignContents || 'left';
  }

  public get hasOptions(): boolean {
    return this.controlPanels && this.controlPanels.length > 0;
  }

  @ContentChildren(SkyDocsDemoControlPanelComponent, { read: ElementRef })
  private controlPanels: QueryList<SkyDocsDemoControlPanelComponent>;

  public get toggleOptionsButtonIcon(): string {
    return (this.areOptionsVisible) ? 'chevron-up' : 'chevron-down';
  }

  public areOptionsVisible = false;

  private _alignContents: SkyDocsDemoContentAlignment;

  public onToggleOptionsButtonClick(): void {
    this.areOptionsVisible = !this.areOptionsVisible;
  }

}

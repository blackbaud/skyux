import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  QueryList
} from '@angular/core';

import {
  SkyThemeSettings
} from '@skyux/theme';

import {
  SkyDocsDemoContentAlignment
} from './demo-content-alignment';

import {
  SkyDocsDemoControlPanelComponent
} from './demo-control-panel.component';

import {
  SkyDocsDemoThemeService
} from './demo-theme.service';

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
  providers: [SkyDocsDemoThemeService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoComponent {

  /**
   * Specifies the horizontal alignment of the demo contents.
   * @default 'left'
   */
  @Input()
  public set alignContents(value: SkyDocsDemoContentAlignment) {
    this._alignContents = value;
  }

  public get alignContents(): SkyDocsDemoContentAlignment {
    return this._alignContents || 'left';
  }

  /**
   * Custom heading text for the demo.
   */
  @Input()
  public heading: string;

  @Input()
  public set supportsTheming(value: boolean) {
    this.demoThemeSvc.supportsTheming.next(value);
  }

  public themeSettings: SkyThemeSettings;

  public get hasOptions(): boolean {
    return this.supportsTheming || (this.controlPanels && this.controlPanels.length > 0);
  }

  @ContentChildren(SkyDocsDemoControlPanelComponent, { read: ElementRef })
  private controlPanels: QueryList<SkyDocsDemoControlPanelComponent>;

  public get toggleOptionsButtonIcon(): string {
    return (this.areOptionsVisible) ? 'chevron-up' : 'chevron-down';
  }

  public areOptionsVisible = false;

  private _alignContents: SkyDocsDemoContentAlignment;

  constructor(public demoThemeSvc: SkyDocsDemoThemeService) { }

  public onToggleOptionsButtonClick(): void {
    this.areOptionsVisible = !this.areOptionsVisible;
  }

}

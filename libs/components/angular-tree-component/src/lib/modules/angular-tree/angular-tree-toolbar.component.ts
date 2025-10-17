import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import { SkyToolbarModule } from '@skyux/layout';

/**
 * @internal
 */
@Component({
  selector: 'sky-angular-tree-toolbar',
  templateUrl: './angular-tree-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyI18nModule, SkyIconModule, SkyToolbarModule],
})
export class SkyAngularTreeToolbarComponent {
  @Input()
  public showSelectButtons: boolean | undefined;

  @Output()
  public clearAllClick = new EventEmitter<void>();

  @Output()
  public collapseAllClick = new EventEmitter<void>();

  @Output()
  public expandAllClick = new EventEmitter<void>();

  @Output()
  public selectAllClick = new EventEmitter<void>();

  public onClearAllClick(): void {
    this.clearAllClick.emit();
  }

  public onCollapseAllClick(): void {
    this.collapseAllClick.emit();
  }

  public onExpandAllClick(): void {
    this.expandAllClick.emit();
  }

  public onSelectAllClick(): void {
    this.selectAllClick.emit();
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'sky-angular-tree-toolbar',
  templateUrl: './angular-tree-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyTreeViewToolbarComponent {

  @Input()
  public showSelectButtons: boolean;

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

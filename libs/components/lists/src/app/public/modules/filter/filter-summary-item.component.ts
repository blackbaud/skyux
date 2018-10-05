import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'sky-filter-summary-item',
  styleUrls: ['./filter-summary-item.component.scss'],
  templateUrl: './filter-summary-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyFilterSummaryItemComponent {
  @Input()
  public dismissible = true;

  @Output()
  public dismiss = new EventEmitter<void>();

  @Output()
  public itemClick = new EventEmitter<void>();

  public onItemDismiss() {
    this.dismiss.emit();
  }

  public onItemClick() {
    this.itemClick.emit();
  }

  public onItemKeypress() {
    this.itemClick.emit();
  }
}

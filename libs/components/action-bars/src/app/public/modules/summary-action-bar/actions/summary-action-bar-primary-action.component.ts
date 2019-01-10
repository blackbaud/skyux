import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'sky-summary-action-bar-primary-action',
  templateUrl: './summary-action-bar-primary-action.component.html',
  styleUrls: ['./summary-action-bar-primary-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkySummaryActionBarPrimaryActionComponent {

  @Input()
  public disabled = false;

  @Output()
  public actionClick = new EventEmitter<void>();

  public onButtonClicked(): void {
    this.actionClick.emit();
  }
}

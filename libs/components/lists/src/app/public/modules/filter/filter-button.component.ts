import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

let nextId = 0;

@Component({
  selector: 'sky-filter-button',
  styleUrls: ['./filter-button.component.scss'],
  templateUrl: './filter-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyFilterButtonComponent {
  private _filterButtonId: string;

  @Input()
  public get filterButtonId() {
    return this._filterButtonId || `sky-filter-button-${++nextId}`;
  }
  public set filterButtonId(value: string) {
    this._filterButtonId = value;
  }

  @Input()
  public ariaControls: string;

  @Input()
  public ariaExpanded: boolean;

  @Input()
  public active = false;

  @Input()
  public showButtonText = false;

  @Input()
  public disabled: boolean = false;

  @Output()
  public filterButtonClick: EventEmitter<any> = new EventEmitter();

  public filterButtonOnClick() {
    this.filterButtonClick.emit(undefined);
  }
}

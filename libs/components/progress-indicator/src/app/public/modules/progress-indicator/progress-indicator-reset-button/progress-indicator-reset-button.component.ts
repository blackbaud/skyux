import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';

import {
  SkyProgressIndicatorComponent
} from '../progress-indicator.component';
import {
  SkyProgressIndicatorMessageType
} from '../types';

@Component({
  selector: 'sky-progress-indicator-reset-button',
  templateUrl: './progress-indicator-reset-button.component.html',
  styleUrls: ['./progress-indicator-reset-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyProgressIndicatorResetButtonComponent implements OnDestroy {

  @Input()
  public progressIndicator: SkyProgressIndicatorComponent;

  @Input()
  public get disabled(): boolean {
    return this._disabled || false;
  }
  public set disabled(value: boolean) {
    this._disabled = value;
  }

  @Output()
  public resetClick = new EventEmitter<any>();

  private _disabled: boolean;

  public resetProgress(): void {
    this.resetClick.emit();
    this.progressIndicator.messageStream.next(SkyProgressIndicatorMessageType.Reset);
  }

  public ngOnDestroy(): void {
    this.resetClick.complete();
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { SkyResourcesService } from '../resources';

@Component({
  selector: 'sky-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyTokenComponent {
  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
  }

  public get disabled(): boolean {
    return (this._disabled === true);
  }

  @Input()
  public set ariaLabel(value: string) {
    this._ariaLabel = value;
  }
  public get ariaLabel() {
    return this._ariaLabel || this.skyResourcesService.getString('token_dismiss_button_title');
  }

  @Input()
  public set dismissible(value: boolean) {
    this._dismissible = value;
  }

  public get dismissible(): boolean {
    return (this._dismissible !== false);
  }

  @Input()
  public set focusable(value: boolean) {
    this._focusable = value;
  }

  public get focusable(): boolean {
    return (this._focusable !== false);
  }

  @Output()
  public dismiss = new EventEmitter<void>();

  @Output()
  public tokenFocus = new EventEmitter<void>();

  public get tabIndex(): number | boolean {
    return (this.focusable) ? 0 : -1;
  }

  private _ariaLabel: string;
  private _disabled: boolean;
  private _dismissible: boolean;
  private _focusable: boolean;

  constructor(
    private elementRef: ElementRef,
    private skyResourcesService: SkyResourcesService
  ) { }

  public dismissToken() {
    this.dismiss.emit();
  }

  public focusElement() {
    this.elementRef.nativeElement.querySelector('.sky-token').focus();
  }
}

// #region imports
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import {
  AnimationEvent
} from '@angular/animations';

import {
  skyAnimationEmerge
} from '@skyux/animations';

import {
  SkyToastType
} from './types';
// #endregion

@Component({
  selector: 'sky-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  animations: [
    skyAnimationEmerge
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyToastComponent implements OnInit {
  @Input()
  public set toastType(value: SkyToastType) {
    this._toastType = value;
  }

  public get toastType(): SkyToastType {
    return (this._toastType === undefined) ? SkyToastType.Info : this._toastType;
  }

  @Output()
  public closed = new EventEmitter<void>();

  public get animationState(): string {
    return (this.isOpen) ? 'open' : 'closed';
  }

  public get ariaLive(): string {
    return (this.toastType === SkyToastType.Danger) ? 'assertive' : 'polite';
  }

  public get ariaRole(): string {
    return (this.toastType === SkyToastType.Danger) ? 'alert' : undefined;
  }

  public get classNames(): string {
    const classNames: string[] = [];

    let typeLabel: string;
    switch (this.toastType) {
      case SkyToastType.Danger:
      typeLabel = 'danger';
      break;

      case SkyToastType.Info:
      default:
      typeLabel = 'info';
      break;

      case SkyToastType.Success:
      typeLabel = 'success';
      break;

      case SkyToastType.Warning:
      typeLabel = 'warning';
      break;
    }

    classNames.push(
      `sky-toast-${typeLabel}`
    );

    return classNames.join(' ');
  }

  private isOpen = false;

  private _toastType: SkyToastType;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this.isOpen = true;
  }

  public onAnimationDone(event: AnimationEvent) {
    if (event.toState === 'closed') {
      this.closed.emit();
      this.closed.complete();
    }
  }

  public close() {
    this.isOpen = false;
    this.changeDetector.markForCheck();
  }
}

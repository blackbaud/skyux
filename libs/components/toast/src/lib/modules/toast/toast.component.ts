import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { SkyIdModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyToastResourcesModule } from '../shared/sky-toast-resources.module';

import { SkyToasterService } from './toaster.service';
import { SkyToastType } from './types/toast-type';

const AUTO_CLOSE_MILLISECONDS = 6000;
const SKY_TOAST_TYPE_DEFAULT = SkyToastType.Info;

/**
 * @internal
 */
@Component({
  selector: 'sky-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    SkyIconModule,
    SkyIdModule,
    SkyThemeModule,
    SkyToastResourcesModule,
  ],
})
export class SkyToastComponent implements OnInit, OnDestroy {
  /**
   * Whether to automatically close the toast. Only close toasts
   * automatically if users can access the messages after the toasts close.
   */
  @Input()
  public autoClose: boolean | undefined;

  /**
   * The `SkyToastType` type for the toast to determine the color and icon to display.
   */
  @Input()
  public set toastType(value: SkyToastType | undefined) {
    this.toastTypeOrDefault = value ?? SKY_TOAST_TYPE_DEFAULT;
    this.#updateForToastType();
  }

  /**
   * Fires when the toast closes.
   */
  @Output()
  public closed = new EventEmitter<void>();

  public get isOpen(): boolean {
    return this.#isOpen;
  }

  public ariaLive = 'polite';
  public ariaRole: string | undefined;
  public classNames = '';
  public iconName = 'info';
  public toastTypeOrDefault: SkyToastType = SKY_TOAST_TYPE_DEFAULT;

  #autoCloseTimeoutId: unknown;
  #isOpen = false;
  #ngUnsubscribe = new Subject<void>();

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #toasterService = inject(SkyToasterService, { optional: true });
  readonly #ngZone = inject(NgZone);

  public ngOnInit(): void {
    this.#isOpen = true;

    this.startAutoCloseTimer();

    if (this.#toasterService) {
      combineLatest([
        this.#toasterService.focusIn,
        this.#toasterService.mouseOver,
      ])
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(([hasFocus, hasMouseOver]) => {
          if (hasFocus || hasMouseOver) {
            this.stopAutoCloseTimer();
          } else {
            this.startAutoCloseTimer();
          }
        });
    }

    this.#updateForToastType();
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();

    this.stopAutoCloseTimer();
  }

  public onAnimationDone(event: TransitionEvent): void {
    if (event.propertyName !== 'opacity') {
      return;
    }

    if (!this.#isOpen) {
      this.closed.emit();
      this.closed.complete();
    }
  }

  public close(): void {
    this.stopAutoCloseTimer();

    this.#isOpen = false;
    this.#changeDetector.markForCheck();
  }

  public startAutoCloseTimer(): void {
    if (
      this.autoClose &&
      (!this.#toasterService ||
        (!this.#toasterService.focusIn.getValue() &&
          !this.#toasterService.mouseOver.getValue()))
    ) {
      this.stopAutoCloseTimer();

      this.#ngZone.runOutsideAngular(() => {
        this.#autoCloseTimeoutId = setTimeout(() => {
          this.close();
        }, AUTO_CLOSE_MILLISECONDS);
      });
    }
  }

  public stopAutoCloseTimer(): void {
    if (this.#autoCloseTimeoutId) {
      clearTimeout(this.#autoCloseTimeoutId as number);
    }
  }

  #updateForToastType(): void {
    let icon: string;

    switch (this.toastTypeOrDefault) {
      case SkyToastType.Danger:
      case SkyToastType.Warning:
        icon = 'warning';
        break;
      case SkyToastType.Info:
        icon = 'info';
        break;
      case SkyToastType.Success:
        icon = 'success';
        break;
    }

    this.iconName = icon;

    let typeLabel: string;
    switch (this.toastTypeOrDefault) {
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

    this.classNames = `sky-toast-${typeLabel}`;
  }
}

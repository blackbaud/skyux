import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { SkyCoreAdapterService } from '@skyux/core';

import { SkyInlineDeleteAdapterService } from './inline-delete-adapter.service';
import { SkyInlineDeleteType } from './inline-delete-type';

/**
 * Auto-incrementing integer used to generate unique ids for inline delete components.
 */
let nextId = 0;

@Component({
  selector: 'sky-inline-delete',
  styleUrls: ['./inline-delete.component.scss'],
  templateUrl: './inline-delete.component.html',
  providers: [SkyCoreAdapterService, SkyInlineDeleteAdapterService],
  standalone: false,
})
export class SkyInlineDeleteComponent implements AfterViewInit, OnDestroy {
  /**
   * Whether the deletion is pending.
   * @default false
   */
  @Input()
  public pending: boolean | undefined = false;

  /**
   * Fires when users click the cancel button.
   */
  @Output()
  public cancelTriggered = new EventEmitter<void>();

  /**
   * Fires when users click the delete button.
   */
  @Output()
  public deleteTriggered = new EventEmitter<void>();

  public assistiveTextId = `sky-inline-delete-assistive-text-${++nextId}`;

  public type: SkyInlineDeleteType = SkyInlineDeleteType.Standard;

  @ViewChild('delete', {
    read: ElementRef,
    static: false,
  })
  public deleteButton: ElementRef | undefined;

  #adapterService: SkyInlineDeleteAdapterService;
  #changeDetector: ChangeDetectorRef;
  #elRef: ElementRef;

  constructor(
    adapterService: SkyInlineDeleteAdapterService,
    changeDetector: ChangeDetectorRef,
    elRef: ElementRef,
  ) {
    this.#adapterService = adapterService;
    this.#changeDetector = changeDetector;
    this.#elRef = elRef;
  }

  /**
   * @internal
   */
  public ngAfterViewInit(): void {
    this.deleteButton?.nativeElement.focus();
    /* istanbul ignore else */
    if (this.#elRef) {
      this.#adapterService.setEl(this.#elRef.nativeElement);
    }
  }

  /**
   * @internal
   */
  public ngOnDestroy(): void {
    this.#adapterService.clearListeners();
    this.cancelTriggered.complete();
    this.deleteTriggered.complete();
  }

  /**
   * @internal
   */
  public onCancelClick(): void {
    this.cancelTriggered.emit();
  }

  /**
   * @internal
   */
  public onDeleteClick(): void {
    this.deleteTriggered.emit();
  }

  /**
   * Sets the inline delete to one of its predefined types.
   * @param type The inline delete type
   * @internal
   */
  public setType(type: SkyInlineDeleteType): void {
    this.type = type;
    this.#changeDetector.detectChanges();
  }
}

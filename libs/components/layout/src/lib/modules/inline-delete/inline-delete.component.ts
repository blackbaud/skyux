import { AnimationEvent } from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
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
export class SkyInlineDeleteComponent implements OnDestroy, OnInit {
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

  public animationState = 'shown';

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
   * Initialization lifecycle hook
   * @internal
   */
  public ngOnInit(): void {
    this.animationState = 'shown';
  }

  /**
   * Destruction lifecycle hook
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
    this.animationState = 'hidden';
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

  /**
   * Handles actions that should be taken after the inline delete animates
   * @param event The animation event
   * @internal
   */
  public onAnimationDone(event: AnimationEvent): void {
    if (event.toState === 'hidden') {
      this.cancelTriggered.emit();
    } else {
      this.deleteButton?.nativeElement.focus();
      /* istanbul ignore else */
      if (this.#elRef) {
        this.#adapterService.setEl(this.#elRef.nativeElement);
      }
    }
  }
}

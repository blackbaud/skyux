import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  WritableSignal,
  inject,
  input,
  signal,
} from '@angular/core';

import { Subject } from 'rxjs';

import { SkyPopoverComponent } from '../popover.component';
import { SkyPopoverDirective } from '../popover.directive';
import { SkyPopoverAlignment } from '../types/popover-alignment';
import { SkyPopoverMessage } from '../types/popover-message';
import { SkyPopoverMessageType } from '../types/popover-message-type';
import { SkyPopoverPlacement } from '../types/popover-placement';
import { SkyPopoverTrigger } from '../types/popover-trigger';

@Component({
  selector: 'sky-test-component',
  templateUrl: './popover.component.fixture.html',
  styleUrls: ['./popover.component.fixture.scss'],
  standalone: false,
})
export class PopoverFixtureComponent implements AfterViewInit {
  readonly #changeDetectorRef = inject(ChangeDetectorRef);

  //#region directive properties

  public alignment = input<SkyPopoverAlignment | undefined>(undefined);

  public messageStream: WritableSignal<Subject<SkyPopoverMessage> | undefined> =
    signal(new Subject<SkyPopoverMessage>());

  public placement = input<SkyPopoverPlacement | undefined>(undefined);

  public popoverAlignment: SkyPopoverAlignment | undefined;

  public popoverPlacement: SkyPopoverPlacement | undefined;

  public popoverTitle: string | undefined;

  public skyPopover: WritableSignal<SkyPopoverComponent | undefined> =
    signal(undefined);

  public trigger: SkyPopoverTrigger | undefined;

  //#endregion directive properties

  @ViewChild('directiveRef', {
    read: ElementRef,
  })
  public callerElementRef: ElementRef | undefined;

  @ViewChild('directiveRef', {
    read: SkyPopoverDirective,
  })
  public directiveRef: SkyPopoverDirective | undefined;

  /**
   * Used to test popover directives that do not set any inputs.
   */
  @ViewChild('noArgsDirectiveRef', {
    read: SkyPopoverDirective,
  })
  public noArgsDirectiveRef: SkyPopoverDirective | undefined;

  @ViewChild('popoverRef', {
    read: SkyPopoverComponent,
    static: true,
  })
  public popoverRef: SkyPopoverComponent | undefined;

  public height: number | undefined;

  public showFocusableChildren: boolean | undefined;

  public popoverType = input<'info' | 'danger' | undefined>(undefined);

  public ngAfterViewInit(): void {
    // Avoid expression changed after checked errors in unit tests.
    // Signal write auto-marks the OnPush fixture dirty so the binding
    // propagates to the directive on the next detectChanges call.
    setTimeout(() => {
      this.skyPopover.set(this.popoverRef);
    });
  }

  public onPopoverClosed(): void {}

  public onPopoverOpened(): void {}

  public sendMessage(messageType: SkyPopoverMessageType): void {
    this.messageStream()?.next({ type: messageType });
  }

  public setHeight(height: number): void {
    this.height = height;
    this.#changeDetectorRef.markForCheck();
  }
}

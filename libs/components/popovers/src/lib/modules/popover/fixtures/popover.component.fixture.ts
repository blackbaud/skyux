import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
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
export class PopoverFixtureComponent implements OnInit, AfterViewInit {
  //#region directive properties

  public alignment: SkyPopoverAlignment | undefined;

  public messageStream: Subject<SkyPopoverMessage> | undefined =
    new Subject<SkyPopoverMessage>();

  public placement: SkyPopoverPlacement | undefined;

  public popoverAlignment: SkyPopoverAlignment | undefined;

  public popoverPlacement: SkyPopoverPlacement | undefined;

  public popoverTitle: string | undefined;

  public skyPopover: SkyPopoverComponent | undefined;

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

  public popoverType: 'info' | 'danger' | undefined;

  public ngOnInit(): void {
    if (this.popoverRef) {
      this.popoverRef.enableAnimations = false;
    }
  }

  public ngAfterViewInit(): void {
    // Avoid expression changed after checked errors in unit tests.
    setTimeout(() => {
      this.skyPopover = this.popoverRef;
    });
  }

  public onPopoverClosed(): void {}

  public onPopoverOpened(): void {}

  public sendMessage(messageType: SkyPopoverMessageType): void {
    this.messageStream?.next({ type: messageType });
  }

  public setHeight(height: number): void {
    this.height = height;
  }
}

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Subject } from 'rxjs';

import { SkyPopoverAlignment } from '../types/popover-alignment';

import { SkyPopoverMessage } from '../types/popover-message';

import { SkyPopoverMessageType } from '../types/popover-message-type';

import { SkyPopoverPlacement } from '../types/popover-placement';

import { SkyPopoverTrigger } from '../types/popover-trigger';

import { SkyPopoverComponent } from '../popover.component';

import { SkyPopoverDirective } from '../popover.directive';

@Component({
  selector: 'sky-test-component',
  templateUrl: './popover.component.fixture.html',
  styleUrls: ['./popover.component.fixture.scss'],
})
export class PopoverFixtureComponent implements OnInit, AfterViewInit {
  //#region directive properties

  public alignment: SkyPopoverAlignment;

  public dismissOnBlur: boolean;

  public messageStream = new Subject<SkyPopoverMessage>();

  public placement: SkyPopoverPlacement;

  public popoverAlignment: SkyPopoverAlignment;

  public popoverPlacement: SkyPopoverPlacement;

  public popoverTitle: string;

  public skyPopover: SkyPopoverComponent;

  public trigger: SkyPopoverTrigger;

  //#endregion directive properties

  @ViewChild('directiveRef', {
    read: ElementRef,
  })
  public callerElementRef: ElementRef;

  @ViewChild('directiveRef', {
    read: SkyPopoverDirective,
  })
  public directiveRef: SkyPopoverDirective;

  @ViewChild('popoverRef', {
    read: SkyPopoverComponent,
    static: true,
  })
  public popoverRef: SkyPopoverComponent;

  public height: number;

  public showFocusableChildren = false;

  public popoverType: 'info' | 'danger';

  public ngOnInit(): void {
    this.popoverRef.enableAnimations = false;
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
    this.messageStream.next({ type: messageType });
  }

  public setHeight(height: number): void {
    this.height = height;
  }
}

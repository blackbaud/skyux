import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  inject,
} from '@angular/core';
import { SkyIdService } from '@skyux/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyTabIdService } from '../shared/tab-id.service';

import { SkyVerticalTabComponent } from './vertical-tab.component';
import { SkyVerticalTabsetAdapterService } from './vertical-tabset-adapter.service';
import { SkyVerticalTabsetGroupService } from './vertical-tabset-group.service';
import { SkyVerticalTabsetService } from './vertical-tabset.service';

@Component({
  selector: 'sky-vertical-tabset-group',
  templateUrl: './vertical-tabset-group.component.html',
  styleUrls: ['./vertical-tabset-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyVerticalTabsetGroupService],
  standalone: false,
})
export class SkyVerticalTabsetGroupComponent implements OnInit, OnDestroy {
  /**
   * Whether to disable the ability to expand and collapse the group.
   * @default false
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    this.#_disabled = value;
    this.#updateSlideDirection();
  }

  public get disabled(): boolean | undefined {
    return this.#_disabled;
  }

  /**
   * The header for the collapsible group of tabs.
   */
  @Input()
  public groupHeading: string | undefined;

  /**
   * Whether the collapsible group is expanded.
   * @default false
   */
  @Input()
  public set open(value: boolean | undefined) {
    this.#_open = value;
    this.#updateSlideDirection();
  }

  public get open(): boolean | undefined {
    return this.#_open;
  }

  @ContentChildren(SkyVerticalTabComponent)
  public tabs: QueryList<SkyVerticalTabComponent> | undefined;

  @ViewChild('groupHeadingButton')
  public groupHeadingButton: ElementRef | undefined;
  public slideDirection: 'down' | 'up' = 'up';

  protected groupId: string;

  #ngUnsubscribe = new Subject<void>();

  #tabService: SkyVerticalTabsetService;
  #changeRef: ChangeDetectorRef;
  #adapterService = inject(SkyVerticalTabsetAdapterService);
  #idService = inject(SkyIdService);
  #tabIdService = inject(SkyTabIdService);
  #groupService = inject(SkyVerticalTabsetGroupService);

  #_disabled: boolean | undefined;
  #_open: boolean | undefined = false;

  constructor(
    tabService: SkyVerticalTabsetService,
    changeRef: ChangeDetectorRef,
  ) {
    this.#tabService = tabService;
    this.#changeRef = changeRef;

    this.groupId = this.#idService.generateId();

    this.#groupService.messageStream.subscribe((message) => {
      switch (message.messageType) {
        case 'focus':
          this.#focusButton();
      }
    });
  }

  public ngOnInit(): void {
    this.#tabIdService.register(this.groupId, this.groupId);

    this.#tabService.addGroup(this);

    this.#tabService.hidingTabs
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => this.#tabsHidden());

    this.#tabService.showingTabs
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => this.#tabsShown());

    this.#tabService.tabClicked
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => this.#tabClicked());
  }

  public ngOnDestroy(): void {
    this.#tabService.destroyGroup(this);

    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();

    this.#tabIdService.unregister(this.groupId);
  }

  public toggleMenuOpen(): void {
    if (!this.disabled) {
      this.open = !this.open;
    }

    this.#updateSlideDirection();
    this.#changeRef.markForCheck();
  }

  protected groupButtonArrowLeft(event: Event): void {
    if (this.open) {
      this.toggleMenuOpen();
    }

    event.preventDefault();
  }

  protected groupButtonArrowRight(event: Event): void {
    if (this.open) {
      this.tabs?.get(0)?.focusButton();
    } else {
      this.toggleMenuOpen();
    }

    event.preventDefault();
  }

  public isActive(): boolean {
    return !!this.tabs && this.tabs.find((t) => !!t.active) !== undefined;
  }

  #tabClicked(): void {
    this.#changeRef.markForCheck();
  }

  #tabsHidden(): void {
    this.#updateSlideDirection();
    this.#changeRef.markForCheck();
  }

  #tabsShown(): void {
    this.#updateSlideDirection();
    this.#changeRef.markForCheck();
  }

  #updateSlideDirection(): void {
    this.slideDirection = this.open && !this.disabled ? 'down' : 'up';
  }

  #focusButton(): void {
    this.#adapterService.focusButton(this.groupHeadingButton);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  contentChildren,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  SkyIdModule,
  SkyIdService,
  _SkyAnimationSlideComponent,
} from '@skyux/core';
import { SkyExpansionIndicatorModule } from '@skyux/indicators';

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
  imports: [
    SkyExpansionIndicatorModule,
    SkyIdModule,
    _SkyAnimationSlideComponent,
  ],
})
export class SkyVerticalTabsetGroupComponent {
  /**
   * Whether to disable the ability to expand and collapse the group.
   * @default false
   */
  public readonly disabled = input<boolean | undefined>(false);

  /**
   * The header for the collapsible group of tabs.
   */
  public readonly groupHeading = input<string | undefined>();

  /**
   * Whether the collapsible group is expanded.
   * @default false
   */
  public readonly open = model<boolean | undefined>(false);

  public readonly tabs = contentChildren(SkyVerticalTabComponent);

  public readonly groupHeadingButton =
    viewChild<ElementRef>('groupHeadingButton');

  public readonly slideDirection = computed<'down' | 'up'>(() =>
    this.#forceOpen() || (this.open() && !this.disabled()) ? 'down' : 'up',
  );

  protected readonly groupId: string;

  protected readonly isActive = computed(() => {
    this.#tabClickVersion();
    const tabs = this.tabs();
    return tabs.length > 0 && tabs.some((t) => t.active);
  });

  readonly #tabService = inject(SkyVerticalTabsetService);
  readonly #adapterService = inject(SkyVerticalTabsetAdapterService);
  readonly #groupService = inject(SkyVerticalTabsetGroupService);

  readonly #forceOpen = signal(false);
  readonly #tabClickVersion = signal(0);

  constructor() {
    const idService = inject(SkyIdService);
    const tabIdService = inject(SkyTabIdService);
    const destroyRef = inject(DestroyRef);

    this.groupId = idService.generateId();
    tabIdService.register(this.groupId, this.groupId);
    this.#tabService.addGroup(this);

    destroyRef.onDestroy(() => {
      this.#tabService.destroyGroup(this);
      tabIdService.unregister(this.groupId);
    });

    this.#groupService.messageStream
      .pipe(takeUntilDestroyed())
      .subscribe((message) => {
        if (message.messageType === 'focus') {
          this.#adapterService.focusButton(this.groupHeadingButton());
        }
      });

    this.#tabService.hidingTabs
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.#forceOpen.set(true));

    this.#tabService.showingTabs
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.#forceOpen.set(false));

    this.#tabService.tabClicked
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.#tabClickVersion.update((v) => v + 1));
  }

  public toggleMenuOpen(): void {
    if (!this.disabled()) {
      this.open.set(!this.open());
    }
  }

  protected groupButtonArrowLeft(event: Event): void {
    if (this.open()) {
      this.toggleMenuOpen();
    }

    event.preventDefault();
  }

  protected groupButtonArrowRight(event: Event): void {
    if (this.open()) {
      this.tabs()[0]?.focusButton();
    } else {
      this.toggleMenuOpen();
    }

    event.preventDefault();
  }
}

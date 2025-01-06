import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Optional,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { SkyThemeService } from '@skyux/theme';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyDescriptionListService } from './description-list.service';

/**
 * Specifies the description in a term-description pair.
 */
@Component({
  selector: 'sky-description-list-description',
  templateUrl: './description-list-description.component.html',
  styleUrls: ['./description-list-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyDescriptionListDescriptionComponent
  implements OnDestroy, OnInit
{
  public defaultDescription: string | undefined;

  public themeName: string | undefined;

  @ViewChild('descriptionTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  public templateRef!: TemplateRef<unknown> | undefined;

  #changeDetector: ChangeDetectorRef;
  #ngUnsubscribe = new Subject<void>();
  #themeSvc: SkyThemeService | undefined;

  constructor(
    public service: SkyDescriptionListService,
    changeDetector: ChangeDetectorRef,
    @Optional() themeSvc?: SkyThemeService,
  ) {
    this.#changeDetector = changeDetector;
    this.#themeSvc = themeSvc;
  }

  public ngOnInit(): void {
    /* istanbul ignore else */
    if (this.#themeSvc) {
      this.#themeSvc.settingsChange
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((themeSettings) => {
          this.themeName = themeSettings.currentSettings.theme.name;
          this.#changeDetector.markForCheck();
        });
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }
}

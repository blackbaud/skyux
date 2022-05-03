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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDescriptionListDescriptionComponent
  implements OnDestroy, OnInit
{
  public defaultDescription: string;

  public themeName: string;

  @ViewChild('descriptionTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  public templateRef: TemplateRef<unknown>;

  private ngUnsubscribe = new Subject();

  constructor(
    public service: SkyDescriptionListService,
    private changeRef: ChangeDetectorRef,
    @Optional() private themeSvc?: SkyThemeService
  ) {}

  public ngOnInit(): void {
    /* istanbul ignore else */
    if (this.themeSvc) {
      this.themeSvc.settingsChange
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((themeSettings) => {
          this.themeName = themeSettings.currentSettings.theme.name;
          this.changeRef.markForCheck();
        });
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

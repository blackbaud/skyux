import {
  ChangeDetectorRef,
  Directive,
  Input,
  OnDestroy,
  Optional,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';

import { SkyThemeSettings } from './theme-settings';

import { SkyThemeService } from './theme.service';

/**
 * Component that works like `ngIf` to show markup for matching theme.
 *
 * If the directive is within a `skyTheme` directive, it uses settings from that directive.
 */
@Directive({
  selector: '[skyThemeIf]',
})
export class SkyThemeIfDirective implements OnDestroy {
  /**
   * A string that should match the name of a theme, `'default'` or `'modern'`.
   *
   * @param value
   */
  @Input()
  public set skyThemeIf(value: 'default' | 'modern') {
    this.context = value;
    this.updateView();
  }

  private context: string;
  private currentTheme: SkyThemeSettings | undefined;
  private ngUnsubscribe = new Subject();
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    changeDetector: ChangeDetectorRef,
    @Optional() themeSvc?: SkyThemeService
  ) {
    if (themeSvc) {
      themeSvc.settingsChange
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((settingsChange) => {
          this.currentTheme = settingsChange.currentSettings;
          this.updateView();

          // Components that use OnPush change detection will not automatically
          // check for changes when created as a result of a theme change if
          // it happens outside of an Angular change detection cycle. This
          // ensures change detection runs on those components.
          changeDetector.markForCheck();
        });
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private updateView(): void {
    const themeName = this.currentTheme?.theme.name || 'default';
    const condition = this.context && themeName === this.context;
    if (condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

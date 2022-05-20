import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
} from '@skyux/theme';

import { Subscription } from 'rxjs';

@Component({
  selector: 'sky-preview-wrapper',
  templateUrl: './preview-wrapper.component.html',
  styleUrls: ['./preview-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewWrapperComponent implements OnInit, OnDestroy {
  public theme = new SkyThemeSettings(
    SkyTheme.presets.default,
    SkyThemeMode.presets.light
  );

  private ngUnsubscribe = new Subscription();

  constructor(
    private themeService: SkyThemeService,
    @Inject(DOCUMENT) private readonly doc: Document
  ) {}

  public ngOnInit(): void {
    this.ngUnsubscribe.add(
      this.themeService.settingsChange.subscribe((settings) => {
        if (settings.previousSettings) {
          this.doc.body.classList.remove(
            settings.previousSettings.theme.hostClass,
            settings.previousSettings.mode.hostClass
          );
        }
        this.doc.body.classList.add(
          settings.currentSettings.theme.hostClass,
          settings.currentSettings.mode.hostClass
        );
      })
    );
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.unsubscribe();
  }
}

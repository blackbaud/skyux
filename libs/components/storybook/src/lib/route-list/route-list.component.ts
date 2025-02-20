import { DOCUMENT, KeyValuePipe } from '@angular/common';
import { Component, RendererFactory2, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ROUTES, Route, RouterLink } from '@angular/router';
import { SkyRadioModule } from '@skyux/forms';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeModule,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSpacing,
} from '@skyux/theme';

type RouteWithPath = Route & Required<Pick<Route, 'path'>>;

type ThemeOptionNames =
  | 'Default'
  | 'Modern'
  | 'Modern Compact'
  | 'Modern v2'
  | 'Modern v2 Compact';

/**
 * @internal
 */
@Component({
  selector: 'sky-route-list',
  imports: [
    RouterLink,
    SkyBoxModule,
    SkyFluidGridModule,
    SkyPageModule,
    SkyRadioModule,
    SkyThemeModule,
    ReactiveFormsModule,
    KeyValuePipe,
  ],
  templateUrl: './route-list.component.html',
  styleUrl: './route-list.component.css',
})
export class RouteListComponent {
  protected routes = inject(ROUTES)
    .flat()
    .filter((route): route is RouteWithPath => !!route.path)
    .sort((a, b) => a.path.localeCompare(b.path));

  protected readonly themeOptions: Record<ThemeOptionNames, SkyThemeSettings> =
    {
      Default: new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.light,
      ),
      Modern: new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
      ),
      'Modern Compact': new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
        SkyThemeSpacing.presets.compact,
      ),
      'Modern v2': new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
      ),
      'Modern v2 Compact': new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
        SkyThemeSpacing.presets.compact,
      ),
      // 'Modern Dark': new SkyThemeSettings(
      //   SkyTheme.presets.modern,
      //   SkyThemeMode.presets.dark,
      // ),
    };

  protected readonly themeField =
    inject(FormBuilder).nonNullable.control<ThemeOptionNames>('Modern');

  readonly #doc = inject(DOCUMENT);
  readonly #renderer = inject(RendererFactory2).createRenderer(null, null);
  readonly #themeSvc = inject(SkyThemeService);

  constructor() {
    this.#themeSvc.settingsChange
      .pipe(takeUntilDestroyed())
      .subscribe((settings) => {
        if (
          settings.previousSettings === this.themeOptions[this.themeField.value]
        ) {
          const modernV2 = this.#doc.body.classList.contains(
            'sky-theme-brand-blackbaud',
          );
          if (modernV2 && settings.currentSettings.theme.name === 'modern') {
            if (
              settings.currentSettings.spacing ===
              SkyThemeSpacing.presets.standard
            ) {
              this.themeField.setValue('Modern v2');
            } else {
              this.themeField.setValue('Modern v2 Compact');
            }
          } else if (settings.currentSettings.theme.name === 'modern') {
            if (
              settings.currentSettings.spacing ===
              SkyThemeSpacing.presets.standard
            ) {
              this.themeField.setValue('Modern');
            } else {
              this.themeField.setValue('Modern Compact');
            }
          } else {
            this.themeField.setValue('Default');
          }
        }
      });

    this.themeField.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((theme) => {
        this.#themeSvc.setTheme(this.themeOptions[theme]);
        this.#renderer[
          theme.includes('Modern v2') ? 'addClass' : 'removeClass'
        ](this.#doc.body, 'sky-theme-brand-blackbaud');
        this.#doc.defaultView?.localStorage.setItem('theme', theme);
      });

    const previousValue = this.#doc.defaultView?.localStorage.getItem('theme');
    if (previousValue) {
      this.themeField.setValue(previousValue as ThemeOptionNames);
    }
  }
}

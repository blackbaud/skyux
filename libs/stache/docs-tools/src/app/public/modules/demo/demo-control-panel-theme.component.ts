import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Optional,
  Output
} from '@angular/core';

import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

@Component({
  selector: 'sky-docs-demo-control-panel-theme',
  templateUrl: './demo-control-panel-theme.component.html',
  styleUrls: ['./demo-control-panel-theme.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoControlPanelThemeComponent implements OnDestroy, OnInit {

  @Output()
  public themeSettingsChange = new EventEmitter<SkyThemeSettings>();

  public get mode(): string {
    return this._mode;
  }

  public set mode(value: string) {
    this._mode = value;
    this.updateTheme();
  }

  public get theme(): string {
    return this._theme;
  }

  public set theme(value: string) {
    this._theme = value;
    this.updateModesForTheme();
    this.updateTheme();
  }

  public themeOptions: {
    label: string,
    value: string
  }[];

  public modeOptions: {
    label: string,
    value: string
  }[];

  private ngUnsubscribe = new Subject<void>();

  private _mode = 'light';

  private _theme = 'default';

  constructor(
    private changeDetector: ChangeDetectorRef,
    @Optional() private themeSvc?: SkyThemeService
  ) {
    // Update theme property with SkyThemeService if it has not been set.
    if (this.themeSvc) {
      this.themeSvc.settingsChange
        .pipe(
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe(change => {
          if (change.currentSettings.theme.name !== this.theme) {
            this.theme = change.currentSettings.theme.name;
          }

          if (change.currentSettings.mode.name !== this.mode) {
            this.mode = change.currentSettings.mode.name;
          }
          this.changeDetector.markForCheck();
      });
    }
  }

  public ngOnInit(): void {
    this.themeOptions = Object.keys(SkyTheme.presets).map(
      key => this.createRadioItem(key)
    );

    this.updateModesForTheme();
    this.updateTheme();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private updateModesForTheme(): void {
    let selectedTheme = this.getThemeByName(this.theme);

    this.modeOptions = selectedTheme.supportedModes
      .map(
        supportedMode => this.createRadioItem(supportedMode.name)
      );

    if (!this.modeOptions.some((item) => item.value === this.mode)) {
      this.mode = this.modeOptions[0].value;
    }
  }

  private createRadioItem(name: string): { label: string, value: string } {
    return {
      label: this.capitalize(name),
      value: name
    };
  }

  private capitalize(name: string): string {
    return name.charAt(0).toUpperCase() + name.substr(1);
  }

  private getThemeSettings(): SkyThemeSettings {
    return new SkyThemeSettings(
      this.getThemeByName(this.theme),
      this.getModeByName(this.mode)
    );
  }

  private getThemeByName(name: string): SkyTheme {
    const themePresets = SkyTheme.presets as {
      [key: string]: SkyTheme
    };

    return themePresets[name];
  }

  private getModeByName(name: string): SkyThemeMode {
    const modePresets = SkyThemeMode.presets as {
      [key: string]: SkyThemeMode
    };

    return modePresets[name];
  }

  private updateTheme(): void {
    this.themeSettingsChange.emit(this.getThemeSettings());
  }
}

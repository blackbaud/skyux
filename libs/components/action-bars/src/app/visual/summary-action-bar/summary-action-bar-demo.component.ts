import {
  Component,
  OnDestroy
} from '@angular/core';

import {
  SkyModalService
} from '@skyux/modals';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkySummaryActionBarModalDemoComponent
} from './summary-action-bar-modal-demo.component';

@Component({
  selector: 'sky-summary-action-bar-demo',
  templateUrl: './summary-action-bar-demo.component.html',
  styleUrls: ['./summary-action-bar-demo.component.scss']
})
export class SkySummaryActionBarDemoComponent implements OnDestroy {

  public layout: string = 'vertical';

  private ngUnsubscribe = new Subject();

  constructor(
    private modalService: SkyModalService,
    private themeSvc: SkyThemeService
  ) {
    this.themeSvc.settingsChange
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(change => {
        if (change.currentSettings.theme.name === 'modern') {
          this.layout = 'horizontal';
        } else {
          this.layout = 'vertical';
        }
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public printHello() {
    console.log('hello');
  }

  public openModal() {
    this.modalService.open(SkySummaryActionBarModalDemoComponent);
  }

  public openFullScreenModal() {
    this.modalService.open(SkySummaryActionBarModalDemoComponent, { fullPage: true });
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }
}

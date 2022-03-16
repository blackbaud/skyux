import { Directive, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SkyAppConfig } from '@skyux/config';

import { StacheWindowRef } from '../shared/window-ref';

@Directive({
  selector: '[stacheGoogleAnalytics]',
})
export class StacheGoogleAnalyticsDirective implements OnInit {
  private tagManagerContainerId = 'GTM-W56QP9';
  private analyticsClientId = 'UA-2418840-1';
  private isEnabled = true;
  private appName: string;

  public constructor(
    private windowRef: StacheWindowRef,
    private configService: SkyAppConfig,
    private router: Router
  ) {}

  public ngOnInit(): void {
    const isLoaded = this.windowRef.nativeWindow.ga;
    const isProduction = this.configService.runtime.command === 'build';

    this.updateDefaultConfigs();

    if (this.isEnabled && isProduction && !isLoaded) {
      this.addGoogleTagManagerScript();
      this.initGoogleAnalytics();
      this.bindPageViewsToRouter();
    }
  }

  public addGoogleTagManagerScript(): void {
    this.windowRef.nativeWindow.eval(`
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${this.tagManagerContainerId}');
    `);
  }

  /**
   * Because GTM adds the Google Analytics script to the page outside of our control,
   * instead of loading the GA script twice, we extract the 'ga' window method out so we can
   * subscribe to our router events and track SPA page views.
   */
  public initGoogleAnalytics(): void {
    this.windowRef.nativeWindow.eval(`
      (function(i,r) {
        i['GoogleAnalyticsObject']=r;
        i[r]=i[r]||function() {
          (i[r].q=i[r].q||[]).push(arguments)},
          i[r].l=1*new Date();
      })(window,'ga');
    `);
    this.windowRef.nativeWindow.ga('create', this.analyticsClientId, 'auto');
  }

  public bindPageViewsToRouter(): void {
    this.router.events.subscribe((event) => {
      /* istanbul ignore else*/
      if (event instanceof NavigationEnd) {
        const ga = this.windowRef.nativeWindow.ga;

        ga('set', 'page', `${this.appName}${event.urlAfterRedirects}`);
        ga('send', 'pageview');
      }
    });
  }

  private updateDefaultConfigs() {
    // TODO: the config service should handle defaults!
    const appSettings = this.configService.skyux.appSettings || {};
    appSettings.stache = appSettings.stache || {};
    appSettings.stache.googleAnalytics =
      appSettings.stache.googleAnalytics || {};

    if (appSettings.stache.googleAnalytics.tagManagerContainerId) {
      this.tagManagerContainerId =
        appSettings.stache.googleAnalytics.tagManagerContainerId;
    }

    if (appSettings.stache.googleAnalytics.clientId) {
      this.analyticsClientId = appSettings.stache.googleAnalytics.clientId;
    }

    this.appName = this.configService.runtime.app.base.replace(/^\/|\/$/g, '');

    switch (appSettings.stache.googleAnalytics.enabled) {
      case false:
      case 'false':
        this.isEnabled = false;
        break;
      default:
        break;
    }
  }
}

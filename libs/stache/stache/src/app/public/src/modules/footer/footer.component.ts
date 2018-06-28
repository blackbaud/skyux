import {
  Component,
  OnInit
} from '@angular/core';

import {
  SkyAppResourcesService
} from '@blackbaud/skyux-builder/runtime/i18n';

import 'rxjs/add/operator/take';

import {
  StacheConfigService
} from '../shared';

import {
  StacheNavLink
} from '../nav';

const _get = require('lodash.get');

@Component({
  selector: 'stache-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class StacheFooterComponent implements OnInit {
  public copyrightDate: Date;
  public copyrightLabel: string;
  public siteName: string;
  public footerLinks: StacheNavLink[];

  constructor(
    private configService: StacheConfigService,
    private resourcesService: SkyAppResourcesService
  ) { }

  public ngOnInit(): void {
    this.copyrightDate = new Date();
    this.setFooterData();
  }

  private setFooterData(): void {
    const navItems = _get(
      this.configService,
      'skyux.appSettings.stache.footer.nav.items',
      []
    );

    this.footerLinks = navItems.map((link: any) => {
      return {
        name: link.title,
        path: link.route
      } as StacheNavLink;
    });

    this.resourcesService.getString('stache_copyright_label')
      .take(1)
      .subscribe((value) => {
        this.copyrightLabel = _get(
          this.configService,
          'skyux.appSettings.stache.footer.copyrightLabel',
          value
        );
      });

    this.siteName = _get(
      this.configService,
      'skyux.app.title'
    );
  }
}

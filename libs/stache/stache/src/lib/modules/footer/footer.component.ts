import { Component, OnInit } from '@angular/core';
import { SkyAppConfig } from '@skyux/config';
import { SkyLibResourcesService } from '@skyux/i18n';

import _get from 'lodash.get';
import { first } from 'rxjs/operators';

import { StacheNavLink } from '../nav/nav-link';

@Component({
  selector: 'stache-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class StacheFooterComponent implements OnInit {
  public copyrightDate: Date;
  public copyrightLabel: string;
  public siteName: string;
  public footerLinks: StacheNavLink[];

  constructor(
    private configService: SkyAppConfig,
    private resourcesService: SkyLibResourcesService
  ) {}

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
        path: link.route,
      } as StacheNavLink;
    });

    this.resourcesService
      .getString('stache_copyright_label')
      .pipe(first())
      .subscribe((value) => {
        this.copyrightLabel = _get(
          this.configService,
          'skyux.appSettings.stache.footer.copyrightLabel',
          value
        );
      });

    this.siteName = _get(this.configService, 'skyux.app.title');
  }
}

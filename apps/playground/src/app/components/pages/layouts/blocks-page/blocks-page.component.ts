import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPageModalLink, SkyPageModule } from '@skyux/pages';

@Component({
  imports: [SkyBoxModule, SkyFluidGridModule, SkyPageModule],
  templateUrl: './blocks-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlocksPageComponent {
  protected readonly linksLoading = signal<'loading' | undefined>(undefined);

  protected readonly settingsLinks: SkyPageModalLink[] = [
    {
      label: 'Do not click this',
      click: (): void => {
        alert('You disappoint me.');
      },
    },
  ];
}

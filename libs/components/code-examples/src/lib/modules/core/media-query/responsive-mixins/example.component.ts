import { Component, OnDestroy, inject } from '@angular/core';
import {
  SkyModalError,
  SkyModalInstance,
  SkyModalService,
} from '@skyux/modals';
import { SkyPageModule } from '@skyux/pages';

import { ModalComponent } from './modal.component';
import { ResponsiveContentComponent } from './responsive-content.component';

/**
 * @title Responsive container mixins
 */
@Component({
  selector: 'app-responsive',
  standalone: true,
  templateUrl: './example.component.html',
  imports: [ResponsiveContentComponent, SkyPageModule],
})
export class ResponsiveMixinExampleComponent implements OnDestroy {
  public hasErrors = false;

  protected errors: SkyModalError[] = [];

  readonly #instances: SkyModalInstance[] = [];
  readonly #modalSvc = inject(SkyModalService);

  public ngOnDestroy(): void {
    this.#instances.forEach((i) => {
      i.close();
    });
  }

  public openModal(): void {
    const instance = this.#modalSvc.open(ModalComponent, {
      providers: [],
    });

    this.#instances.push(instance);
  }
}

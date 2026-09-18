import {
  Component,
  effect,
  inject,
  input,
  resource,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyIconModule } from '@skyux/icon';
import { SkyWaitModule } from '@skyux/indicators';
import {
  SkyDropdownMessage,
  SkyDropdownMessageType,
  SkyDropdownModule,
} from '@skyux/popovers';
import { filter, Subject, take } from 'rxjs';
import { DropdownItemsService } from './dropdown-items.service';

@Component({
  selector: 'app-dropdown-example',
  imports: [SkyDropdownModule, SkyIconModule, SkyWaitModule],
  templateUrl: './dropdown-example.component.html',
  styleUrl: './dropdown-example.component.scss',
})
export class DropdownExampleComponent {
  #itemsSvc = inject(DropdownItemsService);

  public readonly disabledState = input(true);
  protected readonly notDisabled = signal(false);

  protected readonly lazyLoadedMessageStream =
    new Subject<SkyDropdownMessage>();

  #dropdownInitialOpen = toSignal(
    this.lazyLoadedMessageStream.pipe(
      filter((message) => message.type === SkyDropdownMessageType.Open),
      take(1),
    ),
  );

  protected readonly lazyLoadedItems = resource({
    // Trigger loading the first time the message stream receives an "open" message.
    params: () => this.#dropdownInitialOpen(),
    loader: () => this.#itemsSvc.getItems(),
  });

  constructor() {
    effect(() => {
      if (this.lazyLoadedItems.hasValue()) {
        // Wait for the next render to focus the first item.
        setTimeout(() => {
          this.lazyLoadedMessageStream.next({
            type: SkyDropdownMessageType.FocusFirstItem,
          });
        });
      }
    });
  }

  public items = [
    { name: 'Option 1', disabled: this.notDisabled },
    { name: 'Disabled option', disabled: this.disabledState },
    { name: 'Option 3', disabled: this.notDisabled },
    { name: 'Option 4', disabled: this.notDisabled },
    { name: 'Option 5', disabled: this.notDisabled },
  ];

  public actionClicked(action: string): void {
    alert(`You selected ${action}.`);
  }
}

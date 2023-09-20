import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SkyDefaultInputProvider } from '@skyux/core';

/**
 * @internal
 */
@Component({
  selector: 'sky-angular-tree-context-menu',
  templateUrl: './angular-tree-context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDefaultInputProvider],
})
export class SkyAngularTreeContextMenuComponent {
  @Input()
  public set defaultInputProvider(value: SkyDefaultInputProvider | undefined) {
    this.#_defaultInputProvider = value;
    this.#updateAriaLabel();
  }

  public get defaultInputProvider(): SkyDefaultInputProvider | undefined {
    return this.#_defaultInputProvider;
  }

  @Input()
  public set ariaLabel(value: string | undefined) {
    this.#_ariaLabel = value;
    this.#updateAriaLabel();
  }

  public get ariaLabel(): string | undefined {
    return this.#_ariaLabel;
  }

  #_ariaLabel: string | undefined;

  #_defaultInputProvider: SkyDefaultInputProvider | undefined;

  #updateAriaLabel(): void {
    this.defaultInputProvider?.setValue('dropdown', 'label', this.ariaLabel);
  }
}

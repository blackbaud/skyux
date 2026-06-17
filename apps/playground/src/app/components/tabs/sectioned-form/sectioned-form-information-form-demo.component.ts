import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkySectionedFormService } from '@skyux/tabs';

@Component({
  selector: 'app-sectioned-form-information-form-demo',
  templateUrl: './sectioned-form-information-form-demo.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    SkyCheckboxModule,
    SkyFluidGridModule,
    SkyInputBoxModule,
  ],
})
export class SectionedFormInformationFormDemoComponent {
  public name = '';
  public id = '5324901';

  #_nameRequired: boolean | undefined = false;

  public get nameRequired(): boolean | undefined {
    return this.#_nameRequired;
  }
  public set nameRequired(value: boolean | undefined) {
    this.#_nameRequired = value;

    if (value) {
      this.#sectionService.requiredFieldChanged(true);
    } else {
      this.#sectionService.requiredFieldChanged(false);
    }
  }

  readonly #sectionService = inject(SkySectionedFormService);

  public checkValidity(): void {
    if (!this.name && this.nameRequired) {
      this.#sectionService.invalidFieldChanged(true);
    } else {
      this.#sectionService.invalidFieldChanged(false);
    }
  }

  public nameChange(newName: string): void {
    this.name = newName;

    this.checkValidity();
  }
}

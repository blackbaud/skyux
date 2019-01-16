import {
  Component
} from '@angular/core';

import {
  SkySectionedFormService
} from '../../public/modules/sectioned-form/sectioned-form.service';

@Component({
  selector: 'sky-demo-information-form',
  templateUrl: './demo-information-form.component.html'
})
export class SkyDemoInformationFormComponent {
  public name: string = '';
  public id: string = '5324901';

  private _nameRequired: boolean = false;

  public get nameRequired(): boolean {
    return this._nameRequired;
  }
  public set nameRequired(value: boolean) {
    this._nameRequired = value;
    this.emitRequiredChange();
  }

  public constructor(
    private sectionService: SkySectionedFormService
  ) { }

  public nameChange(newName: string): void {
    this.name = newName;
    this.emitRequiredChange();
  }

  private emitRequiredChange() {
    if (this.nameRequired && !this.name) {
      this.sectionService.requiredFieldChanged(true);
    } else {
      this.sectionService.requiredFieldChanged(false);
    }
  }
}

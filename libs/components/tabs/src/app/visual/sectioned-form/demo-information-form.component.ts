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

    if (this._nameRequired) {
      this.sectionService.requiredFieldChanged(true);
    } else {
      this.sectionService.requiredFieldChanged(false);
    }
  }

  public constructor(
    private sectionService: SkySectionedFormService
  ) { }

  public checkValidity(): void {
    if (!this.name && this.nameRequired) {
      this.sectionService.invalidFieldChanged(true);
    } else {
      this.sectionService.invalidFieldChanged(false);
    }
  }

  public nameChange(newName: string): void {
    this.name = newName;

    this.checkValidity();
  }
}

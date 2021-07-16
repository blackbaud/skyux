import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormArray,
  FormBuilder,
  FormGroup
} from '@angular/forms';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

import {
  SkySelectionBoxGridAlignItems
} from '../../public/public_api';

@Component({
  selector: 'selection-box-visual',
  templateUrl: './selection-box-visual.component.html'
})
export class SelectionBoxVisualComponent implements OnInit {

  public get checkboxArray(): FormArray {
    return this.myForm.get('checkboxes') as FormArray;
  }

  public alignItems: SkySelectionBoxGridAlignItems;

  public selectionBoxes: any[] = [
    {
      name: 'Save time and effort',
      description: 'Encourage supporters to interact with your organization'
    },
    {
      name: 'Sed vitae lectus congue',
      description: 'Donec vel sagittis turpis, at sollicitudin dolor'
    },
    {
      name: 'Cras felis enim',
      description: 'Sagittis id egestas ac, e sollicitudin vitae sem'
    },
    {
      name: 'Aliquam sit amet turpis vestibulum e luctus turpis eget',
      description: 'Donec tincidunt lectus et ligula dapibus, a iaculis nibh sagittis'
    },
    {
      name: 'Praesent sed fermentum elit',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus elementum placerat tortor, sit amet convallis ligula consequat sit amet. Etiam quis pretium nunc.'
    },
    {
      name: 'Nulla non felis feugiat',
      description: 'Donec vel sagittis turpis'
    },
    {
      name: 'Duis massa neque',
      description: 'Splacerat sit amet finibus a, varius vel tortor'
    }
  ];

  public myForm: FormGroup;

  public showDescription: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private themeSvc: SkyThemeService
  ) { }

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      checkboxes: this.buildCheckboxes()
    });
  }

  public onCenterAlignClick(): void {
    this.alignItems = SkySelectionBoxGridAlignItems.Center;
  }

  public onLeftAlignClick(): void {
    this.alignItems = SkySelectionBoxGridAlignItems.Left;
  }

  public onSubmit(value: any): void {
    console.log(value);
  }

  public onToggleDescriptionsClick(): void {
    this.showDescription = !this.showDescription;
  }

  public onToggleAbleFirstCheckboxClick(): void {
    if (this.myForm.get('checkboxes').get('0').disabled) {
      this.myForm
        .get('checkboxes')
        .get('0')
        .enable();
    } else {
      this.myForm
        .get('checkboxes')
        .get('0')
        .disable();
    }
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }

  private buildCheckboxes(): FormArray {
    const selectionBoxControls = this.selectionBoxes.map(aSelectionBox => {
      return this.formBuilder.control(aSelectionBox.undefinedValue);
    });
    return this.formBuilder.array(selectionBoxControls);
  }
}

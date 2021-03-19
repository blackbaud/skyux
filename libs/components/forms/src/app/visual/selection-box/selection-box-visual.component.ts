import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
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

  public alignItems: SkySelectionBoxGridAlignItems;

  public items: any[] = [
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

  constructor(
    private formBuilder: FormBuilder,
    private themeSvc: SkyThemeService
  ) { }

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      radioGroup: new FormControl(),
      checkboxGroup: this.formBuilder.array([
        new FormControl(),
        new FormControl(),
        new FormControl()
      ]),
      checkboxNoIconsGroup: this.formBuilder.array([
        new FormControl(),
        new FormControl(),
        new FormControl()
      ])
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

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }
}

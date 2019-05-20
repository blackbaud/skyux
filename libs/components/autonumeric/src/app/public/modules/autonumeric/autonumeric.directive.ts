import { Directive, ElementRef, Input, OnInit, Optional, HostListener } from '@angular/core';
import { NgModel } from '@angular/forms';

import { SkyAutonumericConfig } from './autonumeric-config';

const autoNumeric: any = require('autonumeric');

@Directive({
  selector: '[ngModel][skyAutonumeric],[skyAutonumeric]'
})
export class SkyAutonumericDirective implements OnInit {
  private _autonumericInstance: any;

  @Input() public skyAutonumericLanguagePreset: any;
  @Input() public skyAutonumericOptions: any;

  public oldValue: any;

  constructor (
    private _el: ElementRef,
    @Optional() private ngModel: NgModel,
    @Optional() private _globalConfig: SkyAutonumericConfig
  ) {
    this._globalConfig = this._globalConfig || new SkyAutonumericConfig();
  }

  public ngOnInit() {
    this._autonumericInstance = new autoNumeric(this._el.nativeElement);

    let preset = this.skyAutonumericLanguagePreset || this._globalConfig.languagePreset;
    if (preset) {
      this.updateAutonumericPreset(preset);
    }

    let options = {};
    if (this._globalConfig.options) {
      options = {...this._globalConfig.options};
    }
    if (this.skyAutonumericOptions) {
      options = {...options, ...this.skyAutonumericOptions};
    }
    this.updateAutonumericOptions(options);

    this._el.nativeElement.addEventListener('change paste onpaste', () => {
      this.autonumericChange();
    });

    this._el.nativeElement.addEventListener('keydown', (event: any) => {
      if (event.which === 13) {
        this.autonumericChange();
      }
    });
  }

  @HostListener('ngModelChange') public onNgModelChange() {
    let value = this._autonumericInstance.getNumber();

    if (this.oldValue !== value) {
      this.oldValue = value;

      setTimeout(() => {
        this.autonumericChange();
      });
    }
  }

  public updateAutonumericPreset(preset: string): void {
    this._autonumericInstance.update(autoNumeric.getPredefinedOptions()[preset]);
  }

  public updateAutonumericOptions(options: any): void {
    this._autonumericInstance.update(options);
  }

  private autonumericChange(): void {
    let value = this._autonumericInstance.getNumber();

    if (this.ngModel) {
      this.ngModel.viewToModelUpdate(value);
    }
  }
}

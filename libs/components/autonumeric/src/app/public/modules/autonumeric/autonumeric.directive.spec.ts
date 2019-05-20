import { Component } from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import {
  expect
} from '@skyux-sdk/testing';

import { SkyAutonumericDirective } from './autonumeric.directive';
import { SkyAutonumericConfig } from './autonumeric-config';

@Component({
  selector: 'autonumeric-directive-test',
  template: '<input type="text" skyAutonumeric [skyAutonumericLanguagePreset]="preset" [skyAutonumericOptions]="options">'
})
export class AutonumericDirectiveTestComponent {
  public preset: string;
  public options: any;
}

describe('Autonumeric directive', () => {
  let fixture: ComponentFixture<AutonumericDirectiveTestComponent>;
  let config: SkyAutonumericConfig;

  beforeEach(() => {
    config = new SkyAutonumericConfig();

    TestBed.configureTestingModule({
      declarations: [
        AutonumericDirectiveTestComponent,
        SkyAutonumericDirective
      ],
      providers: [
        {
          provide: SkyAutonumericConfig,
          useValue: config
        }
      ]
    });
  });

  it('successfully instantiates autonumeric without a global configuration', () => {
    // tslint:disable-next-line
    let autonumericDirectiveInstance = new SkyAutonumericDirective(undefined, undefined, null);
    expect((<any> autonumericDirectiveInstance)._globalConfig).toBeDefined();
  });

  it('successfully configures the autonumeric instance', () => {
    fixture = TestBed.createComponent(AutonumericDirectiveTestComponent);

    let testComponentElement = fixture.debugElement.query(By.directive(SkyAutonumericDirective));
    let directiveInstance = testComponentElement.injector.get(SkyAutonumericDirective);
    spyOn(directiveInstance, 'updateAutonumericPreset').and.callThrough();
    spyOn(directiveInstance, 'updateAutonumericOptions').and.callThrough();

    fixture.detectChanges();

    expect((<any> directiveInstance.updateAutonumericPreset).calls.any()).toBe(false);

    let optionsCall = (<any> directiveInstance.updateAutonumericOptions).calls.mostRecent();
    expect((<any> directiveInstance.updateAutonumericOptions).calls.count()).toBe(1);
    expect(Object.keys(optionsCall.args[0]).length).toBe(0);

    expect(directiveInstance.skyAutonumericLanguagePreset).toBe(undefined);
    expect(directiveInstance.skyAutonumericOptions).toBe(undefined);
  });

  it('successfully configures the autonumeric instance when preset and options attributes are ommitted', async(() => {
    TestBed.overrideComponent(AutonumericDirectiveTestComponent, {
      set: {
        template: '<input type="text" skyAutonumeric>'
      }
    });

    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(AutonumericDirectiveTestComponent);

      let testComponentElement = fixture.debugElement.query(By.directive(SkyAutonumericDirective));
      let directiveInstance = testComponentElement.injector.get(SkyAutonumericDirective);
      spyOn(directiveInstance, 'updateAutonumericPreset').and.callThrough();
      spyOn(directiveInstance, 'updateAutonumericOptions').and.callThrough();

      fixture.detectChanges();

      expect((<any> directiveInstance.updateAutonumericPreset).calls.any()).toBe(false);

      let optionsCall = (<any> directiveInstance.updateAutonumericOptions).calls.mostRecent();
      expect((<any> directiveInstance.updateAutonumericOptions).calls.count()).toBe(1);
      expect(Object.keys(optionsCall.args[0]).length).toBe(0);

      expect(directiveInstance.skyAutonumericLanguagePreset).toBe(undefined);
      expect(directiveInstance.skyAutonumericOptions).toBe(undefined);
    });
  }));

  it('successfully configures the autonumeric instance with a global preset and option', () => {
    config.languagePreset = 'dollar';
    config.options = {
      decimalPlaces: 5
    };

    fixture = TestBed.createComponent(AutonumericDirectiveTestComponent);

    let testComponentElement = fixture.debugElement.query(By.directive(SkyAutonumericDirective));
    let directiveInstance = testComponentElement.injector.get(SkyAutonumericDirective);
    spyOn(directiveInstance, 'updateAutonumericPreset').and.callThrough();
    spyOn(directiveInstance, 'updateAutonumericOptions').and.callThrough();

    fixture.detectChanges();

    let presetCall = (<any> directiveInstance.updateAutonumericPreset).calls.mostRecent();
    expect((<any> directiveInstance.updateAutonumericPreset).calls.count()).toBe(1);
    expect(presetCall.args[0]).toBe(config.languagePreset);

    let optionsCall = (<any> directiveInstance.updateAutonumericOptions).calls.mostRecent();
    expect((<any> directiveInstance.updateAutonumericOptions).calls.count()).toBe(1);
    expect(Object.keys(optionsCall.args[0]).length).toBe(1);
    expect(optionsCall.args[0].decimalPlaces).toBe(config.options.decimalPlaces);

    expect(directiveInstance.skyAutonumericLanguagePreset).toBe(undefined);
    expect(directiveInstance.skyAutonumericOptions).toBe(undefined);
  });

  it('successfully configures the autonumeric instance with a preset and options from the attribute', () => {
    fixture = TestBed.createComponent(AutonumericDirectiveTestComponent);

    fixture.componentInstance.preset = 'dollar';
    fixture.componentInstance.options = {
      decimalPlaces: 5
    };

    let testComponentElement = fixture.debugElement.query(By.directive(SkyAutonumericDirective));
    let directiveInstance = testComponentElement.injector.get(SkyAutonumericDirective);
    spyOn(directiveInstance, 'updateAutonumericPreset').and.callThrough();
    spyOn(directiveInstance, 'updateAutonumericOptions').and.callThrough();

    fixture.detectChanges();

    let presetCall = (<any> directiveInstance.updateAutonumericPreset).calls.mostRecent();
    expect((<any> directiveInstance.updateAutonumericPreset).calls.count()).toBe(1);
    expect(presetCall.args[0]).toBe(fixture.componentInstance.preset);

    let optionsCall = (<any> directiveInstance.updateAutonumericOptions).calls.mostRecent();
    expect((<any> directiveInstance.updateAutonumericOptions).calls.count()).toBe(1);
    expect(Object.keys(optionsCall.args[0]).length).toBe(1);
    expect(optionsCall.args[0].decimalPlaces).toBe(fixture.componentInstance.options.decimalPlaces);

    expect(directiveInstance.skyAutonumericLanguagePreset).toBe(fixture.componentInstance.preset);
    expect(directiveInstance.skyAutonumericOptions).toBe(fixture.componentInstance.options);
  });

  it('successfully configures the autonumeric instance with a global preset, global option and adds options from the attribute', () => {
    config.options = {
      decimalPlaces: 5
    };

    fixture = TestBed.createComponent(AutonumericDirectiveTestComponent);
    fixture.componentInstance.options = {
      digitGroupSeparator: ','
    };

    let testComponentElement = fixture.debugElement.query(By.directive(SkyAutonumericDirective));
    let directiveInstance = testComponentElement.injector.get(SkyAutonumericDirective);
    spyOn(directiveInstance, 'updateAutonumericPreset').and.callThrough();
    spyOn(directiveInstance, 'updateAutonumericOptions').and.callThrough();

    fixture.detectChanges();

    expect((<any> directiveInstance.updateAutonumericPreset).calls.any()).toBe(false);

    let optionsCall = (<any> directiveInstance.updateAutonumericOptions).calls.mostRecent();
    expect((<any> directiveInstance.updateAutonumericOptions).calls.count()).toBe(1);
    expect(Object.keys(optionsCall.args[0]).length).toBe(2);
    expect(optionsCall.args[0].decimalPlaces).toBe(config.options.decimalPlaces);
    expect(optionsCall.args[0].digitGroupSeparator).toBe(fixture.componentInstance.options.digitGroupSeparator);

    expect(directiveInstance.skyAutonumericLanguagePreset).toBe(undefined);
    expect(directiveInstance.skyAutonumericOptions).toBe(fixture.componentInstance.options);
  });

  it('successfully configures the autonumeric instance and overrides the global preset with the preset attribute', () => {
    config.languagePreset = 'dollar';

    fixture = TestBed.createComponent(AutonumericDirectiveTestComponent);
    fixture.componentInstance.preset = 'euro';

    let testComponentElement = fixture.debugElement.query(By.directive(SkyAutonumericDirective));
    let directiveInstance = testComponentElement.injector.get(SkyAutonumericDirective);
    spyOn(directiveInstance, 'updateAutonumericPreset').and.callThrough();
    spyOn(directiveInstance, 'updateAutonumericOptions').and.callThrough();

    fixture.detectChanges();

    expect((<any> directiveInstance)._globalConfig.languagePreset).toBe(config.languagePreset);

    let presetCall = (<any> directiveInstance.updateAutonumericPreset).calls.mostRecent();
    expect((<any> directiveInstance.updateAutonumericPreset).calls.count()).toBe(1);
    expect(presetCall.args[0]).toBe(fixture.componentInstance.preset);

    let optionsCall = (<any> directiveInstance.updateAutonumericOptions).calls.mostRecent();
    expect((<any> directiveInstance.updateAutonumericOptions).calls.count()).toBe(1);
    expect(Object.keys(optionsCall.args[0]).length).toBe(0);

    expect(directiveInstance.skyAutonumericLanguagePreset).toBe(fixture.componentInstance.preset);
    expect(directiveInstance.skyAutonumericOptions).toBe(undefined);
  });
});

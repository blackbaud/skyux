/* istanbul ignore file */
/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-colorpicker' schematic.
 * To update this file, simply rerun the command.
 */
import { NgModule } from '@angular/core';
import {
  SkyI18nModule,
  SkyLibResources,
  SkyLibResourcesService,
} from '@skyux/i18n';

const RESOURCES: Record<string, SkyLibResources> = {
  'EN-US': {
    skyux_colorpicker_alpha: { message: 'A:' },
    skyux_colorpicker_apply: { message: 'Apply' },
    skyux_colorpicker_aria_alpha: {
      message: 'Alpha channel value between 0 and 1',
    },
    skyux_colorpicker_aria_blue: { message: 'Blue value between 0 and 255' },
    skyux_colorpicker_aria_green: { message: 'Green value between 0 and 255' },
    skyux_colorpicker_aria_hex: { message: 'Hexadecimal color code' },
    skyux_colorpicker_aria_red: { message: 'Red value between 0 and 255' },
    skyux_colorpicker_aria_rgba: { message: 'RGBA values' },
    skyux_colorpicker_blue: { message: 'B:' },
    skyux_colorpicker_close: { message: 'Cancel' },
    skyux_colorpicker_dropdown_button: { message: 'Select color value' },
    skyux_colorpicker_green: { message: 'G:' },
    skyux_colorpicker_hex: { message: 'Hex:' },
    skyux_colorpicker_input_default_label: { message: 'Color value' },
    skyux_colorpicker_preset_color: { message: 'Preset Color:' },
    skyux_colorpicker_red: { message: 'R:' },
    skyux_colorpicker_reset: { message: 'Reset color value to white' },
  },
  'FR-CA': {
    skyux_colorpicker_alpha: { message: 'A :' },
    skyux_colorpicker_apply: { message: 'Appliquer' },
    skyux_colorpicker_aria_alpha: {
      message: 'Valeur du canal alpha entre 0 et 1',
    },
    skyux_colorpicker_aria_blue: { message: 'Valeur bleue entre 0 et 255' },
    skyux_colorpicker_aria_green: { message: 'Valeur verte entre 0 et 255' },
    skyux_colorpicker_aria_hex: { message: 'Code de couleur hexadécimal' },
    skyux_colorpicker_aria_red: { message: 'Valeur rouge entre 0 et 255' },
    skyux_colorpicker_aria_rgba: { message: 'Valeurs RGBA' },
    skyux_colorpicker_blue: { message: 'B :' },
    skyux_colorpicker_close: { message: 'Annuler' },
    skyux_colorpicker_dropdown_button: {
      message: 'Sélectionner la valeur de la couleur',
    },
    skyux_colorpicker_green: { message: 'G :' },
    skyux_colorpicker_hex: { message: 'Hexadécimale :' },
    skyux_colorpicker_input_default_label: { message: 'Valeur de la couleur' },
    skyux_colorpicker_preset_color: { message: 'Couleur prédéfinie :' },
    skyux_colorpicker_red: { message: 'R :' },
    skyux_colorpicker_reset: {
      message: 'Réinitialiser la valeur de la couleur à blanc',
    },
  },
};

SkyLibResourcesService.addResources(RESOURCES);

/**
 * Import into any component library module that needs to use resource strings.
 */
@NgModule({
  exports: [SkyI18nModule],
})
export class SkyColorpickerResourcesModule {}

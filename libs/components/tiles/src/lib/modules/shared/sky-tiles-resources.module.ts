/* istanbul ignore file */
/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-tiles' schematic.
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
    skyux_tile_expand: { message: 'Expand or collapse {0}' },
    skyux_tile_expand_default: { message: 'Expand or collapse' },
    skyux_tile_help: { message: '{0} help' },
    skyux_tile_help_default: { message: 'Help' },
    skyux_tile_settings: { message: '{0} settings' },
    skyux_tile_settings_default: { message: 'Settings' },
    skyux_tile_move: { message: 'Move {0}' },
    skyux_tile_move_default: { message: 'Move' },
    skyux_tile_move_instructions: {
      message:
        "When focus is placed on a tile's move button, use the arrow keys to move it. The up and down keys change its position within a column. The left and right keys move it between columns.",
    },
    skyux_tile_moved_assistive_text: {
      message:
        '{0} moved. Current column: {1} of {2}. Current position in column: {3} of {4}',
    },
  },
  'FR-CA': {
    skyux_tile_expand: { message: 'Agrandir ou réduire {0}' },
    skyux_tile_expand_default: { message: 'Agrandir ou réduire' },
    skyux_tile_help: { message: '{0} aide' },
    skyux_tile_help_default: { message: 'Aide' },
    skyux_tile_settings: { message: '{0} paramètres' },
    skyux_tile_settings_default: { message: 'Paramètres' },
    skyux_tile_move: { message: 'Déplacer {0}' },
    skyux_tile_move_default: { message: 'Déplacer' },
    skyux_tile_move_instructions: {
      message:
        'Lorsque le curseur est placé sur le bouton déplacer d’une mosaïque, utilisez les touches fléchées pour la déplacer. Les flèches vers le haut et vers le bas modifie la position dans une colonne. Les flèches de gauche et de droite la déplace d’une colonne à l’autre.',
    },
    skyux_tile_moved_assistive_text: {
      message:
        '{0} déplacé(e). Colonne actuelle : {1} de {2}. Position actuelle dans la colonne : {3} de {4}',
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
export class SkyTilesResourcesModule {}

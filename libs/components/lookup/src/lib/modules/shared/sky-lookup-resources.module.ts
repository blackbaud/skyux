/* istanbul ignore file */
/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-lookup' schematic.
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
    skyux_autocomplete_add: { message: 'New' },
    skyux_autocomplete_multiple_results: { message: '{0} results available.' },
    skyux_autocomplete_no_results: { message: 'No matches found' },
    skyux_autocomplete_one_result: { message: 'One result available.' },
    skyux_autocomplete_show_all: { message: 'Show all' },
    skyux_autocomplete_show_all_count: { message: 'Show all {0}' },
    skyux_autocomplete_show_matches_count: { message: 'Show matches ({0})' },
    skyux_country_field_dropdown_hint_text: {
      message: 'Type to search for a country',
    },
    skyux_country_field_search_placeholder: { message: 'Search for a country' },
    skyux_lookup_search_button_show_more: {
      message: 'Show all search results',
    },
    skyux_lookup_show_more_add: { message: 'New' },
    skyux_lookup_show_more_add_button_aria_label: { message: 'Add {0}' },
    skyux_lookup_show_more_displayed_items_updated: {
      message: 'Showing {1} items, with {0} selected.',
    },
    skyux_lookup_show_more_select_all_button_aria_label: {
      message: 'Select all {0}',
    },
    skyux_lookup_show_more_select_all_button_title: { message: 'Select all' },
    skyux_lookup_show_more_clear_all_button_aria_label: {
      message: 'Clear all selected {0}',
    },
    skyux_lookup_show_more_clear_all_button_title: { message: 'Clear all' },
    skyux_lookup_show_more_show_selected_option_aria_label: {
      message: 'Show only selected {0}',
    },
    skyux_lookup_show_more_show_selected_option_title: {
      message: 'Show only selected items',
    },
    skyux_lookup_show_more_cancel: { message: 'Cancel' },
    skyux_lookup_show_more_modal_title: { message: 'Select {0}' },
    skyux_lookup_show_more_no_results: { message: 'No matches found' },
    skyux_lookup_show_more_select: { message: 'Select' },
    skyux_lookup_show_more_select_context: { message: 'Select {0}' },
    skyux_lookup_tokens_summary: { message: '{0} items selected' },
    skyux_search_aria_label_descriptor: { message: 'Search {0}' },
    skyux_search_dismiss: { message: 'Dismiss search' },
    skyux_search_label: { message: 'Search items' },
    skyux_search_open: { message: 'Open search' },
    skyux_search_placeholder: { message: 'Find in this list' },
  },
  'FR-CA': {
    skyux_autocomplete_add: { message: 'Nouveau' },
    skyux_autocomplete_multiple_results: {
      message: '{0} résultats disponibles.',
    },
    skyux_autocomplete_no_results: { message: 'Aucune correspondance trouvée' },
    skyux_autocomplete_one_result: { message: 'Un résultat disponible.' },
    skyux_autocomplete_show_all: { message: 'Afficher tout' },
    skyux_autocomplete_show_all_count: { message: 'Afficher tout {0}' },
    skyux_autocomplete_show_matches_count: {
      message: 'Afficher les correspondances ({0})',
    },
    skyux_country_field_search_placeholder: { message: 'Rechercher un pays' },
    skyux_lookup_search_button_show_more: {
      message: 'Afficher tous les résultats de la recherche',
    },
    skyux_lookup_show_more_add: { message: 'Nouveau' },
    skyux_lookup_show_more_add_button_aria_label: { message: 'Ajouter {0}' },
    skyux_lookup_show_more_displayed_items_updated: {
      message: '{1} éléments affichés, avec {0} sélectionné(s).',
    },
    skyux_lookup_show_more_select_all_button_aria_label: {
      message: 'Sélectionner tout {0}',
    },
    skyux_lookup_show_more_select_all_button_title: {
      message: 'Sélectionner tout',
    },
    skyux_lookup_show_more_clear_all_button_aria_label: {
      message: 'Supprimer tous les éléments sélectionnés {0}',
    },
    skyux_lookup_show_more_clear_all_button_title: { message: 'Effacer tout' },
    skyux_lookup_show_more_show_selected_option_aria_label: {
      message: 'Montrer seulement ce qui est sélectionné {0}',
    },
    skyux_lookup_show_more_show_selected_option_title: {
      message: 'Montrer seulement les éléments sélectionnés',
    },
    skyux_lookup_show_more_cancel: { message: 'Annuler' },
    skyux_lookup_show_more_modal_title: { message: 'Sélectionner {0}' },
    skyux_lookup_show_more_no_results: {
      message: 'Aucune correspondance trouvée',
    },
    skyux_lookup_show_more_select: { message: 'Sélectionner' },
    skyux_lookup_show_more_select_context: { message: 'Sélectionner {0}' },
    skyux_lookup_tokens_summary: { message: '{0} articles sélectionnés' },
    skyux_search_aria_label_descriptor: { message: 'Rechercher {0}' },
    skyux_search_dismiss: { message: 'Omettre la recherche' },
    skyux_search_label: { message: 'Rechercher des articles' },
    skyux_search_open: { message: 'Ouvrir la recherche' },
    skyux_search_placeholder: { message: 'Trouver dans cette liste' },
  },
};

SkyLibResourcesService.addResources(RESOURCES);

/**
 * Import into any component library module that needs to use resource strings.
 */
@NgModule({
  exports: [SkyI18nModule],
})
export class SkyLookupResourcesModule {}

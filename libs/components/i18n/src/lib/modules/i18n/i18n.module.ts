import { NgModule } from '@angular/core';

import { SkyLibResourcesPipe } from './lib-resources.pipe';
import { SkyAppResourcesPipe } from './resources.pipe';

/**
 * @docsIncludeIds SkyAppResourcesPipe, SkyAppResourcesService, SkyAppResources, SkyLibResourcesPipe, SkyLibResourcesService, SkyLibResources, SkyLibResourcesProvider, SKY_LIB_RESOURCES_PROVIDERS, SkyAppLocaleInfo, SkyAppLocaleProvider, SkyAppResourceNameProvider, SkyI18nCurrencyFormatService, SkyIntlDateFormatter, SkyIntlNumberFormatter, SkyI18nCurrencyFormat, SkyI18nCurrencySymbolLocation, SkyIntlNumberFormatStyle
 */
@NgModule({
  declarations: [SkyAppResourcesPipe, SkyLibResourcesPipe],
  exports: [SkyAppResourcesPipe, SkyLibResourcesPipe],
})
export class SkyI18nModule {}

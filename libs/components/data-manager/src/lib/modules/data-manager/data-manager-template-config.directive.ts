import { Directive } from '@angular/core';

import { SkyDataManagerService } from './data-manager.service';

/**
 * Gives a `sky-data-manager` that sets `labelText` its own `SkyDataManagerService`, so it
 * configures itself from its template even when an ancestor provides another instance.
 * The provider is chosen by selector because DI resolves the service before input values
 * are set, while selector matching sees both static and bound `labelText` at compile time.
 * @internal
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'sky-data-manager[labelText]',
  providers: [SkyDataManagerService],
})
export class SkyDataManagerTemplateConfigDirective {}

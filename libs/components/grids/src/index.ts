export { SkyGridModule } from './lib/modules/grid/grid.module';

export {
  SkyAgGridRowDeleteCancelArgs as SkyGridRowDeleteCancelArgs,
  SkyAgGridRowDeleteConfirmArgs as SkyGridRowDeleteConfirmArgs,
} from '@skyux/ag-grid';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyGridColumnComponent as λ1 } from './lib/modules/grid/grid-column.component';
export { SkyGridComponent as λ2 } from './lib/modules/grid/grid.component';

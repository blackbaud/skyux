# AG Grid Locale

The `ag-grid-locale-*` files are copied from [AG Grid's locale files](https://github.com/ag-grid/ag-grid/tree/latest/community-modules/locale),
which are part of AG Grid Community and distributed under the MIT license.

There is no English file: AG Grid's own built-in text is already English, so
`SkyAgGridService` supplies no translations for English locales.

`SkyAgGridService` selects one of these files based on the language subtag of
the locale reported by `SkyAppLocaleProvider`, then layers SKY UX resource
strings on top. Adding a locale means adding a file here and registering it in
`agGridLocaleTextByLanguage` in `ag-grid.service.ts`.

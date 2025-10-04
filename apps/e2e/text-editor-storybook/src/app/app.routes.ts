import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'text-editor',
    loadChildren: () =>
      import('./text-editor/text-editor.module').then(
        (m) => m.TextEditorModule,
      ),
  },
];

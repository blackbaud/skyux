import { Component } from '@angular/core';

@Component({
  selector: 'sky-toolbar-guidelines',
  templateUrl: './toolbar-guidelines.component.html'
})

export class SkyToolbarGuidelinesComponent {
/* tslint:disable:max-line-length */
public addButtonInfo: {label: string, value: string}[] = [
  {
    label: 'Text',
    value: 'Add'
  },
  {
    label: 'Icon',
    value: 'fa-plus-circle'
  },
  {
    label: 'Dropdown',
    value: 'Optional. Allows users to add more than one type of item.'
  },
  {
    label: 'Notes',
    value: 'If add is the primary action, use the blue primary button styling. Otherwise, use the white secondary button styling.'
  }
];
public newButtonInfo: {label: string, value: string}[] = [
  {
    label: 'Text',
    value: 'New'
  },
  {
    label: 'Icon',
    value: 'sky-i-add'
  },
  {
    label: 'Dropdown',
    value: 'Optional. Allows users to add more than one type of item.'
  },
  {
    label: 'Notes',
    value: 'If new is the primary action, use the blue primary button styling. Otherwise, use the white secondary button styling.'
  }
];
public editButtonInfoDefault: {label: string, value: string}[] = [
  {
    label: 'Text',
    value: 'Edit'
  },
  {
    label: 'Icon',
    value: 'fa-pencil'
  },
  {
    label: 'Dropdown',
    value: 'Optional. Allows users to edit multiple types of records in a content container.'
  }
];
public editButtonInfo: {label: string, value: string}[] = [
  {
    label: 'Text',
    value: 'Edit'
  },
  {
    label: 'Icon',
    value: 'sky-i-edit'
  },
  {
    label: 'Dropdown',
    value: 'Optional. Allows users to edit multiple types of records in a content container.'
  }
];
public saveButtonInfoDefault: {label: string, value: string}[] = [
  {
    label: 'Text',
    value: 'Save'
  },
  {
    label: 'Icon',
    value: 'fa-save'
  },
  {
    label: 'Dropdown',
    value: 'Optional. Allows users to select multiple choices for how to save a list, such as "Save" and "Save as."'
  }
];
public saveButtonInfo: {label: string, value: string}[] = [
  {
    label: 'Text',
    value: 'Save'
  },
  {
    label: 'Icon',
    value: 'sky-i-save-line'
  },
  {
    label: 'Dropdown',
    value: 'Optional. Allows users to select multiple choices for how to save a list, such as "Save" and "Save as."'
  }
];
public filterButtonInfoDefault: {label: string, value: string}[] = [
  {
    label: 'Text',
    value: 'Filter'
  },
  {
    label: 'Icon',
    value: 'fa-filter'
  },
  {
    label: 'Dropdown',
    value: 'None'
  }
];
public filterButtonInfo: {label: string, value: string}[] = [
  {
    label: 'Text',
    value: 'Filter'
  },
  {
    label: 'Icon',
    value: 'sky-i-filter'
  },
  {
    label: 'Dropdown',
    value: 'None'
  }
];
public sortButtonInfoDefault: {label: string, value: string}[] = [
  {
    label: 'Text',
    value: 'Sort'
  },
  {
    label: 'Icon',
    value: 'fa-sort'
  },
  {
    label: 'Dropdown',
    value: 'Yes'
  }
];
public sortButtonInfo: {label: string, value: string}[] = [
  {
    label: 'Text',
    value: 'Sort'
  },
  {
    label: 'Icon',
    value: 'sky-i-sort'
  },
  {
    label: 'Dropdown',
    value: 'Yes'
  }
];
public columnsButtonInfoDefault: {label: string, value: string}[] = [
  {
    label: 'Text',
    value: 'Columns'
  },
  {
    label: 'Icon',
    value: 'fa-columns'
  },
  {
    label: 'Dropdown',
    value: 'None'
  },
  {
    label: 'Notes',
    value: 'Only visible when viewing a list as a grid.'
  }
];
public columnsButtonInfo: {label: string, value: string}[] = [
  {
    label: 'Text',
    value: 'Columns'
  },
  {
    label: 'Icon',
    value: 'sky-i-columns'
  },
  {
    label: 'Dropdown',
    value: 'None'
  },
  {
    label: 'Notes',
    value: 'Only visible when viewing a list as a grid.'
  }
];
public shareButtonInfoDefault: {label: string, value: string}[] = [
  {
    label: 'Text',
    value: 'Share'
  },
  {
    label: 'Icon',
    value: 'fa-share'
  },
  {
    label: 'Dropdown',
    value: 'None'
  }
];
public shareButtonInfo: {label: string, value: string}[] = [
  {
    label: 'Text',
    value: 'Share'
  },
  {
    label: 'Icon',
    value: 'sky-i-share-line'
  },
  {
    label: 'Dropdown',
    value: 'None'
  }
];
public exportButtonInfoDefault: {label: string, value: string}[] = [
  {
    label: 'Text',
    value: 'Export'
  },
  {
    label: 'Icon',
    value: 'fa-file-o, fa-file-excel-o, or fa-file-pdf-o'
  },
  {
    label: 'Dropdown',
    value: 'Optional. Allows users to select from multiple export options.'
  },
  {
    label: 'Notes',
    value: 'For multiple export options, use the generic fa-file-o icon and a dropdown. For a single export option, use the icon for the file type that the option creates.'
  }
];
public exportButtonInfo: {label: string, value: string}[] = [
  {
    label: 'Text',
    value: 'Export'
  },
  {
    label: 'Icon',
    value: 'sky-i-file-line, sky-i-xls-file-line, sky-i-pdf-file-line, or sky-i-doc-file-line'
  },
  {
    label: 'Dropdown',
    value: 'Optional. Allows users to select from multiple export options.'
  },
  {
    label: 'Notes',
    value: 'For multiple export options, use the generic sky-i-file-line icon and a dropdown. For a single export option, use the icon for the file type that the option creates.'
  }
];
public moreButtonInfoDefault: {label: string, value: string}[] = [
  {
    label: 'Text',
    value: 'More'
  },
  {
    label: 'Icon',
    value: 'fa-ellipsis-h'
  },
  {
    label: 'Dropdown',
    value: 'Yes'
  },
  {
    label: 'Notes',
    value: 'Only use the more actions button for multiple items. For a single action, display the action button directly in the toolbar.'
  }
];
public moreButtonInfo: {label: string, value: string}[] = [
  {
    label: 'Text',
    value: 'More'
  },
  {
    label: 'Icon',
    value: 'sky-i-ellipsis'
  },
  {
    label: 'Dropdown',
    value: 'Yes'
  },
  {
    label: 'Notes',
    value: 'Only use the more actions button for multiple items. For a single action, display the action button directly in the toolbar.'
  }
];
public findBoxInfo: {label: string, value: string}[] = [
  {
    label: 'Text',
    value: 'Find in this list'
  },
  {
    label: 'Icon',
    value: 'fa-search'
  },
  {
    label: 'Notes',
    value: 'The search component has the same interactions and highlights in the toolbar as in other contexts.'
  }
];
public simpleFiltersInfo: {label: string, value: string}[] = [
  {
    label: 'Used in',
    value: 'Lists, record pages, or tiles'
  },
  {
    label: 'Icon',
    value: 'None'
  },
  {
    label: 'Notes',
    value: 'For tiles or lists with no more than two simple filters, the filters can appear in the view section in place of a filter action button.'
  }
];
public expandCollapseInfo: {label: string, value: string}[] = [
  {
    label: 'Used in',
    value: 'Record pages'
  },
  {
    label: 'Icon',
    value: 'fa-angle-double-down, fa-angle-double-up'
  },
  {
    label: 'Notes',
    value: 'The expand all button expands all tiles on a page, and the collapse all button collapses all tiles on a page.'
  }
];
public viewSwitcherInfo: {label: string, value: string}[] = [
  {
    label: 'Used in',
    value: 'Lists'
  },
  {
    label: 'Icon',
    value: 'fa-table, fa-list, fa-th-large, fa-map-marker'
  },
  {
    label: 'Notes',
    value: 'The view switcher changes the component that displays items in a list. It uses the styling from icon-based checkboxes to indicate the current view.'
  }
];
}

import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  SkyDocsDemoControlPanelChange,
  SkyDocsDemoControlPanelRadioChoice
} from '@skyux/docs-tools';

import {
  SkyAutocompleteSearchFunctionFilter,
  SkyLookupSelectMode
} from '@skyux/lookup';

import {
  SkyModalCloseArgs,
  SkyModalService
} from '@skyux/modals';

import {
  SkyLookupDocsDemoModalComponent
} from './lookup-docs-demo-modal.component';

@Component({
  selector: 'app-lookup-docs',
  templateUrl: './lookup-docs.component.html'
})
export class LookupDocsComponent implements OnInit {

  public names: any[] = [
    { name: 'Shirley' }
  ];

  public myForm: FormGroup;

  public people: any[] = [
    { name: 'Abed' },
    { name: 'Alex' },
    { name: 'Ben' },
    { name: 'Britta' },
    { name: 'Buzz' },
    { name: 'Craig' },
    { name: 'Elroy' },
    { name: 'Garrett' },
    { name: 'Ian' },
    { name: 'Jeff' },
    { name: 'Leonard' },
    { name: 'Neil' },
    { name: 'Pierce' },
    { name: 'Preston' },
    { name: 'Rachel' },
    { name: 'Shirley' },
    { name: 'Todd' },
    { name: 'Troy' },
    { name: 'Vaughn' },
    { name: 'Vicki' }
  ];

  public selectMode: SkyLookupSelectMode = SkyLookupSelectMode.multiple;

  public selectModeChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: SkyLookupSelectMode.multiple, label: 'Multiple' },
    { value: SkyLookupSelectMode.single, label: 'Single' }
  ];

  public showAddButton: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: SkyModalService
  ) { }

  public ngOnInit(): void {
    this.createForm();
  }

  public addButtonClicked(): void {
    console.log('clicked');

    const modalInstance = this.modalService.open(SkyLookupDocsDemoModalComponent);
    modalInstance.closed.subscribe((modalCloseArgs: SkyModalCloseArgs) => {
      if (modalCloseArgs.reason === 'save') {
        const formControl: FormControl = this.myForm.get('names') as FormControl;
        let newValue: any[] = formControl.value.concat([{ name: modalCloseArgs.data }]);

        this.people.push({ name: modalCloseArgs.data });
        this.people = this.people.sort((a, b) => {
          return a.name.localeCompare(b.name);
       });

       newValue = newValue.sort((a, b) => {
         return this.people.indexOf(a) < this.people.indexOf(b) ? 1 : -1;
       });
       formControl.setValue(newValue);
      }
    });
  }

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.selectMode !== undefined) {
      this.selectMode = change.selectMode;
    }
    if (change.showAddButton !== undefined) {
      this.showAddButton = change.showAddButton;
    }
  }

  // Only show people in the search results that have not been chosen already.
  public getSearchFilters(): SkyAutocompleteSearchFunctionFilter[] {
    const names: any[] = this.myForm.controls.names.value;
    return [
      (searchText: string, item: any): boolean => {
        const found = names.find(option => option.name === item.name);
        return !found;
      }
    ];
  }

  private createForm(): void {
    this.myForm = this.formBuilder.group({
      names: new FormControl(this.names)
    });
  }
}

/* eslint-disable @angular-eslint/component-class-suffix */
import {
  CommonModule
} from '@angular/common';

import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  FormControl,
  FormsModule,
  NgModel,
  ReactiveFormsModule
} from '@angular/forms';

import {
  By
} from '@angular/platform-browser';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  SkyModalService
} from '@skyux/modals';

import {
  expectAsync,
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  STYLE_STATE_DEFAULTS
} from './defaults/style-state-defaults';

import {
  TextEditorFixtureComponent
} from './fixtures/text-editor.component.fixture';

import {
  SkyTextEditorAdapterService
} from './services/text-editor-adapter.service';

import {
  SkyTextEditorStyleState
} from './types/style-state';

import {
  SkyTextEditorModule
} from './text-editor.module';
import { SkyCoreAdapterService } from '@skyux/core';
import { Component, DebugElement, Type } from '@angular/core';
import { SkyTextEditorComponent } from './text-editor.component';

const HELLO_WORLD: string = '<p>Hello world</p>';

describe('Text editor', () => {
  let fixture: ComponentFixture<any>;
  let iframeElement: HTMLIFrameElement;
  let iframeDocument: any;
  let textEditorComponent: SkyTextEditorComponent;
  let textEditorDebugElement: DebugElement;
  let textEditorNativeElement: HTMLElement;

  /** The body element inside the iframe with the contenteditable attribute. */
  let editableElement: HTMLElement;

  //#region test classes
  @Component({
    template: `<sky-text-editor [required]="isRequired" [(ngModel)]="value"></sky-text-editor>`,
  })
  class TextEditorWithNgModel {
    public value: string;
    public isRequired: boolean = true;
  }

  @Component({
    template: `<sky-text-editor [formControl]="formControl"></sky-text-editor>`,
  })
  class TextEditorWithFormControl {
    public formControl = new FormControl();
  }
  //#endregion

  //#region helper functions
  function createComponent<T>(componentType: Type<T>): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SkyTextEditorModule,
        RouterTestingModule
      ],
      declarations: [
        componentType
      ]
    }).compileComponents();

    return TestBed.createComponent<T>(componentType);
  }

  function getIframeElement(): HTMLIFrameElement {
    return fixture.nativeElement.querySelector('iframe');
  }

  function getIframeDocument(): Document {
    return getIframeElement().contentDocument;
  }

  function checkboxExecCommandTest(checkboxInputElement: HTMLElement, expectedCommand: string): void {
    let execCommandCalled = false;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    iframeDocument.body.focus();
    iframeDocument.execCommand = (command: string, _: boolean, value: string) => {
      execCommandCalled = true;
      expect(command).toBe(expectedCommand);
    };

    checkboxInputElement.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(execCommandCalled).toBeTruthy();
  }

  function buttonExecCommandTest(
    buttonElement: HTMLButtonElement,
    expectedCommand: string,
    expectedValue: string = ''
  ): void {
    let execCommandCalled = false;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    iframeDocument.body.focus();
    iframeDocument.execCommand = (command: string, _: boolean, value: string) => {
      execCommandCalled = true;
      expect(command).toBe(expectedCommand);
      expect(value).toBe(expectedValue);
    };

    SkyAppTestUtility.fireDomEvent(buttonElement, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(execCommandCalled).toBeTruthy();
  }

  function openDropdown(className: string): void {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const dropdown: HTMLElement = fixture.nativeElement.querySelector(className);
    expect(dropdown).toBeTruthy();
    const dropdownButton: HTMLButtonElement = dropdown.querySelector('.sky-dropdown-button');
    expect(dropdownButton).toBeTruthy();
    SkyAppTestUtility.fireDomEvent(dropdownButton, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }

  function getDropdownMenuContainerElement(): HTMLElement {
    return document.querySelector('.sky-dropdown-menu-container');
  }

  function getDropdownMenuElement(): Element {
    const container = getDropdownMenuContainerElement();
    if (!container) {
      return container;
    }

    return container.querySelector('.sky-dropdown-menu');
  }

  function getDropdownItems(): NodeListOf<Element> {
    return getDropdownMenuElement().querySelectorAll('.sky-dropdown-item');
  }

  function dropdownButtonExecCommandTest(
    dropdownElementClassName: string,
    optionIndex: number,
    expectedCommand: string,
    expectedValue: string = ''
  ): void {
    let execCommandCalled = false;
    const commandsCalled: string[] = [];
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    iframeDocument.body.focus();
    iframeDocument.execCommand = (command: string, _: boolean, value: string) => {
      execCommandCalled = true;
      expect(value).toBe(expectedValue);
      commandsCalled.push(command);
    };

    openDropdown(dropdownElementClassName);

    const optionButtons = document.querySelectorAll('.sky-dropdown-item button');
    SkyAppTestUtility.fireDomEvent(optionButtons[optionIndex], 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(execCommandCalled).toBeTruthy();
    expect(commandsCalled.filter(command => command === expectedCommand).length > 0).toBeTruthy();
  }

  function collapseSelection(toStart = true): void {
    const iframe = fixture.nativeElement.querySelector('iframe');
    const windowEl = iframe.contentWindow;
    const sel: Selection = windowEl.getSelection();
    if (toStart) {
      sel.collapseToStart();
    } else {
      sel.collapseToEnd();
    }

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }

  function selectContent(selector = ''): void {
    const iframe = fixture.nativeElement.querySelector('iframe');
    const documentEl = iframe.contentDocument;
    const windowEl = iframe.contentWindow;
    const elementToSelect = !selector ? documentEl.body : documentEl.body.querySelector(selector);
    elementToSelect.focus();
    const range = documentEl.createRange();
    range.selectNodeContents(elementToSelect);
    const sel = windowEl.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }

  function selectRangeInsideElement(selector = '', rangeStart: number, rangeEnd: number): void {
    const iframe = fixture.nativeElement.querySelector('iframe');
    const documentEl = iframe.contentDocument;
    const windowEl = iframe.contentWindow;
    const elementToSelect = !selector ? documentEl.body : documentEl.body.querySelector(selector);
    elementToSelect.focus();
    const range = documentEl.createRange();
    range.setStart(elementToSelect.firstChild, rangeStart);
    range.setEnd(elementToSelect.firstChild, rangeEnd);
    const sel = windowEl.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }

  function getFontPicker(): HTMLElement {
    return fixture.nativeElement.querySelector(
      '.sky-text-editor-toolbar .sky-text-editor-font-picker'
    );
  }

  function getFontSizePicker(): HTMLElement {
    return fixture.nativeElement.querySelector(
      '.sky-text-editor-toolbar .sky-text-editor-font-size-picker'
    );
  }

  function getFontStylePicker(): HTMLElement {
    return fixture.nativeElement.querySelector(
      '.sky-text-editor-toolbar .sky-text-editor-font-style-picker'
    );
  }

  function getFontColorPicker(): HTMLElement {
    return fixture.nativeElement.querySelector(
      '.sky-text-editor-toolbar .sky-text-editor-font-color-picker'
    );
  }

  function getListButtons(): NodeListOf<HTMLButtonElement> {
    return fixture.nativeElement.querySelectorAll(
      '.sky-text-editor-toolbar-action-list button'
    );
  }

  function getFontStyleCheckboxes(): NodeListOf<HTMLInputElement> {
    return fixture.nativeElement.querySelectorAll(
      '.sky-text-editor-toolbar-action-font-style input'
    );
  }

  function getAlignmentButtons(): NodeListOf<HTMLButtonElement> {
    return fixture.nativeElement.querySelectorAll(
      '.sky-text-editor-toolbar-action-alignment button'
    );
  }

  function getIndentationButtons(): NodeListOf<HTMLButtonElement> {
    return fixture.nativeElement.querySelectorAll(
      '.sky-text-editor-toolbar-action-indentation button'
    );
  }

  function getUndoRedoButtons(): NodeListOf<HTMLButtonElement> {
    return fixture.nativeElement.querySelectorAll(
      '.sky-text-editor-toolbar-action-undo-redo button'
    );
  }

  function getLinkButton(): HTMLElement {
    return fixture.nativeElement.querySelectorAll(
      '.sky-text-editor-toolbar-action-link button'
    )[0];
  }

  function clickLinkButton(): void {
    SkyAppTestUtility.fireDomEvent(getLinkButton(), 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }

  function getUnlinkButton(): HTMLElement {
    return fixture.nativeElement.querySelectorAll(
      '.sky-text-editor-toolbar-action-link button'
    )[1];
  }

  function clickUnlinkButton(): void {
    SkyAppTestUtility.fireDomEvent(getUnlinkButton(), 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }
  //#endregion

  describe('basic behaviors', () => {
    let testComponent: TextEditorFixtureComponent;
    let ngModel: NgModel;

    beforeEach(() => {
      fixture = createComponent(TextEditorFixtureComponent);
      testComponent = fixture.componentInstance;
      iframeDocument = getIframeDocument();
      iframeElement = getIframeElement();
      textEditorDebugElement = fixture.debugElement.query(By.directive(SkyTextEditorComponent))!;
      ngModel = textEditorDebugElement.injector.get<NgModel>(NgModel);
    });

    afterEach(() => {
      fixture.detectChanges();
      const modalService = TestBed.inject(SkyModalService);
      modalService.dispose();
    });

    it('Shows correct toolbar content', () => {
      testComponent.menus = [
        'edit',
        'merge-field',
        'format'
      ];
      testComponent.toolbarActions = [
        'alignment',
        'color',
        'font-family',
        'font-size',
        'font-style',
        'indentation',
        'link',
        'list',
        'undo-redo'
      ];

      fixture.detectChanges();
      const toolbarActions = fixture.nativeElement.querySelectorAll('.sky-text-editor-toolbar-action');
      expect(toolbarActions.length).toBe(9);
      for (let i = 0; i < toolbarActions.length; i++) {
        toolbarActions[i].classList.contains(testComponent.toolbarActions[i]);
      }

      const menus = fixture.nativeElement.querySelectorAll('.sky-text-editor-menu');
      expect(menus.length).toBe(3);
      for (let i = 0; i < menus.length; i++) {
        menus[i].classList.contains(testComponent.menus[i]);
      }
    });

    it('Should return blank documents for non-existant documents', () => {
      const adapterService = TestBed.inject(SkyTextEditorAdapterService);
      expect(adapterService.getEditorInnerHtml('fake-id')).toBe('');
    });

    it('should apply the placeholder', () => {
      const expectedPlaceholder = 'Please enter some text';
      testComponent.placeholder = expectedPlaceholder;
      fixture.detectChanges();

      let placeholder = iframeDocument.body.getAttribute('data-placeholder');
      expect(placeholder).toBe(expectedPlaceholder);

      const expectedPlaceholder2 = 'Some other placeholder text';
      testComponent.placeholder = expectedPlaceholder2;
      fixture.detectChanges();


      placeholder = iframeDocument.body.getAttribute('data-placeholder');
      expect(placeholder).toBe(expectedPlaceholder2);
    });

    it('should handle undefined placeholder', () => {
      const expectedPlaceholder = 'Please enter some text';
      testComponent.placeholder = expectedPlaceholder;
      fixture.detectChanges();

      let placeholder = iframeDocument.body.getAttribute('data-placeholder');
      expect(placeholder).toBe(expectedPlaceholder);


      testComponent.placeholder = undefined;
      fixture.detectChanges();

      placeholder = iframeDocument.body.getAttribute('data-placeholder');
      expect(placeholder).toBe('');
    });

    it('Shows correct font size list', fakeAsync(() => {
      testComponent.fontSizeList = [
        3,
        10,
        16,
        20
      ];

      fixture.detectChanges();
      openDropdown('.sky-text-editor-toolbar-action-font-size');
      const items = getDropdownItems();
      expect(items.length).toBe(4);
      for (let i = 0; i < items.length; i++) {
        expect(items[i].textContent.trim())
          .toBe(testComponent.fontSizeList[i].toString() + 'px');
      }
    }));

    it('Shows correct font list', fakeAsync(() => {
      testComponent.fontList = [
        {
          name: 'Blackbaud Sans',
          value: '"Blackbaud Sans", Arial, sans-serif'
        },
        {
          name: 'Arial',
          value: 'Arial'
        },
        {
          name: 'Arial Black',
          value: '"Arial Black"'
        }
      ];

      fixture.detectChanges();

      openDropdown('.sky-text-editor-toolbar-action-font-family');
      const items = getDropdownItems();
      expect(items.length).toBe(3);
      for (let i = 0; i < items.length; i++) {
        expect(items[i].textContent.trim())
          .toBe(testComponent.fontList[i].name);
      }
    }));

    it('should revert a single <br> tag to an empty string', fakeAsync(() => {
      testComponent.value = HELLO_WORLD;
      fixture.detectChanges();
      tick();
      expect(ngModel.value).toEqual(HELLO_WORLD);

      testComponent.value = '<br>';
      fixture.detectChanges();
      tick();
      expect(ngModel.value).toEqual('');
    }));

    it('should revert a single empty <p> tag to an empty string', fakeAsync(() => {
      testComponent.value = HELLO_WORLD;
      fixture.detectChanges();
      tick();
      expect(ngModel.value).toEqual(HELLO_WORLD);

      testComponent.value = '<p></p>';
      fixture.detectChanges();
      tick();
      expect(ngModel.value).toEqual('');
    }));

    it('should close dropdowns when editor is clicked', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      openDropdown('.sky-text-editor-menu-merge-field');
      expect(document.querySelector('.sky-dropdown-item')).toBeTruthy();

      SkyAppTestUtility.fireDomEvent(iframeDocument, 'mousedown');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(document.querySelector('.sky-dropdown-item')).toBeFalsy();
    }));

    it('should respect passed in merge fields', fakeAsync(() => {
      // Setup in fixture
      fixture.detectChanges();
      openDropdown('.sky-text-editor-menu-merge-field');

      const mergeFieldOptions = document.querySelectorAll('.sky-dropdown-item');
      expect(mergeFieldOptions.length).toBe(3);
      expect(mergeFieldOptions[0].innerHTML).toContain('Best field');
      expect(mergeFieldOptions[1].innerHTML).toContain('Second best field');
      expect(mergeFieldOptions[2].innerHTML).toContain('A field that is really too long for its own good');
    }));

    it('should insert img with proper data tags for merge field commands', fakeAsync(() => {
      // Setup in fixture
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      openDropdown('.sky-text-editor-menu-merge-field');
      const optionButtons = document.querySelectorAll('.sky-dropdown-item button');
      expect(optionButtons.length).toBe(3);
      iframeDocument.body.focus();
      SkyAppTestUtility.fireDomEvent(optionButtons[0], 'click');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(testComponent.value).toContain('data-fieldid="0"');
      expect(testComponent.value).toContain('data-fielddisplay="Best field"');
    }));

    it('should use preview img for merge field commands if supplied', fakeAsync(() => {
      // Setup in fixture
      const imageUrl = 'https://unavailable.blackbaud.com/images/blackbaud.png';
      testComponent.mergeFields[0].previewImageUrl = imageUrl;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      openDropdown('.sky-text-editor-menu-merge-field');
      expect(document.querySelector('.sky-dropdown-item')).toBeTruthy();

      iframeDocument.body.focus();
      const mergeFieldOption = document.querySelector('.sky-dropdown-item button');
      SkyAppTestUtility.fireDomEvent(mergeFieldOption, 'click');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(testComponent.value).toContain('src="' + imageUrl + '"');
    }));

    it('should truncate oversized labels of merge field commands', fakeAsync(() => {
      // Setup in fixture
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      openDropdown('.sky-text-editor-menu-merge-field');
      expect(document.querySelector('.sky-dropdown-item')).toBeTruthy();

      iframeDocument.body.focus();
      const mergeFieldOption = document.querySelectorAll('.sky-dropdown-item button')[2];
      SkyAppTestUtility.fireDomEvent(mergeFieldOption, 'click');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(testComponent.value).toContain('data-fieldid="2"');
      expect(testComponent.value).toContain('data-fielddisplay="A field that is really too long for its own good"');
    }));

    it('Toolbar values should update based on selection', fakeAsync(() => {
      testComponent.value =
      '<font style="font-size: 16px" face="Arial" color="#c14040">' +
        '<b>' +
          '<i>' +
            '<u>' +
              'Super styled text' +
            '</u>' +
          '</i>' +
        '</b>' +
      '</font>';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      selectContent('u');

      SkyAppTestUtility.fireDomEvent(iframeDocument, 'selectionchange');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(getFontPicker().textContent.trim()).toBe('Arial');
      expect(getFontSizePicker().textContent.trim()).toBe('16px');
      expect(getFontStylePicker().querySelectorAll('.sky-switch-input:checked').length).toBe(3);
      expect(getFontColorPicker().querySelector('input').value).toBe('#c14040');

      // Firefox backcolor bug: https://bugzilla.mozilla.org/show_bug.cgi?id=547848
      // expect(toolbar.querySelector('.background-color-picker').value).toBe('#51b6ca');
    }));

    it('should set font family', fakeAsync(() => {
      const expectedCommand = 'fontname';
      const expectedValue = 'Arial';
      let execCommandCalled = false;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      iframeDocument.body.focus();
      iframeDocument.execCommand = (command: string, _: boolean, value: string) => {
        execCommandCalled = true;
        expect(command).toBe(expectedCommand);
        expect(value).toBe(expectedValue);
      };

      openDropdown('.sky-text-editor-toolbar-action-font-family');
      const items = getDropdownItems();
      items[1].querySelector('button').click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(execCommandCalled).toBeTruthy();
    }));

    it('should set font size', fakeAsync(() => {
      const expectedCommand = 'fontSize';
      const expectedValue = 1;
      let execCommandCalled = false;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      iframeDocument.body.focus();
      iframeDocument.execCommand = (command: string, _: boolean, value: any) => {
        execCommandCalled = true;
        expect(command).toBe(expectedCommand);
        expect(value).toBe(expectedValue);
      };

      openDropdown('.sky-text-editor-toolbar-action-font-size');
      const items = getDropdownItems();
      items[1].querySelector('button').click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(execCommandCalled).toBeTruthy();
    }));

    it('should set font size when selecting inner text content of element', fakeAsync(() => {
      testComponent.value = '<p>Click here</p>';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      selectRangeInsideElement('p', 2, 4);

      const expectedCommand = 'fontSize';
      const expectedValue = 1;
      let execCommandCalled = false;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      iframeDocument.execCommand = (command: string, _: boolean, value: any) => {
        execCommandCalled = true;
        expect(command).toBe(expectedCommand);
        expect(value).toBe(expectedValue);
      };

      openDropdown('.sky-text-editor-toolbar-action-font-size');
      const items = getDropdownItems();
      items[1].querySelector('button').click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(execCommandCalled).toBeTruthy();
    }));

    it('should not leave stale elements when setting font size', fakeAsync(() => {
      testComponent.value = '<font style="font-size: 26px;"><span>Super</span> styled text</font>';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      selectContent('span');

      openDropdown('.sky-text-editor-toolbar-action-font-size');
      const items = getDropdownItems();
      items[7].querySelector('button').click(); // 7th item is 14px.
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect([
        '<font style="font-size: 14px;">Super</font><span style="font-size: 26px;"> styled text</span>', // Normal
        '<font style="font-size: 14px;">Super</font><font style="font-size: 26px;"> styled text</font>', // Edge
        '<font style="font-size: 26px;"><font style="font-size: 14px;">Super</font> styled text</font>' // IE11
      ]).toContain(
        testComponent.value
      );
    }));

    it('should set font color', fakeAsync(() => {
      const expectedCommand = 'foreColor';
      const expectedValue = '#ba4949';
      let execCommandCalled = false;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      iframeDocument.body.focus();
      iframeDocument.execCommand = (command: string, _: boolean, value: string) => {
        execCommandCalled = true;
        expect(command).toBe(expectedCommand);
        expect(value).toBe(expectedValue);
      };

      const colorField: HTMLInputElement = fixture.nativeElement.querySelectorAll('sky-colorpicker')[0];
      SkyAppTestUtility.fireDomEvent(colorField, 'selectedColorChanged', {
        customEventInit: {
          hex: '#ba4949'
        }
      });
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(execCommandCalled).toBeTruthy();
    }));

    it('should set background color', fakeAsync(() => {
      const expectedCommand = 'backColor';
      const expectedValue = '#ba4949';
      let execCommandCalled = false;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      iframeDocument.body.focus();
      iframeDocument.execCommand = (command: string, _: boolean, value: string) => {
        execCommandCalled = true;
        expect(command).toBe(expectedCommand);
        expect(value).toBe(expectedValue);
      };

      const colorField: HTMLInputElement = fixture.nativeElement.querySelectorAll('sky-colorpicker')[1];
      SkyAppTestUtility.fireDomEvent(colorField, 'selectedColorChanged', {
        customEventInit: {
          hex: '#ba4949'
        }
      });
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(execCommandCalled).toBeTruthy();
    }));

    it('should set bulleted list', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'insertUnorderedList';
      buttonExecCommandTest(getListButtons()[0], expectedCommand);
    }));

    it('should set ordered list', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'insertOrderedList';
      buttonExecCommandTest(getListButtons()[1], expectedCommand);
    }));

    it('should set underline', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'underline';
      checkboxExecCommandTest(getFontStyleCheckboxes()[2], expectedCommand);
    }));

    it('should set italicized', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'italic';
      checkboxExecCommandTest(getFontStyleCheckboxes()[1], expectedCommand);
    }));

    it('should set bold', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'bold';
      checkboxExecCommandTest(getFontStyleCheckboxes()[0], expectedCommand);
    }));

    it('should set align left', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'justifyLeft';
      buttonExecCommandTest(getAlignmentButtons()[0], expectedCommand);
    }));

    it('should set align center', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'justifyCenter';
      buttonExecCommandTest(getAlignmentButtons()[1], expectedCommand);
    }));

    it('should set align right', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'justifyRight';
      buttonExecCommandTest(getAlignmentButtons()[2], expectedCommand);
    }));

    it('should set outdented', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'outdent';
      buttonExecCommandTest(getIndentationButtons()[0], expectedCommand);
    }));

    it('should set indented', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'indent';
      buttonExecCommandTest(getIndentationButtons()[1], expectedCommand);
    }));

    it('should execute undo', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'undo';
      buttonExecCommandTest(getUndoRedoButtons()[0], expectedCommand);
    }));

    it('should execute redo', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'redo';
      buttonExecCommandTest(getUndoRedoButtons()[1], expectedCommand);
    }));

    it('should create a link targetting the same window', fakeAsync(() => {
      testComponent.value = '<p>Click here</p>';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      selectContent();

      clickLinkButton();

      const urlField: HTMLInputElement = document.querySelector('.sky-modal input');
      urlField.value = 'https://google.com';
      SkyAppTestUtility.fireDomEvent(urlField, 'input');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const saveButton = document.querySelector('.sky-modal-footer-container .sky-btn-primary');
      SkyAppTestUtility.fireDomEvent(saveButton, 'click');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(document.querySelector('.sky-modal')).toBeFalsy();
      expect(testComponent.value).toContain('<a href="https://google.com">');
    }));

    it('should create a link targetting a new window', fakeAsync(() => {
      testComponent.value = '<p>Click here</p>';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      selectContent('p');

      clickLinkButton();

      const urlField: HTMLInputElement = document.querySelector('.sky-modal input');
      urlField.value = 'https://google.com';
      SkyAppTestUtility.fireDomEvent(urlField, 'input');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const selectField: HTMLInputElement = document.querySelector('.sky-modal select');
      selectField.value = '1';
      SkyAppTestUtility.fireDomEvent(selectField, 'change');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const saveButton: HTMLElement = document.querySelector('.sky-modal-footer-container .sky-btn-primary');
      saveButton.click();
      SkyAppTestUtility.fireDomEvent(saveButton, 'click');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(document.querySelector('.sky-modal')).toBeFalsy();
      expect(testComponent.value).toContain('href="https://google.com');
      expect(testComponent.value).toContain('rel="noopener noreferrer"');
      expect(testComponent.value).toContain('target="_blank"');
    }));

    it('should create an email address link', fakeAsync(() => {
      testComponent.value = '<p>Click here</p>';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      selectContent('p');

      clickLinkButton();

      const emailTab = document.querySelectorAll('.sky-btn-tab')[1] as HTMLAnchorElement;
      emailTab.href = '#';
      SkyAppTestUtility.fireDomEvent(emailTab, 'click');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const inputFields = document.querySelectorAll('.sky-modal input');
      const emailField: HTMLInputElement = inputFields[1] as HTMLInputElement;
      emailField.value = 'harima.kenji@schooldays.asia';
      SkyAppTestUtility.fireDomEvent(emailField, 'input');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const saveButton: HTMLButtonElement = document.querySelector('.sky-modal-footer-container .sky-btn-primary');
      saveButton.click();
      SkyAppTestUtility.fireDomEvent(saveButton, 'click');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(document.querySelector('.sky-modal')).toBeFalsy();
      expect(testComponent.value).toContain('<a href="mailto:harima.kenji@schooldays.asia">');
    }));

    it('should create an email address link with subject', fakeAsync(() => {
      testComponent.value = '<p>Click here</p>';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      selectContent('p');

      clickLinkButton();

      const emailTab = document.querySelectorAll('.sky-btn-tab')[1] as HTMLAnchorElement;
      emailTab.href = '#';
      SkyAppTestUtility.fireDomEvent(emailTab, 'click');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const inputFields = document.querySelectorAll('.sky-modal input');
      const emailField: HTMLInputElement = inputFields[1] as HTMLInputElement;
      emailField.value = 'harima.kenji@schooldays.asia';
      SkyAppTestUtility.fireDomEvent(emailField, 'input');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const subjectField: HTMLInputElement = inputFields[2] as HTMLInputElement;
      subjectField.value = 'none really';
      SkyAppTestUtility.fireDomEvent(subjectField, 'input');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const saveButton: HTMLButtonElement = document.querySelector('.sky-modal-footer-container .sky-btn-primary');
      saveButton.click();
      SkyAppTestUtility.fireDomEvent(saveButton, 'click');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(document.querySelector('.sky-modal')).toBeFalsy();
      expect(testComponent.value).toContain('<a href="mailto:harima.kenji@schooldays.asia?Subject=none%20really">');
    }));

    it('should be able to update an existing link', fakeAsync(() => {
      testComponent.value = '<a href="https://google.com" target="_blank">Click here</p>';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      selectContent('a');

      clickLinkButton();

      const urlField: HTMLInputElement = document.querySelector('.sky-modal input');
      urlField.value = 'https://uncyclopedia.org';
      SkyAppTestUtility.fireDomEvent(urlField, 'input');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const saveButton = document.querySelector('.sky-modal-footer-container .sky-btn-primary');
      SkyAppTestUtility.fireDomEvent(saveButton, 'click');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(document.querySelector('.sky-modal')).toBeFalsy();
      expect(testComponent.value).toContain('href="https://uncyclopedia.org"');
    }));

    it('should load in selected link data', fakeAsync(() => {
      testComponent.value = '<a href="https://google.com">Click here</a>';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      selectContent('a');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      clickLinkButton();

      const urlField: HTMLInputElement = document.querySelector('.sky-modal input');
      const selectField: HTMLInputElement = document.querySelector('.sky-modal select');
      expect(document.querySelector('.sky-modal')).toBeTruthy();
      expect(urlField.value).toBe('https://google.com/');
      expect(selectField.value).toBe('0');

      const cancelButton = document.querySelector('.sky-modal-footer-container .sky-btn-link');
      SkyAppTestUtility.fireDomEvent(cancelButton, 'click');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(document.querySelector('.sky-modal')).toBeFalsy();
    }));

    it('should load in selected email link data', fakeAsync(() => {
      testComponent.value = '<a href="mailto:nero.claudius@pharoah-emperors.gov?Subject=Padoru%20Padoru">Click here</a>';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      selectContent('a');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      clickLinkButton();

      const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.sky-modal input');
      expect(document.querySelector('.sky-modal')).toBeTruthy();
      expect(inputs[1].value).toBe('nero.claudius@pharoah-emperors.gov');
      expect(inputs[2].value).toBe('Padoru Padoru');

      const cancelButton = document.querySelector('.sky-modal-footer-container .sky-btn-link');
      SkyAppTestUtility.fireDomEvent(cancelButton, 'click');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(document.querySelector('.sky-modal')).toBeFalsy();
    }));

    it('should load in selected email link data with case-sensitive "subject"', fakeAsync(() => {
      testComponent.value = '<a href="mailto:nero.claudius@pharoah-emperors.gov?subject=Padoru%20Padoru">Click here</a>';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      selectContent('a');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      clickLinkButton();

      const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.sky-modal input');
      expect(document.querySelector('.sky-modal')).toBeTruthy();
      expect(inputs[1].value).toBe('nero.claudius@pharoah-emperors.gov');
      expect(inputs[2].value).toBe('Padoru Padoru');

      const cancelButton = document.querySelector('.sky-modal-footer-container .sky-btn-link');
      SkyAppTestUtility.fireDomEvent(cancelButton, 'click');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(document.querySelector('.sky-modal')).toBeFalsy();
    }));

    it('should disable unlink button when non-link selection is made', fakeAsync(() => {
      testComponent.value = '<div><p>gary is awesome</p><a href="https://google.com">Click here</a></div>';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      selectContent('p');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      clickUnlinkButton();

      expect(getUnlinkButton().getAttribute('disabled')).not.toBe(undefined);
    }));

    it('should unlink active link element', fakeAsync(() => {
      testComponent.value = '<a href="https://google.com">Click here</a>';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      selectContent('a');
      collapseSelection();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      clickUnlinkButton();

      expect(fixture.nativeElement.querySelector('a')).toBeFalsy();
    }));

    it('should set the style of the iframe body to the default style if a style state is not provided', fakeAsync(() => {
      fixture.detectChanges();

      let style: CSSStyleDeclaration = iframeDocument.querySelector('body').style;
      expect(style.getPropertyValue('background-color')).toEqual('rgba(0, 0, 0, 0)');
      expect([
        'rgb(0, 0, 0)', // Normal
        '#000' // IE11
      ]).toContain(
        style.getPropertyValue('color')
      );
      expect(style.getPropertyValue('font-family')).toEqual(STYLE_STATE_DEFAULTS.font);
      expect(style.getPropertyValue('font-size')).toEqual(`${STYLE_STATE_DEFAULTS.fontSize}px`);
    }));

    it('should set the style of the iframe body to the provided style state', fakeAsync(() => {
      const backColor: string = '#333333'; // rgb(51, 51, 51)
      const fontColor: string = '#EEEEEE'; // rgb(238, 238, 238)
      const font: string = 'Times New Roman';
      const fontSize: number = 22;

      testComponent.initialStyleState = {
        backColor: backColor,
        fontColor: fontColor,
        font: font,
        fontSize: fontSize
      } as SkyTextEditorStyleState;
      fixture.detectChanges();

      let style: CSSStyleDeclaration = iframeDocument.querySelector('body').style;
      expect(style.getPropertyValue('background-color')).toEqual('rgb(51, 51, 51)');
      expect([
        'rgb(238, 238, 238)', // Normal
        '#eeeeee' // IE11
      ]).toContain(
        style.getPropertyValue('color')
      );
      expect([
        `"${font}"`, // Normal
        `${font}` // IE11
      ]).toContain(
        style.getPropertyValue('font-family')
      );
      expect(style.getPropertyValue('font-size')).toEqual(`${fontSize}px`);
    }));

    it('should pass accessibility', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should update tabIndex for focusable elements inside the iframe when text editor is disabled and enabled', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      testComponent.value = '<a href="#">focusable hyperlink</a><div tabindex="0">focusable div</div><button type="button">focusable button</button>';

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const coreAdapterService = TestBed.inject(SkyCoreAdapterService);
      const focusableElements = coreAdapterService.getFocusableChildren(iframeDocument.body, {
        ignoreVisibility: true
      });

      testComponent.disabled = true;

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      focusableElements.forEach(element => {
        expect(element.getAttribute('tabIndex')).toEqual('-1');
      })

      testComponent.disabled = false;

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      focusableElements.forEach(element => {
        expect(element.getAttribute('tabIndex')).toEqual('0');
      })
    });

    it('should add CSS classes when disabled', async () => {
      await fixture.whenStable();
      fixture.detectChanges();

      expect(iframeElement).not.toHaveCssClass('sky-text-editor-wrapper-disabled');

      testComponent.disabled = true;

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(iframeElement).toHaveCssClass('sky-text-editor-wrapper-disabled');

      testComponent.disabled = false;

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(iframeElement).not.toHaveCssClass('sky-text-editor-wrapper-disabled');
    });

    it('should reinitialize text editor when iframe is loaded', fakeAsync(() => {
      testComponent.value = '<p>FOO BAR</p>';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const textEditorEl: HTMLElement = document.querySelector('#fixture-wrapper');

      expect(iframeDocument.body.innerHTML).toEqual('<p>FOO BAR</p>');

      // Move text editor in DOM, which will destroy and reload the iframe.
      document.body.appendChild(textEditorEl);
      const textEditorElNew: HTMLElement = document.querySelector('#fixture-wrapper');
      const iframeNew = textEditorElNew.querySelector('iframe');
      SkyAppTestUtility.fireDomEvent(iframeNew, 'load');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(iframeNew.contentDocument.body.innerHTML).toEqual('<p>FOO BAR</p>');
    }));

    describe('Menubar commands', () => {
      it('should execute undo', fakeAsync(() => {
        fixture.detectChanges();
        const expectedCommand = 'undo';
        const optionNumber = 0;
        dropdownButtonExecCommandTest('.sky-text-editor-menu-edit', optionNumber, expectedCommand);
      }));

      it('should execute redo', fakeAsync(() => {
        fixture.detectChanges();
        const expectedCommand = 'redo';
        const optionNumber = 1;
        dropdownButtonExecCommandTest('.sky-text-editor-menu-edit', optionNumber, expectedCommand);
      }));

      it('should execute cut', fakeAsync(() => {
        fixture.detectChanges();
        const expectedCommand = 'cut';
        const optionNumber = 2;
        dropdownButtonExecCommandTest('.sky-text-editor-menu-edit', optionNumber, expectedCommand);
      }));

      it('should execute copy', fakeAsync(() => {
        fixture.detectChanges();
        const expectedCommand = 'copy';
        const optionNumber = 3;
        dropdownButtonExecCommandTest('.sky-text-editor-menu-edit', optionNumber, expectedCommand);
      }));

      it('should execute paste', fakeAsync(() => {
        fixture.detectChanges();
        const expectedCommand = 'paste';
        const optionNumber = 4;
        dropdownButtonExecCommandTest('.sky-text-editor-menu-edit', optionNumber, expectedCommand);
      }));

      it('should execute select all', fakeAsync(() => {
        fixture.detectChanges();
        const expectedCommand = 'selectAll';
        const optionNumber = 5;
        dropdownButtonExecCommandTest('.sky-text-editor-menu-edit', optionNumber, expectedCommand);
      }));

      it('should execute bold', fakeAsync(() => {
        fixture.detectChanges();
        const expectedCommand = 'bold';
        const optionNumber = 0;
        dropdownButtonExecCommandTest('.sky-text-editor-menu-format', optionNumber, expectedCommand);
      }));

      it('should execute italic', fakeAsync(() => {
        fixture.detectChanges();
        const expectedCommand = 'italic';
        const optionNumber = 1;
        dropdownButtonExecCommandTest('.sky-text-editor-menu-format', optionNumber, expectedCommand);
      }));

      it('should execute underline', fakeAsync(() => {
        fixture.detectChanges();
        const expectedCommand = 'underline';
        const optionNumber = 2;
        dropdownButtonExecCommandTest('.sky-text-editor-menu-format', optionNumber, expectedCommand);
      }));

      it('should execute strikethrough', fakeAsync(() => {
        fixture.detectChanges();
        const expectedCommand = 'strikethrough';
        const optionNumber = 3;
        dropdownButtonExecCommandTest('.sky-text-editor-menu-format', optionNumber, expectedCommand);
      }));

      it('should execute clear formatting', fakeAsync(() => {
        fixture.detectChanges();
        const expectedCommand = 'removeFormat';
        const optionNumber = 4;
        dropdownButtonExecCommandTest('.sky-text-editor-menu-format', optionNumber, expectedCommand);
      }));

      it('should execute select all and clear formatting when nothing is highlighted', fakeAsync(() => {
        testComponent.value = '<p>some kinda stuff</p>';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        const commandsCalled: string[] = [];
        const optionIndex = 4;

        let execCommandCalled = false;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        iframeDocument.execCommand = (command: string, _: boolean, __: string) => {
          execCommandCalled = true;
          commandsCalled.push(command);
        };

        selectContent('p');
        collapseSelection();
        openDropdown('.sky-text-editor-menu-format');

        const optionButtons = document.querySelectorAll('.sky-dropdown-item button');
        SkyAppTestUtility.fireDomEvent(optionButtons[optionIndex], 'click');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(execCommandCalled).toBeTruthy();
        expect(commandsCalled.length).toBe(2);
        expect(commandsCalled[0]).toBe('selectAll');
        expect(commandsCalled[1]).toBe('removeFormat');
      }));
    });
  });

  describe('with ngModel', () => {
    let ngModel: NgModel;
    let testComponent: TextEditorWithNgModel;

    beforeEach(() => {
      fixture = createComponent(TextEditorWithNgModel);
      testComponent = fixture.componentInstance;
      testComponent.isRequired = false;

      textEditorDebugElement = fixture.debugElement.query(By.directive(SkyTextEditorComponent))!;
      textEditorNativeElement = textEditorDebugElement.nativeElement;
      editableElement = getIframeDocument().body;
      ngModel = textEditorDebugElement.injector.get<NgModel>(NgModel);
      iframeDocument = getIframeDocument();
    });

    it('should be pristine, untouched, and valid initially', () => {
      fixture.detectChanges();

      expect(ngModel.valid).toBe(true);
      expect(ngModel.pristine).toBe(true);
      expect(ngModel.touched).toBe(false);
    });

    it('should be pristine, untouched, and valid when initialized with a value', fakeAsync(() => {
      testComponent.value = HELLO_WORLD;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(ngModel.valid).toBe(true);
      expect(ngModel.pristine).toBe(true);
      expect(ngModel.touched).toBe(false);
    }));

    it('should update text editor when model changes', fakeAsync(() => {
      fixture.detectChanges();

      expect(textEditorDebugElement.componentInstance.value).toEqual('');
      expect(ngModel.value).toEqual('');

      testComponent.value = HELLO_WORLD;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(textEditorDebugElement.componentInstance.value).toEqual(HELLO_WORLD);
      expect(ngModel.value).toEqual(HELLO_WORLD);
    }));

    it('should mark text editor dirty after input event', () => {
      fixture.detectChanges();

      expect(textEditorNativeElement.classList).toContain('ng-pristine');

      iframeDocument.body.innerHTML = '<p>Hello world</p>';
      SkyAppTestUtility.fireDomEvent(iframeDocument, 'input');
      fixture.detectChanges();

      expect(textEditorNativeElement.classList).toContain('ng-dirty');
    });

    it('should mark input touched on blur', () => {
      fixture.detectChanges();

      expect(textEditorNativeElement.classList).toContain('ng-untouched');

      SkyAppTestUtility.fireDomEvent(iframeDocument.body, 'focus');
      fixture.detectChanges();

      expect(textEditorNativeElement.classList).toContain('ng-untouched');

      SkyAppTestUtility.fireDomEvent(iframeDocument.body, 'blur');
      fixture.detectChanges();

      expect(textEditorNativeElement.classList).toContain('ng-touched');
    });

    it('should validate with RequiredTrue validator', () => {
      testComponent.isRequired = true;
      fixture.detectChanges();

      expect(ngModel.valid).toBe(false);

      iframeDocument.body.innerHTML = HELLO_WORLD;
      SkyAppTestUtility.fireDomEvent(iframeDocument, 'input');
      fixture.detectChanges();

      expect(ngModel.valid).toBe(true);

      iframeDocument.body.innerHTML = "";
      SkyAppTestUtility.fireDomEvent(iframeDocument, 'input');
      fixture.detectChanges();

      expect(ngModel.valid).toBe(false);
    });
  });

  describe('with form control', () => {
    let testComponent: TextEditorWithFormControl;

    beforeEach(() => {
      fixture = createComponent(TextEditorWithFormControl);
      fixture.detectChanges();

      testComponent = fixture.componentInstance;
      editableElement = getIframeDocument().body;
      textEditorDebugElement = fixture.debugElement.query(By.directive(SkyTextEditorComponent))!;
      textEditorComponent = textEditorDebugElement.componentInstance;
      iframeElement = getIframeElement();
    });

    it('should toggle the disabled state', () => {
      expect(textEditorComponent.disabled).toBe(false);

      testComponent.formControl.disable();
      fixture.detectChanges();

      expect(textEditorComponent.disabled).toBe(true);
      expect(editableElement.getAttribute('contenteditable')).toEqual('false');
      expect(iframeElement).toHaveCssClass('sky-text-editor-wrapper-disabled');

      testComponent.formControl.enable();
      fixture.detectChanges();

      expect(textEditorComponent.disabled).toBe(false);
      expect(editableElement.getAttribute('contenteditable')).toEqual('true');
      expect(iframeElement).not.toHaveCssClass('sky-text-editor-wrapper-disabled');
    });
  });
});

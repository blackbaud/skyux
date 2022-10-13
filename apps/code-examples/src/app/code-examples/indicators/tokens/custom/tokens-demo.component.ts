import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SkyIdService } from '@skyux/core';

import axe from 'axe-core';

interface Selection {
  id: string;
  name: string;
}

interface Item {
  id: string;
  name: string;
}

function parseMessage(violations: axe.Result[]): string {
  let message = 'Expected element to pass accessibility checks.\n\n';

  violations.forEach((violation) => {
    const wcagTags = violation.tags
      .filter((tag) => tag.match(/wcag\d{3}|^best*/gi))
      .join(', ');

    const html = violation.nodes.reduce(
      (accumulator: string, node: axe.NodeResult) => {
        return `${accumulator}\n${node.html}\n`;
      },
      '       Elements:\n'
    );

    const error = [
      `aXe - [Rule: '${violation.id}'] ${violation.help} - WCAG: ${wcagTags}`,
      `       Get help at: ${violation.helpUrl}\n`,
      `${html}\n\n`,
    ].join('\n');

    message += `${error}\n`;
  });

  return message;
}

@Component({
  selector: 'app-tokens-demo',
  templateUrl: './tokens-demo.component.html',
  styleUrls: ['./tokens-demo.component.scss'],
})
export class TokensDemoComponent implements OnInit {
  @ViewChild('inputEl', { read: ElementRef })
  private inputEl: ElementRef;

  protected activeDescendant: string | undefined;
  protected activeIndex = 0;
  protected activeSelectionIndex = 0;
  protected data: Item[];
  protected panelId: string;
  protected panelOpen = false;
  protected selections: Selection[] = [];
  protected selectionsHasFocus = false;

  protected get selectionsSummary(): string {
    return this.selections.length
      ? 'The following items are selected: ' +
          this.selections.map((s) => s.name).join(', ')
      : 'No selections found.';
  }

  #elementRef: ElementRef;
  #idSvc: SkyIdService;

  constructor(elementRef: ElementRef, idSvc: SkyIdService) {
    this.#elementRef = elementRef;
    this.#idSvc = idSvc;

    this.panelId = this.#idSvc.generateId();
    this.data = [
      { id: this.#idSvc.generateId(), name: 'Puns' },
      { id: this.#idSvc.generateId(), name: 'Riddles' },
      { id: this.#idSvc.generateId(), name: 'Observations' },
      { id: this.#idSvc.generateId(), name: 'Knock-knock' },
      { id: this.#idSvc.generateId(), name: 'One-liners' },
    ];
  }

  public async ngOnInit(): Promise<void> {
    await this.#checkAccessibility();
  }

  public onFocus(): void {
    this.panelOpen = false;
    this.activeIndex = 0;
    this.activeSelectionIndex = 0;
    this.selectionsHasFocus = false;
  }

  public async onKeyUp(evt: KeyboardEvent): Promise<void> {
    const value = (evt.target as HTMLInputElement).value;
    this.panelOpen = !!value;

    if (!this.panelOpen) {
      this.activeDescendant = undefined;
    }

    switch (evt.key) {
      case 'ArrowLeft':
        this.selectionsHasFocus = true;
        this.activeSelectionIndex--;
        if (this.activeSelectionIndex < 0) {
          this.activeSelectionIndex = this.selections.length - 1;
        }
        this.activeDescendant =
          this.selections[this.activeSelectionIndex].id + '_selection';
        this.panelOpen = false;
        break;
      case 'ArrowRight':
        this.selectionsHasFocus = true;
        this.activeSelectionIndex++;
        if (this.activeSelectionIndex > this.selections.length - 1) {
          this.activeSelectionIndex = 0;
        }
        this.activeDescendant =
          this.selections[this.activeSelectionIndex].id + '_selection';
        this.panelOpen = false;
        break;
      default:
        break;
    }

    if (this.panelOpen) {
      switch (evt.key) {
        case 'ArrowDown':
          this.activeIndex++;
          if (this.activeIndex > this.data.length - 1) {
            this.activeIndex = 0;
          }
          this.activeDescendant = this.data[this.activeIndex].id;
          break;
        case 'ArrowUp':
          this.activeIndex--;
          if (this.activeIndex < 0) {
            this.activeIndex = this.data.length - 1;
          }
          this.activeDescendant = this.data[this.activeIndex].id;
          break;
        case 'Escape':
          this.panelOpen = false;
          break;
        case 'Enter':
          this.selections.push({
            id: this.data[this.activeIndex].id,
            name: this.data[this.activeIndex].name,
          });
          this.activeDescendant = undefined;
          this.activeIndex = 0;
          this.inputEl.nativeElement.value = '';
          this.panelOpen = false;
          this.selectionsHasFocus = false;
          break;
      }
    }

    await this.#checkAccessibility();
  }

  protected removeSelection(selection: Selection): void {
    this.selections.splice(this.selections.indexOf(selection));
  }

  async #checkAccessibility(): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const results = await axe.run(this.#elementRef.nativeElement);
          if (results.violations.length) {
            console.log(parseMessage(results.violations));
          } else {
            console.log('Axe passed. Okay.');
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  }
}

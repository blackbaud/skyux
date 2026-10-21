/**
 * Records Storybook story remounts and page reloads that happen during a test,
 * along with the Storybook channel events and the call stack that cleared
 * `#storybook-root`, and prints them via the `skyStorybookDiagnostics` task.
 * The first render of each page load clears the root once, so any additional
 * clear is a remount. Also compares each Percy DOM serialization with the live
 * DOM so a snapshot that lost the story content is reported with an excerpt.
 */
interface DiagnosticEntry {
  t: number;
  kind: 'clear-root' | 'event' | 'load' | 'serialize';
  detail: string;
}

interface StorybookChannel {
  handleEvent(event: { type: string; args?: unknown[] }): void;
}

type PercySerialize = (options?: { dom?: Document }) => { html: string };

const MAX_DETAIL_LENGTH = 300;
const MAX_EXCERPT_LENGTH = 4000;
const MAX_STACK_LINES = 20;
const STORY_WRAPPER_SELECTOR = '#storybook-root sky-preview-wrapper';

let testStart = Date.now();
let entries: DiagnosticEntry[] = [];
let serializedExcerpts: string[] = [];
let visits = 0;

const wrappedChannels = new WeakSet<object>();

function record(kind: DiagnosticEntry['kind'], detail: string): void {
  entries.push({ t: Date.now() - testStart, kind, detail });
}

function summarizeArgs(args: unknown[] | undefined): string {
  try {
    return JSON.stringify(args ?? []).substring(0, MAX_DETAIL_LENGTH);
  } catch {
    return '[unserializable]';
  }
}

function wrapChannel(channel: StorybookChannel | undefined): void {
  if (!channel || wrappedChannels.has(channel)) {
    return;
  }

  wrappedChannels.add(channel);

  // Transports and local emits both dispatch through handleEvent.
  const handleEvent = channel.handleEvent.bind(channel);
  channel.handleEvent = (event): void => {
    record('event', `${event.type} ${summarizeArgs(event.args)}`);
    handleEvent(event);
  };
}

function countStoryElements(dom: Document | undefined): number {
  return (
    dom?.querySelector(STORY_WRAPPER_SELECTOR)?.querySelectorAll('*').length ??
    0
  );
}

function inspectSerialized(html: string, dom: Document | undefined): void {
  if (!dom?.getElementById('storybook-root')) {
    return;
  }

  const serialized = new DOMParser().parseFromString(html, 'text/html');
  const live = countStoryElements(dom);
  const captured = countStoryElements(serialized);

  record(
    'serialize',
    JSON.stringify({
      live,
      captured,
      bodyClass: serialized.body?.className,
    }),
  );

  if (captured === 0 || captured < live / 2) {
    serializedExcerpts.push(
      (serialized.body?.outerHTML ?? html).substring(0, MAX_EXCERPT_LENGTH),
    );
  }
}

// @percy/dom installs itself with `window.PercyDOM = window.PercyDOM || {}`
// and then assigns `serialize`, so trap both assignments to wrap it.
let percyDom: Record<string, unknown> | undefined;
Object.defineProperty(window, 'PercyDOM', {
  configurable: true,
  get: () => percyDom,
  set: (value: Record<string, unknown>) => {
    percyDom = value;

    let serialize: PercySerialize | undefined;
    Object.defineProperty(value, 'serialize', {
      configurable: true,
      enumerable: true,
      get: () => serialize,
      set: (fn: PercySerialize) => {
        serialize = (options): { html: string } => {
          const result = fn(options);
          inspectSerialized(result.html, options?.dom);
          return result;
        };
      },
    });
  },
});

Cypress.on('window:before:load', (win) => {
  if (!win.location.pathname.endsWith('/iframe.html')) {
    return;
  }

  record('load', win.location.search);

  let channel: StorybookChannel | undefined;
  Object.defineProperty(win, '__STORYBOOK_ADDONS_CHANNEL__', {
    configurable: true,
    get: () => channel,
    set: (value: StorybookChannel) => {
      channel = value;
      wrapChannel(value);
    },
  });

  const innerHTML = Object.getOwnPropertyDescriptor(
    win.Element.prototype,
    'innerHTML',
  );

  Object.defineProperty(win.Element.prototype, 'innerHTML', {
    ...innerHTML,
    set(this: Element, value: string) {
      if (this.id === 'storybook-root') {
        record(
          'clear-root',
          (new Error().stack ?? '')
            .split('\n')
            .slice(0, MAX_STACK_LINES)
            .join('\n'),
        );
      }

      innerHTML?.set?.call(this, value);
    },
  });
});

Cypress.on('window:load', (win) => {
  wrapChannel(
    (win as unknown as { __STORYBOOK_ADDONS_CHANNEL__?: StorybookChannel })
      .__STORYBOOK_ADDONS_CHANNEL__,
  );
});

// Specs may visit more than once per test, so only page loads beyond the
// visits count as reloads.
Cypress.on('command:start', (command) => {
  if (
    (command as unknown as { get(key: string): unknown }).get('name') ===
    'visit'
  ) {
    visits++;
  }
});

beforeEach(() => {
  testStart = Date.now();
  entries = [];
  serializedExcerpts = [];
  visits = 0;
});

afterEach(() => {
  const loads = entries.filter((entry) => entry.kind === 'load').length;
  const clears = entries.filter((entry) => entry.kind === 'clear-root').length;

  if (loads > visits || clears > loads || serializedExcerpts.length > 0) {
    cy.task(
      'skyStorybookDiagnostics',
      {
        test: Cypress.currentTest.titlePath.join(' > '),
        visits,
        loads,
        clears,
        entries,
        serializedExcerpts,
      },
      { log: false },
    );
  }
});

export {};

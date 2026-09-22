---
name: add-instrumentation-user-event
description: 'Workflow for making a @skyux/* component report a user interaction through the instrumentation system in this Nx monorepo. Use when asked to "add an instrumentation event", "add a user event", "instrument this component", "emit an analytics event", or to define a new instrumentation event name/key for a component. Covers the event-name grammar, the emitter, event detail, the required spec using SkyInstrumentationTestingController, the overlay/context caveat, and the test/lint/format gate. For the instrumentation API itself (the context directive, listeners, testing controller), see libs/components/core/src/lib/modules/instrumentation/.'
argument-hint: '<library> <Component> <interaction> (e.g. help-inline HelpInline help-requested)'
---

# Add an Instrumentation Event to a Component

Use this skill when a SKY UX component should report a user interaction to
consuming applications for analytics. The component emits a named event; the
application registers a listener and attaches its own context.

Read [AGENTS.md](../../../AGENTS.md) first if you are not already familiar with
the monorepo's conventions.

## When to Use

Instrument a meaningful user action that a consuming application would want to
measure — opening help, applying a filter, running a search.

Do NOT instrument:

- Lifecycle or state changes that are not direct user actions.
- Anything a consumer can already observe through an existing `@Output()`,
  unless the value is in the _aggregate_ measurement rather than in giving the
  consumer a second way to react.

## The event name is public API

Consumers switch on these strings, so a released name is locked for the major
version — a rename is a breaking change. Get it right before merging.

```
sky.<component>.<past-tense-verb-phrase>
```

- **`sky`** — fixed. Applications emit their own events into the same listener
  pipeline, so this segment is what lets a listener tell them apart.
- **`<component>`** — the selector with the `sky-` prefix removed
  (`sky-help-inline` → `help-inline`). Derive it; do not invent a label.
- **`<past-tense-verb-phrase>`** — what the user did. If the interaction has a
  public `@Output()`, kebab-case that name and put it in the past tense.
  Otherwise name the user's intent, not the input device: prefer
  `help-requested` over `button-clicked`, since a `<button>` also responds to
  Enter and Space and no listener cares which happened. Leave out words the
  component name already implies.

All lowercase. Dots between segments, hyphens within a segment.

| Component         | Event name                       |
| ----------------- | -------------------------------- |
| `sky-help-inline` | `sky.help-inline.help-requested` |

Add a row for every event you add.

## Procedure

1. **Create the emitter** as a field initializer, so it runs in an injection
   context. The underscore marks it internal — only SKY UX libraries emit.

   ```ts
   readonly #instr = _injectSkyInstrumentationEmitter();
   ```

2. **Emit before notifying the consumer.** When the component also raises an
   `@Output()` for the same interaction, emit **first** — a consumer handler
   that throws must not swallow the measurement.

   ```ts
   protected onClick(): void {
     this.#instr.emit('sky.help-inline.help-requested');

     this.actionClick.emit();
   }
   ```

3. **Add event detail only to identify _which_ thing was acted on.** Detail
   describes the interaction; it is not a place to mirror the component's
   inputs. Omit a key rather than sending `undefined`, so a listener can treat
   its absence as a signal:

   ```ts
   this.#instr.emit(
     'sky.help-inline.help-requested',
     this.helpKey ? { helpKey: this.helpKey } : undefined,
   );
   ```

   Never apply `skyInstrumentationContext` inside the library. Context holds
   application data — tenant, record, page — that SKY UX does not have.

4. **Write the spec.** Coverage alone does not count: any existing test of the
   same interaction already executes the emit line without asserting anything.

   ```ts
   TestBed.configureTestingModule({
     providers: [provideSkyInstrumentationTesting()],
   });

   // ...perform the interaction, then:
   TestBed.inject(SkyInstrumentationTestingController).expectEventCount(
     { eventName: 'sky.help-inline.help-requested' },
     1,
   );
   ```

   Use `expectEventCount` for the primary assertion rather than `expectEvent` —
   it also catches a double-emit when several template branches route through
   one handler. Add a second test for the detail when the event has any.

   `provideSkyInstrumentationTesting()` returns `EnvironmentProviders`, so a
   spec that types its provider array as `Provider[]` must widen it to
   `(Provider | EnvironmentProviders)[]`.

5. **Verify the assertion bites.** Change the emitted name in the component,
   confirm the spec fails, then restore it. A spec that passes against the
   wrong name is worse than no spec.

6. **Verify.**

   ```bash
   npx nx test <library> --browsers=ChromeHeadlessNoSandbox
   npm run lint:affected
   npx nx format --files=<changed-file-paths>
   ```

   Specs under `<library>/testing/**` belong to the separate `<library>-testing`
   Nx project and are **not** run by `nx test <library>`.

7. **Commit.** Conventional Commit with the `components/<library>` scope per
   [commit-message.instructions.md](../../instructions/commit-message.instructions.md).

## Context across overlays

Context flows through the node injector, so it survives an embedded view and
`SkyOverlayService.attachTemplate` needs nothing. It does not survive a
component created in a new view — a modal, a flyout, `attachComponent`, or
`SkyDynamicComponentService`. The launching code forwards it:

```ts
this.#modalSvc.open(SomeComponent, {
  providers: provideSkyInstrumentationContextFrom(this.#injector),
});
```

Events still reach listeners either way; only the context is lost. Forwarding
is normally the consuming application's job — see the modal code example in
`@skyux/code-examples`.

## Definition of Done

- The event name follows the grammar and appears in the table above.
- The component emits via `_injectSkyInstrumentationEmitter()`, before any
  corresponding `@Output()`.
- A spec asserts the event name and detail, and has been shown to fail when the
  name is wrong.
- Tests pass at the coverage threshold, lint is clean, files are formatted.

---
name: add-instrumentation-user-event
description: 'Workflow for making a @skyux/* component report a user interaction through the instrumentation system in this Nx monorepo. Use when asked to "add an instrumentation event", "add a user event", "instrument this component", "emit an analytics event", or to define a new instrumentation event name/key for a component. Covers the event-name grammar, the emitter, event properties, the required spec using SkyInstrumentationTestingController, the overlay/context caveat, and the test/lint/format gate. For the instrumentation API itself (the context directive, listeners, testing controller), see libs/components/core/src/lib/modules/instrumentation/.'
argument-hint: '<library> <Component> <interaction> (e.g. help-inline HelpInline help-requested)'
---

# Add an Instrumentation User Event to a Component

Use this skill when a SKY UX component should report a user interaction to
consuming applications for analytics. The component emits a named event; the
application registers a listener and attaches its own context.

Read [AGENTS.md](../../../AGENTS.md) first if you are not already familiar with
the monorepo's conventions.

## When to Use

- A component has a meaningful user interaction that a consuming application
  would want to measure (opening help, applying a filter, running a search).

Do NOT use this skill for:

- Lifecycle or state changes that are not direct user actions.
- Anything a consumer can already observe through an existing `@Output()` —
  instrument it only if the value is in the _aggregate_ measurement, not in
  giving the consumer a second way to react.

## The event name is public API

Event names are strings that consumers switch on. Once released they are
**locked for the major version** — treat a rename as a breaking change. Get the
name right before merging.

### Grammar

```
sky.<component>.<past-tense-verb-phrase>
```

- **`sky`** — fixed. It marks the event as SKY-originated. Applications can
  emit their own events into the same listener pipeline, so this segment is
  what lets a listener tell them apart.
- **`<component>`** — the component's selector with the `sky-` prefix removed
  (`sky-help-inline` → `help-inline`). Derive it; do not invent a label.
- **`<past-tense-verb-phrase>`** — what the user did, in the past tense.

All lowercase. Dots between segments, hyphens within a segment.

### Choosing the verb phrase

1. **If the interaction has a public `@Output()`, mirror it.** Kebab-case the
   output name and put it in the past tense. This requires no invention and
   the docs connect the two for free.
2. **Otherwise, name the user's intent, not the input device.** Prefer
   `help-requested` over `button-clicked`: a native `<button>` is also
   activated by Enter and Space, and no listener cares which happened.
3. **Do not include words the component name already implies.** `sky-help-inline`
   renders a single button, so `button` in the verb phrase carries no
   information.

Existing events — keep new names consistent with these:

| Component         | Event name                       |
| ----------------- | -------------------------------- |
| `sky-help-inline` | `sky.help-inline.help-requested` |

Add a row when you add an event.

## Procedure

1. **Create the emitter.** In the component, as a field initializer so it runs
   in an injection context:

   ```ts
   readonly #userEvent = injectSkyInstrumentationEmitter();
   ```

2. **Emit before notifying the consumer.** If the component also raises an
   `@Output()` for the same interaction, emit the instrumentation event
   **first** — a consumer handler that throws must not swallow the
   measurement.

   ```ts
   protected onClick(): void {
     this.#userEvent.emit('sky.help-inline.help-requested');

     this.actionClick.emit();
   }
   ```

3. **Add event properties only when they identify _which_ thing was acted on.**
   Properties describe the interaction; they are not a place to mirror the
   component's inputs. Omit a property rather than sending `undefined`, so a
   listener can use its absence as a signal:

   ```ts
   this.#userEvent.emit(
     'sky.help-inline.help-requested',
     this.helpKey ? { helpKey: this.helpKey } : undefined,
   );
   ```

4. **Do not apply `skyInstrumentationContext` inside the library.** Context
   holds application data (tenant, record, page) that SKY UX does not have.
   Consumers apply it in their own templates; components only emit.

5. **Write the spec.** A changed component needs a test that asserts the event
   — coverage alone does not count, because the emit line is executed by any
   existing test of the same interaction without checking anything.

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

   Prefer `expectEventCount` over `expectEvent` for the primary
   assertion — it also catches a double-emit when a component routes several
   template branches through one handler. Add a second test for the
   properties when the event has any.

   `provideSkyInstrumentationTesting()` returns `EnvironmentProviders`,
   so a spec that types its provider array as `Provider[]` must widen it to
   `(Provider | EnvironmentProviders)[]`.

6. **Verify the assertion bites.** Temporarily change the emitted name in the
   component and confirm the spec fails, then restore it. An instrumentation
   spec that passes against the wrong name is worse than no spec.

7. **Check the overlay boundary.** If the component renders through
   `SkyOverlayService.attachComponent`, `SkyDynamicComponentService`, a modal,
   or a flyout, the node-injector chain is broken and the event arrives with no
   context. Events still reach listeners; only context is lost. Forward it:

   ```ts
   readonly #injector = inject(Injector);
   // ...
   overlay.attachComponent(SomeComponent, [
     ...provideSkyInstrumentationContextFrom(this.#injector),
   ]);
   ```

   `attachTemplate` does **not** need this — an embedded view keeps its
   declaration injector.

8. **Update the table above** with the new component and event name.

9. **Verify.**

   ```bash
   npx nx test <library> --browsers=ChromeHeadlessNoSandbox
   npm run lint:affected
   nx format --files=<changed-file-paths>
   ```

   Specs under `<library>/testing/**` belong to the separate `<library>-testing`
   Nx project and are **not** run by `nx test <library>`.

10. **Commit.** Conventional Commit with the `components/<library>` scope per
    [commit-message.instructions.md](../../instructions/commit-message.instructions.md).

## Definition of Done

- The component emits via `injectSkyInstrumentationEmitter()`, before
  any corresponding `@Output()`.
- The event name follows the grammar, and the table in this file lists it.
- A spec asserts the event name and properties, and that assertion has been
  shown to fail when the name is wrong.
- Context is forwarded at any overlay boundary the component renders through.
- Tests pass at the coverage threshold, lint is clean, files are formatted.

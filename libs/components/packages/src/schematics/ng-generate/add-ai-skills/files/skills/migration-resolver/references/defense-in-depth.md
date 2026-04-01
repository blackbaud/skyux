# Defense-in-Depth Validation

## Overview

When you fix a bug caused by invalid data, adding validation at one place feels sufficient. But that single check can be bypassed by different code paths, refactoring, or mocks.

**Core principle:** Validate at EVERY layer data passes through. Make the bug structurally impossible.

## Why Multiple Layers

Single validation: "We fixed the bug"
Multiple layers: "We made the bug impossible"

Different layers catch different cases:

- Entry validation catches most bugs
- Business logic catches edge cases
- Environment guards prevent context-specific dangers
- Debug logging helps when other layers fail

## The Four Layers

### Layer 1: Component Input Validation

**Purpose:** Reject obviously invalid input at the component boundary

```typescript
@Component({ selector: 'app-user-card' })
export class UserCardComponent {
  public userId = input.required<string>();

  constructor() {
    effect(() => {
      const id = this.userId();
      if (!id || id.trim() === '') {
        throw new Error('UserCardComponent: userId input cannot be empty');
      }
    });
  }
}
```

### Layer 2: Service-Level Validation

**Purpose:** Ensure data makes sense for this operation

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  public getUser(userId: string): Observable<User> {
    if (!userId) {
      throw new Error('UserService.getUser: userId is required');
    }
    return this.http.get<User>(`/api/users/${userId}`);
  }
}
```

### Layer 3: HTTP Interceptor Guards

**Purpose:** Catch invalid requests before they leave the app

```typescript
@Injectable()
export class ValidationInterceptor implements HttpInterceptor {
  public intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    // Catch API calls with empty path segments
    if (req.url.includes('//') || req.url.endsWith('/')) {
      throw new Error(
        `Invalid API request: URL contains empty path segment: ${req.url}`,
      );
    }
    return next.handle(req);
  }
}
```

### Layer 4: Debug Instrumentation

**Purpose:** Capture context for forensics when other layers miss something

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  public getUser(userId: string): Observable<User> {
    console.debug('UserService.getUser called:', {
      userId,
      callerStack: new Error().stack,
    });
    return this.http.get<User>(`/api/users/${userId}`);
  }
}
```

## Applying the Pattern

When you find a bug:

1. **Trace the data flow** — Where does bad value originate? Where used?
2. **Map all checkpoints** — List every point data passes through
3. **Add validation at each layer** — Entry, business, environment, debug
4. **Test each layer** — Try to bypass layer 1, verify layer 2 catches it

## Example: Empty User ID Causes Silent 404

Bug: User card component renders blank — no error, no loading indicator, just empty.

**Data flow:**

1. Parent template passes `[userId]="selectedUser()?.id"` — but `selectedUser()` is `undefined`
2. `UserCardComponent` receives `undefined` as input
3. `UserService.getUser(undefined)` makes HTTP call to `/api/users/undefined`
4. API returns 404, error handler swallows it silently

**Four layers added:**

- Layer 1: `UserCardComponent` validates `userId` input is non-empty in an `effect()`
- Layer 2: `UserService.getUser()` throws if `userId` is falsy
- Layer 3: HTTP interceptor rejects URLs with empty path segments
- Layer 4: Debug logging in `UserService` captures caller stack

**Result:** The bug now throws at the component boundary with a clear error message, instead of silently rendering nothing.

## Key Insight

All four layers catch different failure modes:

- Layer 1 catches the most common case (bad input from parent template)
- Layer 2 catches direct service calls from other services or resolvers
- Layer 3 catches any request path, even those bypassing the service
- Layer 4 helps diagnose cases the other layers don't anticipate

**Don't stop at one validation point.** Add checks at every layer.

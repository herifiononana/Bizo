# React Development Rules

## General Principles

These rules apply to every implementation from now on.

- Never modify existing business logic unless explicitly requested.
- Never remove existing functionality.
- Never introduce regressions.
- Preserve the current behavior unless the requirement explicitly states otherwise.
- If a requested change may impact existing functionality, explain the impact before implementing it.
- Always prioritize readability, maintainability, scalability, and testability.

---

# TypeScript

## Typing

- Never use `any`.
- Use the most precise types possible.
- Prefer type inference when it improves readability.
- Use interfaces or type aliases consistently with the project's conventions.
- Use Utility Types when they simplify the code.
- Use Generics only when they provide real value.
- Avoid unnecessary type assertions (`as`).
- Avoid non-null assertions (`!`) unless absolutely necessary.

---

# Naming Conventions

All identifiers must be written in English.

## Variables

- Use `camelCase`.
- Use meaningful and descriptive names.
- Avoid abbreviations.

Good examples:

```ts
selectedEmployee;
filteredDocuments;
currentOrganization;
isLoading;
canEdit;
```

---

## Functions

- Use `camelCase`.
- Function names must clearly describe their purpose.
- Event handlers should start with `handle`.

Examples:

```ts
handleSubmit;
handleDelete;
calculateTotal;
filterEmployees;
```

---

## React Components

- Use `PascalCase`.

Examples:

```tsx
EmployeeCard;
DocumentTable;
PayrollForm;
```

---

## Custom Hooks

- Always start with `use`.

Examples:

```ts
useEmployees;
usePayroll;
useDocumentFilters;
```

---

## Constants

Use `UPPER_SNAKE_CASE`.

Examples:

```ts
MAX_FILE_SIZE;
DEFAULT_PAGE_SIZE;
API_TIMEOUT;
```

---

# Architecture

- Respect the Single Responsibility Principle.
- One component = one responsibility.
- Separate business logic from UI.
- Extract reusable logic into custom hooks.
- Extract utilities into helper files.
- Favor composition over inheritance.
- Avoid tightly coupled components.

---

# Component Size

- Avoid large components.
- Split components when they start handling multiple responsibilities.
- Create sub-components only when they improve readability or reusability.
- Avoid unnecessary fragmentation.

---

# Readability

The code should be self-explanatory.

- Use explicit names.
- Keep functions short.
- Keep conditions simple.
- Reduce nesting whenever possible.
- Avoid long ternary expressions.
- Avoid deeply nested JSX.
- Keep files organized.

Recommended order:

1. Imports
2. Types
3. Constants
4. Hooks
5. State
6. Derived data
7. Event handlers
8. Effects
9. JSX

---

# React Best Practices

- Prefer functional components.
- Prefer composition over inheritance.
- Keep state as local as possible.
- Avoid unnecessary state.
- Avoid duplicated state.
- Avoid unnecessary `useEffect`.
- Avoid unnecessary re-renders.
- Avoid unnecessary prop drilling.
- Keep the data flow predictable.

---

# Performance

Optimize only when there is a measurable benefit.

Use only when appropriate:

- React.memo
- useMemo
- useCallback
- lazy
- Suspense

Do not optimize prematurely.

---

# JSX

Keep JSX clean.

- No business logic inside JSX.
- No complex calculations inside JSX.
- No deeply nested conditions.
- Extract repeated sections into components.

---

# State Management

- Store only necessary state.
- Derive values whenever possible.
- Avoid duplicated state.
- Keep state minimal.
- Prefer immutable updates.

---

# Props

- Pass only the required props.
- Keep props strongly typed.
- Remove unused props.
- Avoid passing large objects when only a few properties are needed.

---

# Reusability

- Create reusable components only when there is a real use case.
- Avoid premature abstraction.
- Prefer composition.
- Keep APIs simple.

---

# Code Quality

Always follow:

- SOLID
- DRY
- KISS
- YAGNI
- Boy Scout Rule

---

# Duplication

- Avoid duplicated logic.
- Share logic only when it is genuinely common.
- Avoid creating abstractions too early.

---

# Error Handling

- Handle errors gracefully.
- Handle null and undefined values safely.
- Never silently ignore errors.

---

# Accessibility

- Use semantic HTML.
- Preserve keyboard navigation.
- Use proper labels.
- Keep ARIA attributes when needed.

---

# Styling

- Follow the project's styling conventions.
- Avoid duplicated styles.
- Remove unused styles.
- Keep styling consistent.

---

# Comments

- Avoid obvious comments.
- Write comments only for complex business logic.
- Prefer self-documenting code.

---

# Refactoring

- Refactor only when it provides real value.
- Never refactor solely for aesthetics.
- Preserve existing behavior.

---

<!-- # Testing

Every new implementation should be testable.

Code should be easy to:

- unit test
- integration test
- mock
- maintain

Avoid tightly coupled code.

--- -->

# Before Finishing

Always verify:

- No regression.
- No functional changes.
- No `any`.
- No dead code.
- No unused imports.
- No unnecessary hooks.
- No unnecessary components.
- No TypeScript warnings.
- No ESLint warnings.
- No duplicated logic.
- Clean and readable code.
- Consistent architecture.
- Good performance without over-optimization.

If any architectural or functional decision is uncertain, ask for confirmation before proceeding.

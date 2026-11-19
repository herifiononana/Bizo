# React Development Rules

## General Principles

These rules apply to every implementation from now on.

- Never modify existing business logic unless explicitly requested.
  _→ La logique métier a été validée par le client : la changer sans demande crée des bugs invisibles._
- Never remove existing functionality.
  _→ Une fonctionnalité peut être utilisée ailleurs ou par un client qu'on ne connaît pas._
- Never introduce regressions.
  _→ Ce qui marchait avant doit toujours marcher après notre changement._
- Preserve the current behavior unless the requirement explicitly states otherwise.
  _→ Par défaut, on ne change que ce qui est demandé, rien de plus._
- If a requested change may impact existing functionality, explain the impact before implementing it.
  _→ On prévient avant de casser, pour que la décision soit prise en connaissance de cause._
- Always prioritize readability, maintainability, scalability, and testability.
  _→ Le code est lu bien plus souvent qu'il n'est écrit : il doit rester facile à faire évoluer._
- All new components and code must be written in English (component names, variables, functions, code). Comments stay in French.
  _→ Une seule langue pour le code évite les noms mélangés ; les commentaires en français restent compréhensibles par toute l'équipe._
- To refetch data, use `queryClient.invalidateQueries` instead of passing a `refetch` function as a prop.
  _→ L'invalidation rafraîchit toutes les listes concernées, sans coupler le parent et l'enfant._

---

# TypeScript

## Typing

- Never use `any`.
  _→ `any` désactive TypeScript : les erreurs ne sont plus détectées à la compilation mais en production._
- Use the most precise types possible.
  _→ Plus le type est précis, plus le compilateur nous protège des erreurs._
- Prefer type inference when it improves readability.
  _→ Inutile d'écrire un type que TypeScript devine déjà correctement._
- Use interfaces or type aliases consistently with the project's conventions.
  _→ La cohérence rend le code prévisible pour tout le monde._
- Use Utility Types when they simplify the code.
  _→ `Pick`, `Omit`, `Partial` évitent de redéclarer des types qui existent déjà._
- Use Generics only when they provide real value.
  _→ Un générique inutile complique la lecture sans rien apporter._
- Avoid unnecessary type assertions (`as`).
  _→ `as` force TypeScript à nous croire, même quand on se trompe._
- Avoid non-null assertions (`!`) unless absolutely necessary.
  _→ `!` promet qu'une valeur existe ; si elle n'existe pas, l'application plante._
- Never use double casts (`as unknown as X`). A double cast means the types are wrong upstream —
  fix the source type instead of silencing the compiler.
  _→ Le double cast cache un vrai problème de typage au lieu de le corriger à la source._
- For data of unknown shape (API errors, `JSON.parse`, third-party payloads), type it as `unknown`
  and narrow it with a type guard (`isRecord`, `axios.isAxiosError`, ...). Never `as any`.
  _→ `unknown` oblige à vérifier la forme de la donnée avant de l'utiliser, donc pas de crash surprise._
- Callback parameters must be typed with the real domain type (`(businessUnit: BusinessUnit) => ...`),
  never `(item: any) => ...`.
  _→ Un paramètre typé donne l'autocomplétion et détecte les champs mal nommés._
- Use string literal unions or enums for domain values (`'PERMANENT_CONTRACT'` must come from an
  existing enum/constant, never be retyped inline).
  _→ Une faute de frappe dans une chaîne en dur passe inaperçue ; avec un enum, le compilateur la voit._
- Specs follow the same typing rules: mocks are typed (`jest.Mocked<T>`, `Partial<T>` + factory
  helpers), no `any` in tests.
  _→ Un mock mal typé peut faire passer un test alors que le vrai code est cassé._

## React Hook Form Typing

- Always type the form: `useForm<FormValues>()`, `useFormContext<FormValues>()`.
  _→ Les noms de champs et leurs valeurs sont vérifiés par TypeScript._
- Pass `Control<FormValues>` to sub-components — never `control as unknown as Control`.
  _→ Le cast fait perdre toute vérification des noms de champs dans les sous-composants._
- If a sub-component is shared between several forms, make it generic
  (`<T extends FieldValues>({ control, name }: { control: Control<T>; name: Path<T> })`).
  _→ Le générique permet de réutiliser le composant sans perdre le typage du formulaire appelant._

## ESLint Suppressions

- Never add `eslint-disable` (line, block or file) for `@typescript-eslint/no-explicit-any` or
  `react-hooks/exhaustive-deps`. A suppression on these rules hides a real bug (wrong type,
  stale closure).
  _→ Ces deux règles signalent de vrais bugs (type faux, valeur périmée) : les faire taire ne les corrige pas._
- Any other suppression must be on a single line and carry a comment explaining why the rule
  cannot be respected.
  _→ Une exception doit rester rare, localisée et justifiée pour le prochain lecteur._

---

# Naming Conventions

All identifiers must be written in English.

## Variables

- Use `camelCase`.
  _→ Convention standard JavaScript, reconnue par tous._
- Use meaningful and descriptive names.
  _→ Le nom doit dire ce que contient la variable sans lire le reste du code._
- Avoid abbreviations.
  _→ `emp`, `cfg`, `bu` obligent à deviner ; `employee`, `config`, `businessUnit` sont clairs._

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
  _→ Même convention que les variables, pour la cohérence._
- Function names must clearly describe their purpose.
  _→ On doit comprendre ce que fait la fonction juste en lisant son nom._
- Event handlers should start with `handle`.
  _→ On repère tout de suite les fonctions déclenchées par une action utilisateur._

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
  _→ React exige une majuscule pour distinguer un composant d'une balise HTML._

Examples:

```tsx
EmployeeCard;
DocumentTable;
PayrollForm;
```

---

## Custom Hooks

- Always start with `use`.
  _→ React et ESLint reconnaissent ainsi un hook et vérifient ses règles d'utilisation._

Examples:

```ts
useEmployees;
usePayroll;
useDocumentFilters;
```

---

## Constants

Use `UPPER_SNAKE_CASE`.
_→ On distingue immédiatement une valeur fixe d'une variable qui change._

Examples:

```ts
MAX_FILE_SIZE;
DEFAULT_PAGE_SIZE;
API_TIMEOUT;
```

---

# Architecture

- Respect the Single Responsibility Principle.
  _→ Un module qui fait une seule chose est plus simple à comprendre, tester et modifier._
- One component = one responsibility.
  _→ Un composant qui fait tout devient impossible à maintenir._
- Separate business logic from UI.
  _→ La logique métier peut alors être testée et réutilisée sans l'affichage._
- Extract reusable logic into custom hooks.
  _→ Un hook partage la logique React entre plusieurs composants sans la copier._
- Extract utilities into helper files.
  _→ Les fonctions pures dans des helpers sont faciles à tester et à retrouver._
- Favor composition over inheritance.
  _→ Assembler des petits composants est plus souple qu'une hiérarchie rigide._
- Avoid tightly coupled components.
  _→ Un composant couplé à un autre casse dès que l'autre change._

---

# Logic Allowed Inside a Component

A component's function body may only contain logic that directly touches React:
state (`useState`, signals), hooks (`useForm`, `useWatch`, `useQuery`, custom
hooks...), refs, event handlers wiring, and JSX composition.
_→ Le composant sert à afficher et à relier les données ; le reste vit ailleurs._

Everything else — logic that does not read or produce a React value — must be
extracted **outside** the component, into a helper file (pure functions) or a
custom hook (stateful/React-dependent logic reused across components).
_→ Sorti du composant, ce code devient testable sans rendu et réutilisable._

- Pure calculations, formatting, formulas, unit conversions → a helper
  function in `*.helper.ts` (e.g. `hoursToDays`, `daysToHours`,
  `buildLotCreatePayload`).
  _→ Un calcul pur se teste en une ligne avec `expect`, sans monter de composant._
- Data mapping/transforms (`mapFormToPayload`, `mapDtoToForm`) → a helper
  file, never inline in the component.
  _→ La conversion formulaire ↔ API est centralisée et testée au même endroit._
- Validation rules → a `*.yup.ts` schema, never an inline check in the
  component body.
  _→ Toutes les règles de validation sont regroupées et lisibles d'un coup d'œil._
- A condition that depends only on plain values (not on a hook's return
  value beyond reading it once) → a named helper function called from the
  component, not a multi-line inline expression in JSX or in the render
  body.
  _→ Une fonction nommée explique l'intention mieux qu'une longue condition._

What stays inside the component: calling that helper with values obtained
from hooks/props, e.g. `const days = hoursToDays(totalHours, hoursPerDay)`.
The computation itself (`hoursToDays`'s body) lives in the helper file, not in
the component.
_→ Le composant appelle, le helper calcule._

Rule of thumb: if a piece of logic could be unit-tested with plain
`expect(fn(input)).toBe(output)`, with no `render()`/`renderHook()` involved,
it does not belong inside the component — extract it.
_→ Test simple : si ça se teste sans React, ça n'a rien à faire dans le composant._

---

# Component Size

- Avoid large components.
  _→ Un gros composant mélange plusieurs responsabilités et décourage la relecture._
- Concrete thresholds: a component file above ~300 lines, or any file (component, config,
  column definitions) above ~500 lines, must be split before adding new code to it.
  _→ Un seuil chiffré évite que le fichier grossisse « juste un peu » à chaque ticket._
- Large table/column configs (`*.config.tsx`) are split per column group or per cell renderer.
  _→ Une config de 1 500 lignes est illisible ; découpée, chaque partie se retrouve vite._
- Split components when they start handling multiple responsibilities.
  _→ Dès qu'un composant fait deux choses, il faut deux composants._
- Create sub-components only when they improve readability or reusability.
  _→ Découper doit apporter quelque chose, pas juste multiplier les fichiers._
- Avoid unnecessary fragmentation.
  _→ Trop de petits fichiers obligent à sauter partout pour comprendre._

---

# Readability

The code should be self-explanatory.
_→ Un bon code se comprend sans avoir besoin de commentaire._

- Use explicit names.
  _→ Le nom remplace l'explication._
- Keep functions short.
  _→ Une fonction courte se comprend d'un seul regard._
- Keep conditions simple.
  _→ Une condition complexe est une source fréquente de bug._
- Reduce nesting whenever possible.
  _→ Les `return` anticipés évitent les pyramides de `if`._
- Avoid long ternary expressions.
  _→ Les ternaires imbriqués sont difficiles à lire ; un `if` ou un helper est plus clair._
- Avoid deeply nested JSX.
  _→ Un JSX trop profond cache la structure de l'écran._
- Keep files organized.
  _→ Un ordre fixe permet de trouver chaque élément au même endroit dans tous les fichiers._

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
  _→ C'est le standard actuel de React, compatible avec les hooks._
- Prefer composition over inheritance.
  _→ On assemble des composants avec `children` ou des props plutôt que d'hériter._
- Keep state as local as possible.
  _→ Un état local ne fait re-rendre que le composant concerné._
- Avoid unnecessary state.
  _→ Chaque état en plus est une chose de plus à synchroniser._
- Avoid duplicated state.
  _→ Deux états qui représentent la même info finissent toujours par diverger._
- Avoid unnecessary `useEffect`.
  _→ La plupart des effets peuvent être remplacés par un calcul direct (voir section Effects)._
- Avoid unnecessary re-renders.
  _→ Moins de rendus inutiles, interface plus fluide._
- Avoid unnecessary prop drilling.
  _→ Passer une prop à travers 5 niveaux rend le code fragile ; un contexte ou un hook est plus propre._
- Keep the data flow predictable.
  _→ On doit pouvoir suivre d'où vient une donnée et qui la modifie._

---

# Effects (`useEffect`)

An effect is only for synchronizing with something **outside** React (DOM API, subscription,
timer, socket, third-party widget). Before writing one, check the list below.
_→ Un `useEffect` mal utilisé provoque des rendus en double, des boucles et des valeurs périmées._

Forbidden uses — and what to do instead:

| Forbidden `useEffect` usage                             | Do instead                                                                        | Pourquoi                                                          |
| ------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Compute a value from props/state and store it in state  | Derive it during render (`const total = computeTotal(rows)`), `useMemo` if costly | Évite un rendu en plus et une valeur affichée en retard           |
| Reset local state when a prop/id changes                | Give the component a `key={id}` so React remounts it                              | React repart d'un état propre, sans code de synchronisation       |
| Fill a form when the query data arrives                 | `useForm({ values: mappedData })` or `reset()` in the query/mutation success path | Le formulaire est rempli au bon moment, sans écraser la saisie    |
| React to a user event (submit, click)                   | Put the logic in the event handler                                                | L'action est liée au clic, pas à un changement d'état indirect    |
| Chain effects (effect A sets state → triggers effect B) | Compute everything in one place (handler or derived value)                        | Les chaînes d'effets sont lentes, difficiles à suivre et bouclent |
| Refetch after a mutation                                | `queryClient.invalidateQueries` in the mutation `onSuccess`                       | TanStack Query rafraîchit toutes les vues concernées              |

- Dependency arrays are always complete. If adding a dependency causes a loop, the effect is
  wrong — restructure it, never remove the dependency.
  _→ Une dépendance manquante fait utiliser une ancienne valeur (stale closure)._
- Never use `JSON.stringify(...)` in a dependency array to work around unstable references —
  stabilize the reference at its source (`useWatch` with a precise `name`, `useMemo`).
  _→ C'est un contournement coûteux qui masque une référence instable mal gérée._
- Never use a ref as a guard to prevent an effect loop (`isFirstRenderRef`, `skipNextRef`, ...):
  it is the symptom of an effect that should not exist.
  _→ Si on doit bloquer l'effet avec un drapeau, c'est que l'effet lui-même est le problème._

---

# Render Purity

The render body (component function and JSX) must be pure: same props/state → same output,
no side effects.
_→ React peut rendre un composant plusieurs fois ; un rendu impur donne des résultats aléatoires._

- Never read or write `ref.current` during render (only in effects and event handlers).
  _→ Une ref ne déclenche pas de rendu : sa valeur affichée peut être fausse ou en retard._
- Never mutate a variable declared outside the render (`globalRowIndex++`, pushing into an
  outer array, mutating props). Compute indexes from the data (`rows.findIndex`, `map((row, index) => ...)`,
  or a precomputed flat list).
  _→ En mode strict ou en re-rendu, le compteur est incrémenté deux fois et les index deviennent faux._
- Never call `setState` during render.
  _→ Cela relance un rendu pendant le rendu, jusqu'à la boucle infinie._
- Never mutate objects coming from a query cache (`data.items.sort(...)`): copy first
  (`[...data.items].sort(...)` / `toSorted`).
  _→ `sort` modifie le cache partagé : les autres écrans voient les données changées sans le savoir._

---

# Server State (TanStack Query)

- Every query key comes from `QueryCacheKey` (`libs/shared/src/api/query-cache-key.ts`). Never
  write a query key as a string literal (`'GETCHANTIERFICHELANCEMENT'`) in a component or hook.
  Add the key to `QueryCacheKey` if it does not exist yet.
  _→ Une clé écrite à la main mal orthographiée n'est jamais invalidée : la liste ne se met pas à jour._
- Invalidate with the same key (or key prefix) the `useQuery` uses, from the mutation's success
  handler — never via a `refetch` prop, a `refetchTrigger` toggle state or a manual `refetch()`
  call in the parent.
  _→ L'invalidation met à jour toutes les vues qui utilisent la donnée, pas seulement le parent._
- Do not call API functions directly from components: go through the query/mutation hooks.
  _→ Les hooks gèrent cache, chargement, erreurs et rafraîchissement à notre place._
- Handle `isLoading` (first load), `isFetching` (background refresh) and `isError` explicitly
  where the UI depends on them.
  _→ L'utilisateur doit voir quand ça charge et quand ça échoue, sans écran vide ou figé._

---

# Performance

Optimize only when there is a measurable benefit.
_→ Une optimisation inutile ajoute de la complexité sans gain réel._

Use only when appropriate:

- React.memo
  _→ Évite le re-rendu d'un composant dont les props n'ont pas changé._
- useMemo
  _→ Mémorise un calcul coûteux entre deux rendus._
- useCallback
  _→ Garde la même référence de fonction, utile seulement si un enfant mémorisé la reçoit._
- lazy
  _→ Charge un composant lourd seulement quand on en a besoin._
- Suspense
  _→ Affiche un état de chargement pendant ce chargement différé._

Do not optimize prematurely.
_→ On mesure d'abord, on optimise ensuite._

---

# JSX

Keep JSX clean.
_→ Le JSX doit décrire l'écran, pas contenir des calculs._

- No business logic inside JSX.
  _→ La règle métier dans le JSX est introuvable et impossible à tester._
- No complex calculations inside JSX.
  _→ Calculer avant le `return` rend le rendu lisible._
- No deeply nested conditions.
  _→ Plusieurs `&&` et ternaires imbriqués cachent ce qui s'affiche réellement._
- Extract repeated sections into components.
  _→ Un bloc répété devient un composant, modifié une seule fois._

---

# State Management

- Store only necessary state.
  _→ Moins d'état, moins de bugs de synchronisation._
- Derive values whenever possible.
  _→ Une valeur calculée est toujours à jour, un état copié peut être périmé._
- Avoid duplicated state.
  _→ Une seule source de vérité par information._
- Keep state minimal.
  _→ On stocke le strict nécessaire, le reste se calcule._
- Prefer immutable updates.
  _→ React détecte un changement par nouvelle référence ; muter un objet ne déclenche pas de rendu._

---

# Props

- Pass only the required props.
  _→ Le composant ne dépend que de ce qu'il utilise vraiment._
- Keep props strongly typed.
  _→ Une mauvaise prop est détectée à la compilation._
- Remove unused props.
  _→ Une prop inutile trompe le lecteur sur ce que fait le composant._
- Avoid passing large objects when only a few properties are needed.
  _→ Moins de re-rendus inutiles et une dépendance plus claire._

---

# Reusability

- Create reusable components only when there is a real use case.
  _→ On rend réutilisable quand le besoin existe, pas « au cas où »._
- Avoid premature abstraction.
  _→ Une mauvaise abstraction coûte plus cher qu'un peu de duplication._
- Prefer composition.
  _→ Des petites briques assemblables s'adaptent mieux aux nouveaux besoins._
- Keep APIs simple.
  _→ Un composant avec 20 props optionnelles est difficile à utiliser correctement._

---

# Code Quality

Always follow:

- SOLID
  _→ Cinq principes de conception pour un code modulaire et facile à faire évoluer._
- DRY
  _→ « Don't Repeat Yourself » : une logique écrite à un seul endroit._
- KISS
  _→ « Keep It Simple » : la solution la plus simple qui marche._
- YAGNI
  _→ « You Aren't Gonna Need It » : on ne code pas ce qui n'est pas demandé._
- Boy Scout Rule
  _→ Laisser le code un peu plus propre qu'on ne l'a trouvé._

---

# Duplication

- Avoid duplicated logic.
  _→ Un bug corrigé à un endroit reste présent dans la copie._
- Share logic only when it is genuinely common.
  _→ Deux codes qui se ressemblent par hasard ne doivent pas être fusionnés._
- Avoid creating abstractions too early.
  _→ Attendre de voir le vrai besoin commun avant d'abstraire._
- The same block copied in two sibling components of the same feature (e.g. an event handler
  pasted into both `CreateXxxAction` and `EditXxxAction`) is extracted into a helper or hook
  right away — this is not premature abstraction.
  _→ Même feature, même code : le besoin commun est déjà prouvé, on factorise tout de suite._
- Before creating a UI primitive (button, modal, drawer, badge, toast), check `@shared/ui`. Never
  create a parallel UI kit in an app.
  _→ Deux kits UI donnent une interface incohérente et double la maintenance._
- Never create trivial wrapper components that only forward props to another component without
  adding behavior (`XxxWrapper = (props) => <Xxx {...props} />`).
  _→ Un wrapper vide ajoute un fichier et un niveau sans rien apporter._

---

# Create/Edit Drawer Actions

Applies to every drawer-based create and edit feature.
_→ Un modèle unique pour tous les drawers : chacun sait où trouver quoi._

- Extract the form fields into their own component (e.g. `XxxForm`). This component holds no
  form instance, no submit logic, no open/close state, and no button — it only renders fields.
  _→ Les champs sont réutilisés tels quels en création et en édition._
- It reads `control` (and other RHF helpers) via `useFormContext()`, never via props. The parent
  supplies the form through `<Form {...form}>` (`FormProvider`).
  _→ Pas de prop `control` à faire descendre, le formulaire est accessible partout dans l'arbre._
- Create and edit are each handled by their own component (e.g. `CreateXxxAction`,
  `EditXxxAction`), both rendering the same form component. Never fork the form component itself
  between create and edit — only the wrapping action component differs (default values, mutation
  called on submit, drawer title).
  _→ Un seul formulaire à maintenir ; seules les différences réelles sont séparées._
- Each action component owns:
  _→ Chaque action est autonome : on la pose n'importe où, elle fonctionne._
  - its own open/close state (`useState`/signal), local to the component,
    _→ Le parent n'a pas à gérer l'ouverture du drawer._
  - its own `useForm()` instance and its own submit handler calling the relevant mutation,
    _→ La création et l'édition ne partagent pas un état de formulaire par erreur._
  - its own trigger button — with a default button rendered when no `trigger` prop is given,
    and a `trigger?: (open: () => void) => ReactNode` prop to let the caller render a custom
    trigger (icon button in a table row, `data-cy`, custom label, etc.) while keeping the
    open/close wiring inside the action component.
    _→ L'apparence du bouton est personnalisable sans casser la logique d'ouverture._
- Never store the id of the row being edited/deleted in URL query params if the list's `GET`
  endpoint validates its query filters against an allow-list — an unknown param can make the
  list call fail. Keep the targeted row/id in the action component's own local state instead;
  the row is already available where the action is triggered (e.g. `renderComponent`).
  _→ Un paramètre inconnu dans l'URL peut faire échouer l'appel de la liste côté back._
- The action component owns its entire async operation end to end — mutation call, success/error
  toasts, and refreshing whatever list/query the operation affects. It must never expose a
  callback prop (`onDeleted`, `onUpdated`, `onCreated`, `refetch`, ...) for the parent to wire up
  the refresh itself. Refresh the affected list by invalidating its query key
  (`queryClient.invalidateQueries({ queryKey: [...] })`, using the same `QueryCacheKey` the list's
  `useQuery` is keyed on) from inside the mutation's own success handler. The parent only ever
  passes the data the action needs (e.g. the row) — never a piece of the operation itself.
  _→ Si le parent oublie de brancher le rafraîchissement, la liste reste fausse ; l'action s'en charge seule._
- The only prop a caller may use to influence behavior from outside is `trigger`, and only for
  presentation (rendering a custom button/icon) — never for wiring the operation or its
  completion.
  _→ Le comportement reste au même endroit, seul l'affichage est configurable._
- When an action is not permitted in the current state (missing claim, row in a state that
  forbids it, ...), never hide the button. Keep it visible, pass `disabled` + a `disabledReason`
  to the action component, render its default button as `disabled`, and wrap it in a tooltip
  (`HoverTooltip`) showing `disabledReason` so the user understands why it's inactive.
  _→ Un bouton caché fait croire que la fonction n'existe pas ; un bouton grisé explique pourquoi._

---

# Error Handling

- Handle errors gracefully.
  _→ L'utilisateur doit voir un message clair, pas un écran blanc._
- Handle null and undefined values safely.
  _→ Accéder à une propriété de `undefined` fait planter toute la page._
- Never silently ignore errors.
  _→ Une erreur avalée devient un bug introuvable._
- Every `await mutateAsync(...)` is wrapped in `try/catch` (or uses `mutate` with `onError`) —
  an unhandled rejection is a silent error.
  _→ Sans `catch`, l'échec de la mutation n'est ni affiché ni traité._
- Normalize and validate data **once, at the boundary** (API mapper / DTO → domain helper).
  Downstream code then trusts the types; do not scatter `?? ''`, `|| 0`, `?.` fallbacks
  everywhere "just in case".
  _→ On nettoie la donnée une seule fois à l'entrée, au lieu de mettre des rustines partout._
- Never send placeholder values to the API to bypass a missing value (`id || ''`): if the value
  is required, guard before calling (disable the action, early return with an error message).
  _→ Envoyer un id vide crée une erreur côté back ou une donnée corrompue._

---

# Accessibility

- Use semantic HTML.
  _→ `button`, `nav`, `table` sont compris par les lecteurs d'écran et le navigateur._
- Preserve keyboard navigation.
  _→ Certains utilisateurs ne se servent que du clavier._
- Use proper labels.
  _→ Chaque champ doit être identifiable, au clic comme au lecteur d'écran._
- Keep ARIA attributes when needed.
  _→ Les attributs ARIA décrivent les composants custom aux technologies d'assistance._

---

# Styling

- Follow the project's styling conventions.
  _→ TailwindCSS + DaisyUI partout, pour une interface cohérente._
- Avoid duplicated styles.
  _→ Un style répété se factorise en composant ou en classe._
- Remove unused styles.
  _→ Le code mort CSS alourdit et embrouille._
- Keep styling consistent.
  _→ Les mêmes éléments doivent avoir le même aspect dans toute l'application._

---

# Comments

- Default to no comment at all. Add one only when a function/block is genuinely hard to read on
  its own and the comment explains the reason it's written that way — never as a default habit.
  _→ La plupart du code n'a besoin d'aucun commentaire ; un code clair se passe d'explication._
- Avoid obvious comments.
  _→ Un commentaire qui répète le code est du bruit._
- Write comments only for complex business logic.
  _→ Le commentaire sert là où le code seul ne suffit pas à comprendre._
- Never reference an external doc, guide, passation or README in a comment (e.g. "cf.
  `GUIDE_X.md`", "voir passation du 27/10") — docs move, get renamed or deleted; the comment rots
  and misleads.
  _→ Le document référencé disparaît, le commentaire reste et pointe vers rien._
- Prefer self-documenting code.
  _→ Un bon nom vaut mieux qu'un commentaire._
- A comment explains **why** (business rule, backend constraint, non-obvious bug), never
  **what** the next line does.
  _→ Le « quoi » se lit dans le code, le « pourquoi » non._
- Keep comments short: 1–2 lines. Long explanations belong in the commit message or MR
  description, not in the code.
  _→ Les longs commentaires noient le code et deviennent vite faux._
- No comment on every prop/field of a type when the name is already explicit.
  _→ Commenter `isLoading` par « indique le chargement » n'apporte rien._
- Never reference internal documents, tickets, phases or handover notes in code comments
  ("passation §2", "phase 1.4", "A15"): they become meaningless once the document disappears.
  State the rule itself.
  _→ Le document disparaît, le commentaire reste et ne veut plus rien dire._
- No decorative banners (`// ════════`, `// ===== SECTION =====`).
  _→ Si un fichier a besoin de bandeaux pour être lisible, il faut le découper._
- Never commit planning/handover documents (`*.md` phases, passations, specs) inside `src/` or
  `libs/`. They stay outside the repo or in a dedicated `docs/` folder if the team decides so.
  _→ Le code source ne doit contenir que du code ; les notes de travail polluent le repo._

---

# Refactoring

- Refactor only when it provides real value.
  _→ Chaque refacto a un coût de relecture et un risque de régression._
- Never refactor solely for aesthetics.
  _→ « C'est plus joli » ne justifie pas de toucher du code qui marche._
- Preserve existing behavior.
  _→ Un refacto change la structure, jamais le comportement._

---

# Testing

Every new implementation should be testable.
_→ Un code testable est en général un code bien découpé._

Code should be easy to:

- unit test
  _→ Tester une fonction seule, rapidement._
- integration test
  _→ Vérifier que plusieurs morceaux marchent ensemble._
- mock
  _→ Remplacer facilement l'API ou une dépendance dans un test._
- maintain
  _→ Un test fragile qui casse à chaque modif finit désactivé._

Avoid tightly coupled code.
_→ Un code couplé oblige à tout mocker pour tester une seule chose._

- Test behavior (what the user sees / what the hook returns), not implementation details.
  _→ Le test reste vert lors d'un refacto et rouge seulement si le comportement casse._
- Never mock `@shared` as a whole (`jest.mock('@shared')`): mock only the network boundary
  (API functions or the HTTP layer) and render with the real providers (`QueryClientProvider`,
  form context) through a shared test wrapper.
  _→ Tout mocker teste les mocks, pas notre code ; on ne remplace que l'appel réseau._
- Every pure helper extracted from a component gets its own unit test.
  _→ Un helper pur est le code le plus facile et le plus rentable à tester._
- Mutation hooks are tested on their invalidation (which `QueryCacheKey` is invalidated) and on
  their error path.
  _→ On vérifie que la liste se rafraîchit et que l'erreur est bien gérée._
- No snapshot tests as the only assertion.
  _→ Un snapshot se met à jour sans réfléchir et ne prouve rien sur le comportement._

---

# Git & Commits

- Conventional Commits: `type(scope): subject`, subject explicit about the change
  (`fix(planning): keep scroll position on background refetch`, not `fix(ri): fix unit test`).
  _→ L'historique devient lisible et on retrouve vite quand et pourquoi un changement a eu lieu._
- One commit = one logical change. No commit mixing a feature, a refactor and a lockfile update.
  _→ Un commit atomique se relit, se revert et se cherry-pick facilement._
- Lockfile / dependency changes go in their own `chore(deps)` commit.
  _→ Des milliers de lignes de lockfile noient la vraie modification dans la relecture._
- Keep commits reviewable: a commit touching more than ~30 files or ~1 000 lines must be split
  (unless it is a pure move/rename).
  _→ Personne ne relit vraiment un commit de 20 000 lignes._
- One fix is developed on **one** branch and propagated by merge, not cherry-picked onto several
  branches (cherry-picks duplicate history and make bisect/blame unreliable).
  _→ Les cherry-picks créent des commits en double et des conflits répétés._
- Never push WIP or debug code (`console.log`, `JSON.stringify(state)` in JSX, commented-out
  code) — especially into `libs/shared`.
  _→ Le code de debug part en production et pollue toutes les apps qui utilisent `@shared`._
- Never stage (`git add`) or commit a Markdown file (`*.md`, anywhere in the repo: root guides,
  `docs/`, phases, passations, plans, `README`, ...). Staging and committing `.md` files is done
  **only manually by Heri**. This applies even when a rule or a task asks to create or update a
  `.md` file (e.g. EPP guides): write the file, leave it unstaged, and list it in the final report
  so Heri decides whether it goes into a commit.
  _→ Les `.md` générés pendant le travail (plans, phases, guides) ont pollué develop ; seul Heri
  décide lesquels méritent d'être versionnés._
- Stage files explicitly by path, never with `git add .`, `git add -A`, `git add <folder>` or
  `git commit -a`, which would pick up `.md` files silently.
  _→ Un ajout global embarque sans le voir des fichiers de notes ou de plans._
- Before every commit, check `git diff --cached --name-only`: if a `.md` file is staged without
  Heri having added it himself, unstage it (`git restore --staged <file>`) and say so.
  _→ Dernier filet de sécurité avant que le fichier parte dans l'historique._

---

# AI-Assisted Code

AI-generated code is reviewed like a colleague's MR before being committed. Check in particular:
_→ L'IA produit vite, mais c'est nous qui sommes responsables de ce qui est commité._

- No `any`, no `as unknown as`, no new `eslint-disable`.
  _→ L'IA force souvent le typage pour « faire compiler »._
- No unnecessary `useEffect`, no ref-based loop guards.
  _→ L'IA ajoute facilement des effets de synchronisation inutiles._
- No over-long comments, no references to prompts/phases/docs, no banners.
  _→ L'IA commente beaucoup trop et cite le contexte de la conversation._
- No new parallel abstraction when `@shared` already provides one.
  _→ L'IA ne connaît pas toujours la lib partagée et recrée ce qui existe._
- No planning `.md` files added to the source tree.
  _→ Les plans générés pendant le travail ne sont pas du code livrable._
- I can explain every line of the diff; otherwise it is not committed.
  _→ Si je ne comprends pas le code, je ne pourrai ni le corriger ni le défendre en revue._

---

# Before Finishing

Always verify:
_→ Dernière vérification avant de livrer, pour ne pas laisser passer une erreur évitable._

- No regression.
  _→ Tout ce qui marchait avant marche encore._
- No functional changes.
  _→ Aucun comportement modifié en dehors de la demande._
- No `any`.
  _→ Le typage reste complet._
- No `as unknown as` double cast.
  _→ Aucun problème de type caché sous un cast._
- No new `eslint-disable` (in particular `exhaustive-deps` / `no-explicit-any`).
  _→ Aucun avertissement réduit au silence._
- No `useEffect` that derives or resets state; no ref read/written during render.
  _→ Pas d'effet inutile ni de rendu impur._
- No query key written as a string literal (always `QueryCacheKey`).
  _→ Toutes les clés sont centralisées et invalidables._
- No file above the size thresholds left bigger than before.
  _→ On ne fait pas grossir un fichier déjà trop gros._
- No `.md` file staged or committed (only Heri stages them manually).
  _→ Aucun fichier de notes, plan ou guide ne part dans l'historique sans sa décision._
- No dead code.
  _→ Le code inutilisé trompe le lecteur._
- No unused imports.
  _→ Imports propres, bundle plus léger._
- No unnecessary hooks.
  _→ Chaque hook a une raison d'être._
- No unnecessary components.
  _→ Chaque composant apporte quelque chose._
- No TypeScript warnings.
  _→ Le compilateur est d'accord avec nous._
- No ESLint warnings.
  _→ Le linter est d'accord avec nous._
- No duplicated logic.
  _→ Aucune copie oubliée._
- Clean and readable code.
  _→ Un collègue doit comprendre le code sans nous._
- Consistent architecture.
  _→ Le nouveau code suit les mêmes modèles que l'existant._
- Good performance without over-optimization.
  _→ Rapide, sans complexité inutile._

If any architectural or functional decision is uncertain, ask for confirmation before proceeding.
_→ En cas de doute, demander coûte moins cher que corriger après coup._

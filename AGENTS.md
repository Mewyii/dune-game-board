# Agent instructions

- An explicit instruction from the user overrides this file.
- If this file is wrong or out of date, ask the user to fix it.

## General

- Follow the clean code principles.

## Project structure

- `src/app/` – Angular frontend. It contains the complete game logic, so the game stays playable offline.
  - `services/` – game logic and game state (`ai/` for AI players, `configurators/` for the card configurators, `persistence/` for storing and syncing state).
  - `components/`, `pages/` – UI (game board and configurator pages).
  - `constants/` – game content (cards, leaders, conflicts, AI settings, …) and `version.ts`.
  - `models/`, `helpers/`, `pipes/`, `directives/`, `locales/`
- `backend/` – PHP scripts and SQL for MariaDB, deployed to IONOS webspace. Only stores and synchronizes multiplayer sessions; it contains no game logic.
- Never edit generated output: `dist/`, `.angular/`, `node_modules/`.

## Commands

| Task   | Command                                    |
| ------ | ------------------------------------------ |
| Build  | `npx ng build --configuration development` |
| Format | `npx prettier --write <files>`             |
| Tests  | `npx ng test --watch=false`                |

If a command fails because of the project setup, report it instead of inventing a workaround.

## Ask the user before you

- Add, remove or upgrade a dependency.
- Change build, test, lint or CI configuration (`angular.json`, `tsconfig*.json`, `package.json` scripts, …).
- Delete tests.

## App version

- Increase `appVersion` in `src/app/constants/version.ts` by 0.01 whenever the structure of persisted data changes. Multiplayer sessions require host and players to run the same version.

## Git

- Never run `git commit`, `git push`, `git merge`, `git rebase`, `git reset` or `git stash` on your own. Leave all changes uncommitted; the user reviews and commits them.
- If a commit seems useful, suggest a commit message instead of committing.

## Readability first

Code is written for humans who read it later. Prefer clarity over brevity and cleverness.

- Keep functions short and focused on one task; extract well-named helpers instead of nesting deeply.
- Prefer early returns over nested `if`/`else`.
- Avoid dense one-liners, chained ternaries and clever tricks when a few plain lines are clearer.
- Name intermediate results instead of inlining long expressions.
- No shorthand if statements (e.g. `if (x) return;`); use braces and a newline for clarity.

## Naming

- Use descriptive, intention-revealing names. No abbreviations or single letters, except `i`/`j` in loops.
- Use specific names that tell what is actually happening in the context. Avoid generic names like f.e. `getInfo` or `doFunction`. Longer names with up to 5 words are ok.
- Booleans should read as questions: `isValidHTML`, `hasXMLParsableContent`.
- Functions should start with a verb: `getConfigFromEnvFile`, `describeLoadError`, `createCrawlerClient`.
- In tests, use realistic example values and named helpers (e.g. `createPlaywrightError`) instead of placeholders.

## Comments

- As describe in Naming, functions and variables should be self-explanatory. Use comments only for complex functions where naming alone is not enough.
- When using comments, focus on what's happening that is not covered by the name.
- Always clean up unnecessary comments when you find them.

## TypeScript

- Avoid `any`; prefer `unknown` and narrow it. Use `any` only where a precise type isn't possible or reasonable.
- Avoid non-null assertions (`!`); handle the missing case explicitly. Use them only where it isn't possible or reasonable otherwise.
- Don't use `@ts-ignore`. Use `@ts-expect-error` only with a comment explaining why.

## Angular

This project started on Angular 17 and was updated to the current version without porting every new feature.
For consistency, follow these existing patterns instead of newer Angular APIs:

- State: `BehaviorSubject` + `Observable` in services, no signals (`signal`, `computed`, `effect`).
- Components: non-standalone (`standalone: false`), declared and imported via `app.module.ts`.
- Component APIs: `@Input()` / `@Output()` decorators, not `input()` / `output()` / `model()`.
- Templates: use the built-in control flow (`@if`, `@for`, `@switch`); it is already used everywhere.
- Dependency injection: use `inject()` in field initializers at the top of the class, no constructor parameters.

## File structure

- One main responsibility per file; split files that grow beyond ~200 lines or mix concerns.
- Group files by domain/feature, not by technical type.
- Put exported functions at the top of a file, private helpers below.
- Don't create generic dumping grounds like `utils.ts` or `helpers.ts`; name files after what they contain.

## Formatting

- Format changed files with Prettier using the project config (`npx prettier --write <files>`).

## Testing

- You are allowed to write and run tests.
- Only write tests that are meaningful and likely to catch regressions. Don't write tests for trivial code or code that is unlikely to break. Don't write tests just for coverage.
- For bug fixes, first write a test that reproduces the bug, then fix it.
- Keep tests deterministic: no real randomness (shuffling), timers or network. Stub them instead.
- One behavior per `it`, named in plain language (e.g. `it('restores the stored round after reload')`).
- Always clean up unnecessary when you find them.

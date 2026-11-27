# Agent instructions

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
- Use specific names that tell what is actually happening in the context. Avoid generic names like f.e. `getInfo` or `doFunction`.
- Booleans should read as questions: `isValidHTML`, `hasXMLParsableContent`.
- Functions should start with a verb: `getConfigFromEnvFile`, `describeLoadError`, `createCrawlerClient`.
- In tests, use realistic example values and named helpers (e.g. `createPlaywrightError`) instead of placeholders.

## Comments

- As describe in Naming, functions and variables should be self-explanatory. Use comments only for complex functions where naming alone is not enough.
- When using comments, focus on what's happening that is not covered by the name.
- Always clean up unnecessary comments when you find them.

## File structure

- Follow the service structure from [GUIDELINES.md](GUIDELINES.md).
- One main responsibility per file; split files that grow beyond ~200 lines or mix concerns.
- Group files by domain/feature, not by technical type.
- Mirror the `src/` structure in `test/` (e.g. `src/crawler/error-handling/x.ts` â†’ `test/crawler/error-handling/x.test.ts`).
- Put exported functions at the top of a file, private helpers below.
- Don't create generic dumping grounds like `utils.ts` or `helpers.ts`; name files after what they contain.

## Testing

- You are allowed to write and run tests.
- Only write tests that are meaningful and likely to catch regressions. Don't write tests for trivial code or code that is unlikely to break. Don't write tests just for coverage.
- Always clean up unnecessary when you find them.

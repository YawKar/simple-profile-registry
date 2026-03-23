# How to run it

```bash
cd $(git rev-parse --show-toplevel) && npm run local:up
```

The server will become reachable at `localhost:3000`.
The swagger-ui will be hosted on `localhost:3000/swagger-ui`.

# How to develop it

Prerequisites for development:
- you should have docker installed as I use `@testcontainers/postgresql`
- ideally you should have nix installed with enabled flake capability, this way you can mirror my setup through `nix develop`
  - this includes automatic pre-commit hooks installation
  - setup all necessary toolchains: npm, tsc, go-task, pre-commit, nixfmt, yamlfmt
- otherwise you may experience not the best Dev UX

# Additional notes

There are also the following commands:
```
# Automation
task fmt # to format everything, not just the ts/js source code
task lint # to lint everything, not just the ts/js source code
task pre-commit # to run every check (it is to be run in auto-installed pre-commit hooks)

# Testing
npm run test
```

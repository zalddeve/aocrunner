# AoC Runner

This repo contains the utility library to create and run [Advent of Code](https://adventofcode.com/2021/about) solutions.

---

![demo](demo.gif)

## Overview

- Creates JavaScript or TypeScript repository for AoC solutions with a simple CLI menu.
- Runs your solutions in watch mode (with extremely fast compilation for TS using [esbuild](https://esbuild.github.io/)).
- Allows you to fetch the input and send the solutions directly via terminal.
- Prevents you from sending empty solutions and incorrect solutions twice (so you won't accidentally get the time penalty).
- Provides a template for AoC solutions that you can customize.
- Takes care of loading the input, measuring solution time, and running simple unit tests (supports async and sync code).
- Automatically creates and updates README file.

## Installation

To create the AoC solutions project run (requires Node 16 LTS or higher: `v16.13.0+`):

```
npx aocrunner init
```

It will guide you through the configuration with simple CLI menu.

## After installation

- Go to the projects directory.
- initialize your version control system (ex: `git init`) _(optional)_
- add your AoC session key to the `.env` file (you can find it in cookie file when you sign in at [adventofcode.com](https://adventofcode.com/)) _(optional)_
- customize your template folder `src/template` _(optional)_
- start solving the puzzles by running `start <day_number>` command with your package manager, for example:

```
npm start 1

// or

yarn start 1

// or

pnpm start 1
```

## Join my leaderboard

You can [join](https://adventofcode.com/2019/leaderboard/private) my private leaderboard for JS/TS programmers:

Code:

```
107172-b51ab08f
```

## Note about automated requests

Aoc Runner respects [the concerns of the AoC creator](https://www.reddit.com/r/adventofcode/comments/3v64sb/aoc_is_fragile_please_be_gentle/), and does not send unnecessary requests. In fact, it reduces the number of requests sent to the AoC server when compared to doing things manually:

- it downloads the input once (you can re-download it only by deleting the input file),
- it keeps track of your failed and successful attempts and never sends the same solution twice,
- it prevents you from sending empty solutions or solutions that are not strings/numbers,
- when you send an incorrect solution, it locally keeps track of the remaining time before you can send another solution, so the server is not spammed with premature attempts.

## Note about ES Modules

This library creates modern, ESM compatible project - that means that you have to specify the extensions in your imports (that are not imported from `node_modules`).

Always use `.js` extension for custom imports, even when importing `.ts` files (TypeScript ignores them, but the compiled code relies on them).

Examples:

```ts
// correct:

import _ from "lodash"
import myLib from "../utils/myLib.js"
import { myUtil } from "../utils/index.js"

// incorrect:

import _ from "lodash"
import myLib from "../utils/myLib.ts"
import { myUtil } from "../utils/index.ts"

// also incorrect:

import _ from "lodash"
import myLib from "../utils/myLib"
import { myUtil } from "../utils"
```

## License

Project is under open, non-restrictive [ISC license](LICENSE.md).

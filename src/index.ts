import fs from "fs"
import path from "path"
import kleur from "kleur"
import getCallerFile from "get-caller-file"
import { stripIndent } from "common-tags"
import { saveConfig, readConfig } from "./io/config.js"

type Tests = { input: string; expected: string | number | bigint | void }[]
type Solution = (input: string) => string | number | bigint | void

type Solutions = {
  part1?: {
    solution: Solution
    tests?: Tests
  }
  part2?: {
    solution: Solution
    tests?: Tests
  }
  trimTestInputs?: boolean
}

const runTests = async (
  tests: Tests,
  solution: Solution,
  part: 1 | 2,
  trimTestInputs = true,
) => {
  for (let i = 0; i < tests.length; i++) {
    const { input, expected } = tests[i]

    const data = trimTestInputs ? stripIndent(input) : input

    const result = await solution(data)

    if (result === expected) {
      console.log(kleur.green(`Part ${part}, test ${i + 1} - passed`))
    } else {
      console.log(kleur.red(`Part ${part}, test ${i + 1} - failed`))
      console.log(`\nResult:`)
      console.dir(result)
      console.log(`\nExpected:`)
      console.dir(expected)
      console.log()
    }
  }
}

const runSolution = async (solution: Solution, input: string, part: 1 | 2) => {
  const t0 = process.hrtime.bigint()
  const result = await solution(input)
  const t1 = process.hrtime.bigint()
  const time = (Number(t1 - t0) / 1e6).toFixed(2)

  if (!["string", "number", "bigint", "undefined"].includes(typeof result)) {
    console.log(
      kleur.yellow(
        `Warning - the result type of part ${part} should be a string, a number or a bigint, got:`,
      ),
      kleur.red(typeof result),
    )
  }

  console.log(`\nPart ${part} (in ${time}ms):`)
  console.dir(result)

  return { result, time: Number(time) }
}

const runAsync = async (
  solutions: Solutions,
  inputFile: string,
  day: number,
) => {
  const config = readConfig()

  if (solutions?.part1?.tests) {
    await runTests(
      solutions.part1.tests,
      solutions.part1.solution,
      1,
      solutions.trimTestInputs,
    )
  }

  if (solutions?.part2?.tests) {
    await runTests(
      solutions.part2.tests,
      solutions.part2.solution,
      2,
      solutions.trimTestInputs,
    )
  }

  const input = fs.readFileSync(inputFile).toString()

  let output1
  let output2
  let totalTime = 0

  if (solutions.part1) {
    output1 = await runSolution(solutions.part1.solution, input, 1)
    totalTime += output1.time
  }

  if (solutions.part2) {
    output2 = await runSolution(solutions.part2.solution, input, 2)
    totalTime += output2.time
  }

  console.log(`\nTotal time: ${totalTime.toFixed(2)}ms`)

  config.days[day - 1].part1.result =
    output1?.result === undefined ? null : String(output1.result)

  config.days[day - 1].part1.time =
    output1?.result === undefined ? null : output1.time

  config.days[day - 1].part2.result =
    output2?.result === undefined ? null : String(output2.result)

  config.days[day - 1].part2.time =
    output2?.result === undefined ? null : output2.time

  saveConfig(config)
}

const run = (solutions: Solutions, inputFile?: string) => {
  const callerFile = getCallerFile().replace(/(file:\\\\)|(file:\/\/\/)|(file:\/\/)/, "")
  const dir = path.parse(callerFile).dir.split("/")
  const day = Number(
    [...dir]
      .reverse()
      .find((x) => /day\d\d/.test(x))
      ?.slice(-2),
  )

  if (inputFile === undefined) {
    const lastDist = dir.lastIndexOf("dist")

    if (lastDist !== -1) {
      dir[lastDist] = "src"
    }

    inputFile = path.join(dir.join(path.sep), "input.txt")
  }

  if (!fs.existsSync(inputFile)) {
    console.log(
      kleur.red(stripIndent`
        There is no "input.txt" file in the solution directory!
        
        Please add the file or specify custom file location
        via the second argument of the \`run\` function.
      `),
    )
    return
  }

  runAsync(solutions, inputFile, day)
}

export default run

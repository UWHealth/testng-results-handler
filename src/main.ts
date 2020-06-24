import * as core from '@actions/core'
import { wait } from './wait'
import { getResults } from './getResults'

async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`)

    const testngResults: string = core.getInput('testng_results')
    const results = await getResults(testngResults)
    core.debug(JSON.stringify(results))

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

import * as core from '@actions/core'
import * as github from '@actions/github'
import { getResults } from './results'
import { CommitStatus, setStatus, StatusState } from './status'

async function run(): Promise<void> {
  try {
    const testngResults: string = core.getInput('testng_results')
    const results = await getResults(testngResults)

    const commitStatus: CommitStatus = {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      sha: github.context.sha,
      state: StatusState.GOOD,
      target_url: 'https://saucelabs.com',
      description: `${process.env.LOCAL || ''} Pass: ${
        results.passed
      } + Fail: ${results.failed} + Ignore: ${results.ignored} + Skip: ${
        results.skipped
      } = Total: ${results.total}`,
      context: `${process.env.TEST || ''}End-to-End Test Results.`
    }

    const result = await setStatus(commitStatus)
    core.debug(`Created status: ${result}`)
    if (!result) {
      throw new Error(`GiHub Commit Status failed.`)
    }

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.error(error)
    core.setFailed(`Failinging worklfow: ${error.message}`)
  }
}

run()

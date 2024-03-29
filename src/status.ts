/* eslint-disable  @typescript-eslint/no-explicit-any */
import * as core from '@actions/core'
import * as github from '@actions/github'

export enum StatusState {
  ERR = 'error',
  FAIL = 'failure',
  PEND = 'pending',
  GOOD = 'success'
}

export interface CommitStatus {
  owner: string
  repo: string
  sha: string
  state: StatusState
  target_url?: string
  description?: string
  context?: string
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export async function setStatus(status: any): Promise<boolean> {
  return new Promise(resolve => {
    try {
      const myToken: string = core.getInput('token')
      const octokit = github.getOctokit(myToken)
      core.debug(status)
      octokit.rest.repos.createCommitStatus(status).then(response => {
        core.debug(`GitHub Commit Status Response State: ${response.data.state}`)
        core.debug(JSON.stringify(response))
        resolve(true)
      })
    } catch (err: any) {
      core.error(err)
      resolve(false)
    }
  })
}

import * as github from '@actions/github'
import { WebhookPayload } from '@actions/github/lib/interfaces'
import * as core from '@actions/core'
import nock from 'nock'
import { setStatus } from '../src/status'

beforeEach(() => {
  jest.resetModules()
  jest.spyOn(core, 'getInput').mockImplementation((name: string): string => {
    if (name === 'token') return '12345'
    if (name === 'status_url') return 'https://github.com'
    return ''
  })

  process.env['GITHUB_REPOSITORY'] = 'UWHealth/testng-results-handler'

  github.context.payload = {
    state: 'success'
  } as WebhookPayload

})

afterEach(() => {
  nock.isDone()
  nock.cleanAll()
})

describe('GitHub Status', () => {
  // test set with a 500 ms timeout to so the Nock API mock fails quickly, so no real network call is being made.
  test('GitHub Status Set Correctly', async () => {

    const mockRepoData = {
      owner: 'UWHealth',
      repo: 'testng-results-handler',
      sha: 'sha12345'
    }

    const mockBodyData = {
      state: 'success',
      target_url: core.getInput('status_url') || '',
      description: `Pass: 10 + Fail: 0 + Ignore: 1 + Skip: 1 = Total: 12`,
      context: `End-to-End Test Results.`
    }

    nock('https://api.github.com')
      .post(
        `/repos/${mockRepoData.owner}/${mockRepoData.repo}/statuses/${mockRepoData.sha}`, mockBodyData
      ).matchHeader('authorization', `token ${core.getInput('token')}`)
      .reply(200, github.context.payload)

    const conclusion = await setStatus(Object.assign(mockRepoData, mockBodyData)).catch((err) => { console.error(err) })

    expect(conclusion).toEqual(true)
    console.log(`GitHub Status Set Correctly Conclusion: ${conclusion}`)

  }, 500)

})


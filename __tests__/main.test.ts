import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import * as core from '@actions/core'
import { run } from '../src/main'

function setInputs(): boolean {
  process.env['INPUT_SKIP_GIHUB_STATUS_UPDATE'] = 'true'
  process.env['INPUT_TESTNG_RESULTS'] = '__tests__/testng-results.mock.xml'
  process.env['INPUT_STATUS_URL'] = 'https://github.com'
  process.env['GITHUB_REPOSITORY'] = 'UWHealth/testng-results-handler'
  return true
}

// shows how the runner will run a javascript action with env / stdout protocol
describe('Build and run Tests', () => {
  beforeEach(() => {
    setInputs()
  })

  test('Test the build for successful execution.', () => {
    const ip = path.join(__dirname, '..', 'lib', 'main.js')
    const options: cp.ExecSyncOptions = {}
    options.env = process.env
    try {
      console.log(cp.execSync(`node ${ip}`, options).toString())
    } catch (err) {
      core.error(err.message)
      core.error(err.stack)
      throw err
    }
  })

  test('Test run console.log for expected message.', async () => {
    const debugMock = jest.spyOn(console, 'log')
    await run()
    expect(debugMock).toHaveBeenCalledWith(
      `Github status with TestNG results skipped. Input(skip_gihub_status_update): true`
    )
  })

  test('Test core debug for expected messages.', async () => {
    const debugMock = jest.spyOn(core, 'debug')
    await run()
    expect(debugMock).toHaveBeenNthCalledWith(1, `Results file path: __tests__/testng-results.mock.xml`)
    expect(debugMock).toHaveBeenNthCalledWith(3, `successState<false>, failed:13`)
  })
})

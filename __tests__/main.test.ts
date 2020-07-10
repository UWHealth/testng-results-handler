import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import * as core from '@actions/core'

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecSyncOptions = {}
  // ENV for Jest
  process.env['INPUT_TESTNG_RESULTS'] = '__tests__/testng-results.xml'
  process.env['INPUT_STATUS_URL'] = 'https://github.com'
  process.env['TEST'] = 'Unit test: '
  // ENV for local run
  if (process.env['GITHUB_ACTIONS'] != 'true') {
    process.env['GITHUB_REPOSITORY'] = 'UWHealth/testng-results-handler'
    process.env['GITHUB_SHA'] = 'd5bb0ce69dcbc27c50a5291cc37c4371a02b94ab'
    process.env['LOCAL'] = 'Local Unit Test Run: '
    options.stdio = 'inherit'
  }
  options.env = process.env
  try {
    console.log(cp.execSync(`node ${ip}`, options).toString())
  } catch (err) {
    core.error(err.message)
    core.error(err.stack)
    throw err
  }
})

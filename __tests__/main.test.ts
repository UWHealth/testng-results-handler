import { wait } from '../src/wait'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

test('throws invalid number', async () => {
  const input = parseInt('foo', 10)
  await expect(wait(input)).rejects.toThrow('milliseconds not a number')
})

test('wait 500 ms', async () => {
  const start = new Date()
  await wait(500)
  const end = new Date()
  const delta = Math.abs(end.getTime() - start.getTime())
  expect(delta).toBeGreaterThan(450)
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  // ENV for local Jest
  process.env['INPUT_MILLISECONDS'] = '1000'
  process.env['INPUT_TESTNG_RESULTS'] = '__tests__/testng-results.xml'
  process.env['GITHUB_REPOSITORY'] = 'UWHealth/proxy-patient.uwhealth.org'
  process.env['GITHUB_SHA'] = '7a7d01ee69518b95c991760e574ed3881949dd30'
  process.env['LOCAL'] = 'Local Unit Test Run. '
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecSyncOptions = {
    env: process.env
  }
  console.log(cp.execSync(`node ${ip}`, options).toString())
})

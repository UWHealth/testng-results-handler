import * as core from '@actions/core'
import fs from 'fs'
import path from 'path'
import convert, { ElementCompact } from 'xml-js'

export interface testngResults {
  skipped: number
  ignored: number
  passed: number
  failed: number
  total: number
  success: boolean
}

export async function getResults(resultsPath: string): Promise<testngResults> {
  return new Promise(resolve => {
    core.debug(`Results file path: ${resultsPath}`)

    fs.readFile(path.join(__dirname, '..', resultsPath), (err, data) => {
      if (err) {
        const badPath = path.join(__dirname, '..', resultsPath)
        console.error(`Observed bad path: ${badPath}`)
        throw err
      }
      const xml: string = data.toString()
      const fullResults: ElementCompact = convert.xml2js(xml, {
        compact: true,
        trim: true
      })
      const result = fullResults['testng-results']['_attributes']

      core.debug(result)

      // validate inputs

      function validNumber(input: string): number {
        if (Number.isNaN(Number.parseInt(input))) {
          return 0
        }
        return Number.parseInt(input)
      }

      const failedThresholdNumber: number = validNumber(
        core.getInput('failed_threshold_number')
      )
      const skippedThresholdNumber: number = validNumber(
        core.getInput('skipped_threshold_number')
      )
      const failedThresholdPercent: number = validNumber(
        core.getInput('failed_threshold_percent')
      )
      const skippedThresholdPercent: number = validNumber(
        core.getInput('skipped_threshold_percent')
      )

      // logic to determine the success
      let successState = false
      let failedTestStatePasses = false
      let skippedTestStatePasses = false

      if (
        failedThresholdNumber +
          skippedThresholdNumber +
          failedThresholdPercent +
          skippedThresholdPercent >
        0
      ) {
        if (
          (failedThresholdNumber > 0 &&
            result.failed <= failedThresholdNumber) ||
          (failedThresholdPercent > 0 &&
            (result.failed / result.total) * 100 <= failedThresholdPercent)
        )
          failedTestStatePasses = true

        if (
          (skippedThresholdNumber > 0 &&
            result.skipped <= skippedThresholdNumber) ||
          (skippedThresholdPercent > 0 &&
            (result.skipped / result.total) * 100 <= failedThresholdPercent)
        )
          skippedTestStatePasses = true

        successState = failedTestStatePasses && skippedTestStatePasses
        core.debug(
          `successState<${successState}> = failedTestStatePasses<${failedTestStatePasses}> && skippedTestStatePasses<${skippedTestStatePasses}>`
        )
      } else {
        successState = result.failed != 0 ? false : true
        core.debug(`successState<${successState}>, failed:${result.failed} `)
      }

      const results: testngResults = {
        skipped: result.skipped,
        ignored: result.ignored,
        passed: result.passed,
        failed: result.failed,
        total: result.total,
        success: successState
      }

      resolve(results)
    })
  })
}

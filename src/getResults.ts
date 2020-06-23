import * as core from '@actions/core'
import fs from 'fs'
import path from 'path'
import convert, { ElementCompact } from 'xml-js'

export async function getResults(resultsPath: string): Promise<ElementCompact> {
  return new Promise(resolve => {
    core.debug(`Results file path: ${resultsPath}`)

    fs.readFile(path.join(__dirname, '..', resultsPath), (err, data) => {
      if (err) {
        const badPath = path.join(__dirname, '..', resultsPath)
        console.error(`Observed path: ${badPath}`)
        throw err
      }
      const xml: string = data.toString()
      const result: ElementCompact = convert.xml2js(xml, {
        compact: true,
        trim: true
      })

      console.debug(result['testng-results']['_attributes'])

      resolve(result['testng-results']['_attributes'])
    })
  })
}

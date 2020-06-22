import * as core from '@actions/core'
import fs from 'fs'
import path from 'path'
import convert, { ElementCompact } from 'xml-js'

export async function getResults(resultsPath: string): Promise<string> {
  return new Promise(resolve => {
    core.debug(`Results file path: ${resultsPath}`)

    fs.readFile(path.join(__dirname, '..', resultsPath), (err, data) => {
      if (err) throw err

      const xml: string = data.toString()
      const result: ElementCompact = convert.xml2js(xml, {
        compact: true,
        trim: true
      })

      console.debug(result)

      resolve('Done')
    })
  })
}

# TestNG Results Handler

![build-test](https://github.com/UWHealth/testng-results-handler/workflows/build-test/badge.svg?branch=master)

This action does the following:

1. Read a standard [testng results report xml file](https://testng.org/doc/documentation-main.html#logging-xml-reports), and extract the results summary

2. Set a successful GitHub Commit Status with the results.

## Inputs

### `testng_results`

**Required**. Path relative to the root for the TestNG results. Default `"testng-results.xml"`.

### `token`

**Required**. The token provided by GitHub actions via secrets.GITHUB_TOKEN. Default _none_.

### `status_url`

_Optional_. URL to display alongside the Github Commit Status. Default _none_.

## Outputs

No outputs.

## Example usage

```yaml
  - uses: UWHealth/testng-results-handler@v1.0.0
    with:
      testng_results: __tests__/testng-results.xml
      token: ${{ secrets.GITHUB_TOKEN }}
      status_url: https://accounts.saucelabs.com/am/XUI/#login/
```

Appearance in the Pull Request GUI:

image here

## Development

Install the dependencies

```bash
npm install
```

Build the typescript, lint, format and package it for distribution

```bash
npm run all
# which is short for
npm run build && npm run format && npm run lint && npm run pack && npm test
```

Running the tests separately. Test simply calls the TypeScript transpiled JavaScript with mock information.

```bash
$ npm test

 PASS  __tests__/main.test.ts
  √ test runs (1312 ms)

  console.log
    ::debug::Results file path: __tests__/testng-results.xml
    ::debug::{"skipped":"0","failed":"22","ignored":"3","total":"231","passed":"206"}
    ::debug::Created status: true
    ::debug::GitHub Commit Status Response State: success

      at Object.<anonymous> (__tests__/main.test.ts:21:13)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        5.194 s
Ran all test suites.
```

import { getResults } from '../src/results'

const numberCases = [
  [0, 0, 0, 0, true, false, true, false],
  [0, 0, 4, 0, true, false, false, false],
  [0, 0, 6, 0, true, false, true, false],
  [0, 0, 0, 10, true, false, false, false],
  [0, 0, 0, 14, true, true, false, false],
  [0, 0, 4, 10, true, false, false, false],
  [0, 0, 4, 14, true, true, false, false],
  [0, 0, 6, 10, true, false, true, false],
  [0, 0, 6, 14, true, true, true, true]
]
const percentCases = [
  [0, 0, 0, 0, true, false, true, false],
  [1, 0, 0, 0, true, false, false, false],
  [3, 0, 0, 0, true, false, true, false],
  [0, 4, 0, 0, true, false, false, false],
  [0, 6, 0, 0, true, true, false, false],
  [1, 4, 0, 0, true, false, false, false],
  [1, 6, 0, 0, true, true, false, false],
  [3, 4, 0, 0, true, false, true, false],
  [3, 6, 0, 0, true, true, true, true]
]

function clearInputs(): boolean {
  process.env['INPUT_SKIPPED_THRESHOLD_NUMBER'] = '0'
  process.env['INPUT_FAILED_THRESHOLD_NUMBER'] = '0'
  process.env['INPUT_SKIPPED_THRESHOLD_PERCENT'] = '0'
  process.env['INPUT_FAILED_THRESHOLD_PERCENT'] = '0'
  return true
}

describe('Results Test', () => {
  test('Default inputs', async () => {
    process.env['INPUT_SKIPPED_THRESHOLD_NUMBER'] = '0'
    process.env['INPUT_FAILED_THRESHOLD_NUMBER'] = '0'
    process.env['INPUT_SKIPPED_THRESHOLD_PERCENT'] = '0'
    process.env['INPUT_FAILED_THRESHOLD_PERCENT'] = '0'
    const res = await getResults('__tests__/testng-results-summary-2.mock.xml')
    console.log(`Failed: ${res.failed}`)
    expect(res.success).toBe(false)
  })

  beforeEach(() => {
    clearInputs()
  })

  test('Total Expected 231', async () => {
    const res = await getResults('__tests__/testng-results.mock.xml')
    expect(res.total).toBe('231')
  })

  test('Passed Expected 206', async () => {
    const res = await getResults('__tests__/testng-results.mock.xml')
    expect(res.passed).toBe('206')
  })

  test('Failed Expected 13', async () => {
    const res = await getResults('__tests__/testng-results.mock.xml')
    expect(res.failed).toBe('13')
  })

  test('Ingnored Expected 3', async () => {
    const res = await getResults('__tests__/testng-results.mock.xml')
    expect(res.ignored).toBe('3')
  })

  test('Skipped Expected 0', async () => {
    const res = await getResults('__tests__/testng-results.mock.xml')
    expect(res.skipped).toBe('0')
  })

  test.each(numberCases)(
    'given %p, %p, *%p*, *%p* as args, return *%p* %p %p %p',
    async (arg1, arg2, arg3, arg4, result1, result2, result3, result4) => {
      process.env['INPUT_SKIPPED_THRESHOLD_NUMBER'] = `${arg3}`
      process.env['INPUT_FAILED_THRESHOLD_NUMBER'] = `${arg4}`
      const res = await getResults(
        '__tests__/testng-results-summary-1.mock.xml'
      )
      expect(res.success).toBe(result1)
    }
  )
  test.each(numberCases)(
    'given %p, %p, *%p*, *%p* as args, return %p *%p* %p %p',
    async (arg1, arg2, arg3, arg4, result1, result2, result3, result4) => {
      process.env['INPUT_SKIPPED_THRESHOLD_NUMBER'] = `${arg3}`
      process.env['INPUT_FAILED_THRESHOLD_NUMBER'] = `${arg4}`
      const res = await getResults(
        '__tests__/testng-results-summary-2.mock.xml'
      )
      expect(res.success).toBe(result2)
    }
  )

  test.each(numberCases)(
    'given %p, %p, *%p*, *%p* as args, return %p %p *%p* %p',
    async (arg1, arg2, arg3, arg4, result1, result2, result3, result4) => {
      process.env['INPUT_SKIPPED_THRESHOLD_NUMBER'] = `${arg3}`
      process.env['INPUT_FAILED_THRESHOLD_NUMBER'] = `${arg4}`
      const res = await getResults(
        '__tests__/testng-results-summary-3.mock.xml'
      )
      expect(res.success).toBe(result3)
    }
  )

  test.each(numberCases)(
    'given %p, %p, *%p*, *%p* as args, return %p %p %p *%p*',
    async (arg1, arg2, arg3, arg4, result1, result2, result3, result4) => {
      process.env['INPUT_SKIPPED_THRESHOLD_NUMBER'] = `${arg3}`
      process.env['INPUT_FAILED_THRESHOLD_NUMBER'] = `${arg4}`
      const res = await getResults(
        '__tests__/testng-results-summary-4.mock.xml'
      )
      expect(res.success).toBe(result4)
    }
  )

  test.each(percentCases)(
    'given *%p*, *%p*, %p, %p as args, return *%p* %p %p %p',
    async (arg1, arg2, arg3, arg4, result1, result2, result3, result4) => {
      process.env['INPUT_SKIPPED_THRESHOLD_PERCENT'] = `${arg1}`
      process.env['INPUT_FAILED_THRESHOLD_PERCENT'] = `${arg2}`
      const res = await getResults(
        '__tests__/testng-results-summary-1.mock.xml'
      )
      expect(res.success).toBe(result1)
    }
  )

  test.each(percentCases)(
    'given *%p*, *%p*, %p, %p as args, return %p *%p* %p %p',
    async (arg1, arg2, arg3, arg4, result1, result2, result3, result4) => {
      process.env['INPUT_SKIPPED_THRESHOLD_PERCENT'] = `${arg1}`
      process.env['INPUT_FAILED_THRESHOLD_PERCENT'] = `${arg2}`
      const res = await getResults(
        '__tests__/testng-results-summary-2.mock.xml'
      )
      expect(res.success).toBe(result2)
    }
  )

  test.each(percentCases)(
    'given *%p*, *%p*, %p, %p as args, return %p %p *%p* %p',
    async (arg1, arg2, arg3, arg4, result1, result2, result3, result4) => {
      process.env['INPUT_SKIPPED_THRESHOLD_PERCENT'] = `${arg1}`
      process.env['INPUT_FAILED_THRESHOLD_PERCENT'] = `${arg2}`
      const res = await getResults(
        '__tests__/testng-results-summary-3.mock.xml'
      )
      expect(res.success).toBe(result3)
    }
  )

  test.each(percentCases)(
    'given *%p*, *%p*, %p, %p as args, return %p %p %p *%p*',
    async (arg1, arg2, arg3, arg4, result1, result2, result3, result4) => {
      process.env['INPUT_SKIPPED_THRESHOLD_PERCENT'] = `${arg1}`
      process.env['INPUT_FAILED_THRESHOLD_PERCENT'] = `${arg2}`
      const res = await getResults(
        '__tests__/testng-results-summary-4.mock.xml'
      )
      expect(res.success).toBe(result4)
    }
  )
})

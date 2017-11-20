jest.mock('../http')

import ListResultsContainer from './ListResultsContainer'

const A_RESOURCE_PATH = '/banners'
const A_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ'
const QUERY_PARAMS = {
  summary: true,
  offset: 0,
  size: 2,
}
const SOME_HITS = [
  {
    id: 1,
    name : 'a name',
    description: 'a description'
  },
  {
    id: 2,
    name : 'another name',
    description: 'another description'
  }
]
const TOTAL_HITS = 10

describe('ListResultsContainer', () => {
  let resultsContainer

  beforeEach(() => {
    resultsContainer = new ListResultsContainer(A_RESOURCE_PATH, {...QUERY_PARAMS}, A_TOKEN, [...SOME_HITS], TOTAL_HITS)
  })

  describe('all', () => {
    it('should return empty array if the results are empty even without size param', () => {
      resultsContainer = new ListResultsContainer(A_RESOURCE_PATH, {QUERY_PARAMS}, A_TOKEN)
      resultsContainer._fetchNext = jest.fn()

      const promise = resultsContainer.all()

      expect(resultsContainer._fetchNext).not.toBeCalled()
      return expect(promise).resolves.toEqual([])
    })

    it('should return the hits dataset if there is a size fetch param', () => {
      resultsContainer._fetchNext = jest.fn()

      const promise = resultsContainer.all()

      expect(resultsContainer._fetchNext).not.toBeCalled()
      return expect(promise).resolves.toEqual(SOME_HITS)
    })

    it('should return the hits if no size params but all results were fetched', () => {
      resultsContainer.total_hits = SOME_HITS.length
      resultsContainer._fetchNext = jest.fn()

      const promise = resultsContainer.all()

      expect(resultsContainer._fetchNext).not.toBeCalled()
      return expect(promise).resolves.toEqual(SOME_HITS)
    })

    it('should recursive _fetchNext and return all accumulated results when no size param and not all results were fetched', () => {
      delete resultsContainer.req_fetch_options.size
      resultsContainer._fetchNext = jest.fn(() => Promise.resolve(SOME_HITS))

      const promise = resultsContainer.all()

      return promise.then(results => {
        expect(results.length).toEqual(TOTAL_HITS)
        expect(resultsContainer._fetchNext.mock.calls.length).toEqual((TOTAL_HITS / SOME_HITS.length) -1)
      })
    })
  })
})

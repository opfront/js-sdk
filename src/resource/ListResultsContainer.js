import { makeRequest } from '../http'

const AUTO_SIZE = 50

// TODO add 2 new class params to manage offset (next_offset and previous_offset)
class ListResultsContainer {
  constructor(resource_path, req_fetch_options, auth_token, hits=[], total_hits=0) {
    this.req_fetch_options = req_fetch_options
    this.resource_path = resource_path
    this.auth_token = auth_token
    this.total_hits = total_hits
    this.hits = hits
  }

  get current_offset() {
    return this.hits.length + this.req_fetch_options.offset
  }

  _fetchNext() {
    const paging_and_auth = {
      auth_token: this.auth_token,
      offset: this.current_offset,
      size : this.req_fetch_options.size || AUTO_SIZE
    }

    const options = Object.assign({}, this.req_fetch_options, paging_and_auth)

    return makeRequest('GET', this.resource_path, options)
  }

  all() {
    const more_to_fetch = !this.req_fetch_options.size && this.current_offset < this.total_hits
    if (more_to_fetch) {
      return this._fetchNext()
        .then(nextHits => {
          this.hits = [...this.hits, ...nextHits]
          return this.all()
        })
    } else {
      return Promise.resolve(this.hits)
    }
  }


  [Symbol.iterator]() {

  }
}

export default ListResultsContainer

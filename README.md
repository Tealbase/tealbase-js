# `tealbase-js`

An isomorphic JavaScript client for tealbase.

- **Documentation:** https://tealbase.com/docs/client/tealbase-client
- TypeDoc: https://tealbase.github.io/tealbase-js

## Usage

First of all, you need to install the library:

```sh
npm install @tealbase/tealbase-js
```

Then you're able to import the library and establish the connection with the database:

```js
import { createClient } from '@tealbase/tealbase-js'

// Create a single tealbase client for interacting with your database
const tealbase = createClient('https://xyzcompany.tealbase.co', 'public-anon-key')
```

### UMD

You can now use plain `<script>`s to import tealbase-js from CDNs, like:

```html
<script src="https://cdn.jsdelivr.net/npm/@tealbase/tealbase-js"></script>
```

or even:

```html
<script src="https://unpkg.com/@tealbase/tealbase-js"></script>
```

Then you can use it from a global `tealbase` variable:

```html
<script>
  const { createClient } = tealbase
  const _tealbase = createClient('https://xyzcompany.tealbase.co', 'public-anon-key')

  console.log('tealbase Instance: ', _tealbase)
  // ...
</script>
```

### ESM

You can now use type="module" `<script>`s to import tealbase-js from CDNs, like:

```html
<script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@tealbase/tealbase-js/+esm'
  const tealbase = createClient('https://xyzcompany.tealbase.co', 'public-anon-key')

  console.log('tealbase Instance: ', tealbase)
  // ...
</script>
```

### Custom `fetch` implementation

`tealbase-js` uses the [`cross-fetch`](https://www.npmjs.com/package/cross-fetch) library to make HTTP requests, but an alternative `fetch` implementation can be provided as an option. This is most useful in environments where `cross-fetch` is not compatible, for instance Cloudflare Workers:

```js
import { createClient } from '@tealbase/tealbase-js'

// Provide a custom `fetch` implementation as an option
const tealbase = createClient('https://xyzcompany.tealbase.co', 'public-anon-key', {
  fetch: (...args) => fetch(...args),
})
```

## Sponsors

We are building the features of Firebase using enterprise-grade, open source products. We support existing communities wherever possible, and if the products don’t exist we build them and open source them ourselves. Thanks to these sponsors who are making the OSS ecosystem better for everyone.

[![New Sponsor](https://user-images.githubusercontent.com/10214025/90518111-e74bbb00-e198-11ea-8f88-c9e3c1aa4b5b.png)](https://github.com/sponsors/tealbase)

# `tealbase-js` - Isomorphic JavaScript Client for tealbase.

- **Documentation:** https://tealbase.com/docs/reference/javascript/start
- TypeDoc: https://tealbase.github.io/tealbase-js/v2/

> [!NOTE]
> Do you want to help us shape the future of this library? [We're hiring](https://jobs.ashbyhq.com/tealbase/85d07345-47c6-4980-82e2-57782f83ab4e).

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

You can use plain `<script>`s to import tealbase-js from CDNs, like:

```html
<script src="https://cdn.jsdelivr.net/npm/@tealbase/tealbase-js@2"></script>
```

or even:

```html
<script src="https://unpkg.com/@tealbase/tealbase-js@2"></script>
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

You can use `<script type="module">` to import tealbase-js from CDNs, like:

```html
<script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@tealbase/tealbase-js/+esm'
  const tealbase = createClient('https://xyzcompany.tealbase.co', 'public-anon-key')

  console.log('tealbase Instance: ', tealbase)
  // ...
</script>
```

### Deno

You can use tealbase-js in the Deno runtime via [JSR](https://jsr.io/@tealbase/tealbase-js):

```js
import { createClient } from 'jsr:@tealbase/tealbase-js@2'
```

### Custom `fetch` implementation

`tealbase-js` uses the [`cross-fetch`](https://www.npmjs.com/package/cross-fetch) library to make HTTP requests, but an alternative `fetch` implementation can be provided as an option. This is most useful in environments where `cross-fetch` is not compatible, for instance Cloudflare Workers:

```js
import { createClient } from '@tealbase/tealbase-js'

// Provide a custom `fetch` implementation as an option
const tealbase = createClient('https://xyzcompany.tealbase.co', 'public-anon-key', {
  global: {
    fetch: (...args) => fetch(...args),
  },
})
```

## Testing

### Unit Testing

```bash
pnpm test
```

### Integration Testing

```bash
tealbase start
pnpm run test:integration
```

## Badges

[![Coverage Status](https://coveralls.io/repos/github/tealbase/tealbase-js/badge.svg?branch=master)](https://coveralls.io/github/tealbase/tealbase-js?branch=master)

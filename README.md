# `tealbase-js` - Isomorphic JavaScript Client for tealbase.

- **Documentation:** https://tealbase.com/docs/reference/javascript/start
- TypeDoc: https://tealbase.github.io/tealbase-js/v2/

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

### Expo Testing

The project includes Expo integration tests to ensure compatibility with React Native environments.

### Next.js Testing

The project includes Next.js integration tests to ensure compatibility with React SSR environments.

### Deno Testing

The project includes Deno integration tests to ensure compatibility with Deno runtime.

### Bun Testing

The project includes Bun integration tests to ensure compatibility with Bun runtime.

#### CI/CD Testing

When running on CI, the tests automatically use the latest dependencies from the root project. The CI pipeline:

1. Builds the main project with current dependencies
2. Creates a package archive (`.tgz`) with the latest versions
3. Uses this archive in Expo, Next.js, and Deno tests to ensure consistency

#### Local Development

For local development of Expo, Next.js, and Deno tests, you can update dependencies using automated scripts:

```bash
# Update all test dependencies at once
npm run update:test-deps

# Or update specific test environments:
npm run update:test-deps:expo    # Expo tests only
npm run update:test-deps:next    # Next.js tests only
npm run update:test-deps:deno    # Deno tests only
npm run update:test-deps:bun     # Bun tests only
```

**Note:** The CI automatically handles dependency synchronization, so manual updates are only needed for local development and testing.

## Badges

[![Coverage Status](https://coveralls.io/repos/github/tealbase/tealbase-js/badge.svg?branch=master)](https://coveralls.io/github/tealbase/tealbase-js?branch=master)

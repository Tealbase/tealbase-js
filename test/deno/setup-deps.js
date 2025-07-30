#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

// Get the directory of the script
const scriptDir = __dirname
const projectRoot = path.dirname(path.dirname(scriptDir))

// Read package.json from main project
const packageJsonPath = path.join(projectRoot, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

// Extract versions from package.json dependencies
const getVersion = (packageName) => {
  const dependencies = packageJson.dependencies || {}
  const devDependencies = packageJson.devDependencies || {}

  // Check both dependencies and devDependencies
  return dependencies[packageName] || devDependencies[packageName] || null
}

const versions = {
  realtime: getVersion('@tealbase/realtime-js'),
  functions: getVersion('@tealbase/functions-js'),
  postgrest: getVersion('@tealbase/postgrest-js'),
  auth: getVersion('@tealbase/auth-js'),
  storage: getVersion('@tealbase/storage-js'),
  node_fetch: getVersion('@tealbase/node-fetch'),
}

// Read or create deno.json
const denoJsonPath = path.join(scriptDir, 'deno.json')
let denoJson = {
  lock: false,
  imports: {},
}

try {
  if (fs.existsSync(denoJsonPath)) {
    denoJson = JSON.parse(fs.readFileSync(denoJsonPath, 'utf8'))
  }
} catch (error) {
  console.warn('Warning: Could not read existing deno.json, creating new one')
}

// Update imports in deno.json
denoJson.imports = {
  '@tealbase/realtime-js': `npm:@tealbase/realtime-js@${versions.realtime}`,
  '@tealbase/functions-js': `npm:@tealbase/functions-js@${versions.functions}`,
  '@tealbase/postgrest-js': `npm:@tealbase/postgrest-js@${versions.postgrest}`,
  '@tealbase/auth-js': `npm:@tealbase/auth-js@${versions.auth}`,
  '@tealbase/storage-js': `npm:@tealbase/storage-js@${versions.storage}`,
  '@tealbase/node-fetch': `npm:@tealbase/node-fetch@${versions.node_fetch}`,
}

// Write updated deno.json
fs.writeFileSync(denoJsonPath, JSON.stringify(denoJson, null, 2) + '\n')

console.log('Updated deno.json with versions from package.json')
console.log('Versions used:', versions)

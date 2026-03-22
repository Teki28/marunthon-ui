#!/usr/bin/env node
/**
 * Upload each race in src/data/race.json as a standalone object to Cloudflare R2.
 * Each race is stored as races/{id}.json
 *
 * Setup:
 *   1. Copy util/.env.example to util/.env and fill in your credentials
 *   2. Run: node util/upload-races.js
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))

config({ path: resolve(__dirname, '.env') })

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
} = process.env

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error('Missing required env vars. Check util/.env against util/.env.example')
  process.exit(1)
}

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

const filePath = resolve(__dirname, '../src/data/race.json')
const races = JSON.parse(readFileSync(filePath, 'utf-8'))

console.log(`Found ${races.length} races. Uploading to r2://${R2_BUCKET_NAME}/races/\n`)

let passed = 0
let failed = 0

async function upload(key, body) {
  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: 'application/json',
    })
  )
}

// Upload individual race objects
for (const race of races) {
  const key = `races/${race.id}`
  try {
    await upload(key, JSON.stringify(race))
    console.log(`  ✓ ${key}`)
    passed++
  } catch (err) {
    console.error(`  ✗ ${key} — ${err.message}`)
    failed++
  }
}

// Upload index (full array) so the app can fetch all races in one request
try {
  await upload('races/index.json', JSON.stringify(races))
  console.log(`  ✓ races/index.json`)
  passed++
} catch (err) {
  console.error(`  ✗ races/index.json — ${err.message}`)
  failed++
}

console.log(`\nDone: ${passed} uploaded, ${failed} failed`)
if (failed > 0) process.exit(1)

#!/usr/bin/env node
/**
 * Set CORS policy on the R2 bucket so the browser can fetch race data.
 *
 * Requires an API token with bucket-level admin permissions (not just Object Read/Write).
 * Create one at: Cloudflare Dashboard → R2 → Manage R2 API Tokens → Admin Read & Write
 *
 * Add to util/.env:
 *   R2_ADMIN_ACCESS_KEY_ID=...
 *   R2_ADMIN_SECRET_ACCESS_KEY=...
 *
 * Then run: node util/set-cors.js
 */

import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } from '@aws-sdk/client-s3'
import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '.env') })

const {
  R2_ACCOUNT_ID,
  R2_ADMIN_ACCESS_KEY_ID,
  R2_ADMIN_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
} = process.env

if (!R2_ADMIN_ACCESS_KEY_ID || !R2_ADMIN_SECRET_ACCESS_KEY) {
  console.error('Add R2_ADMIN_ACCESS_KEY_ID and R2_ADMIN_SECRET_ACCESS_KEY to util/.env')
  console.error('Create a token with Admin Read & Write at: Cloudflare → R2 → Manage R2 API Tokens')
  process.exit(1)
}

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ADMIN_ACCESS_KEY_ID,
    secretAccessKey: R2_ADMIN_SECRET_ACCESS_KEY,
  },
})

const corsRules = [
  {
    AllowedOrigins: ['http://localhost:5173', 'http://localhost:4173'],
    AllowedMethods: ['GET', 'HEAD'],
    AllowedHeaders: ['*'],
    ExposeHeaders: ['ETag', 'Content-Type'],
    MaxAgeSeconds: 3600,
  },
]

await client.send(new PutBucketCorsCommand({
  Bucket: R2_BUCKET_NAME,
  CORSConfiguration: { CORSRules: corsRules },
}))

console.log('✓ CORS configured on bucket:', R2_BUCKET_NAME)
console.log('  Allowed origins:', corsRules[0].AllowedOrigins.join(', '))
console.log('\nAdd your production domain to AllowedOrigins before deploying.')

// Verify
const { CORSRules } = await client.send(new GetBucketCorsCommand({ Bucket: R2_BUCKET_NAME }))
console.log('\nActive CORS rules:', JSON.stringify(CORSRules, null, 2))

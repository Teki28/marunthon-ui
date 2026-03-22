import { useState, useEffect } from 'react'
import { S3Client, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'

const {
  VITE_R2_ACCOUNT_ID,
  VITE_R2_ACCESS_KEY_ID,
  VITE_R2_SECRET_ACCESS_KEY,
  VITE_R2_BUCKET_NAME,
} = import.meta.env

function getClient() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${VITE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: VITE_R2_ACCESS_KEY_ID,
      secretAccessKey: VITE_R2_SECRET_ACCESS_KEY,
    },
  })
}

async function fetchAllRaces() {
  const client = getClient()

  // List all objects in the bucket
  const listRes = await client.send(
    new ListObjectsV2Command({ Bucket: VITE_R2_BUCKET_NAME, Prefix: 'races/' })
  )
  const keys = (listRes.Contents ?? []).map((obj) => obj.Key)

  // Fetch each object in parallel
  const races = await Promise.all(
    keys.map(async (key) => {
      const res = await client.send(
        new GetObjectCommand({ Bucket: VITE_R2_BUCKET_NAME, Key: key })
      )
      const text = await res.Body.transformToString()
      const data = JSON.parse(text)
      // Ensure id is set from the object key if not already present
      return { id: key, ...data }
    })
  )

  return races
}

export function useRaces() {
  const [races, setRaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const missing = ['VITE_R2_ACCOUNT_ID', 'VITE_R2_ACCESS_KEY_ID', 'VITE_R2_SECRET_ACCESS_KEY', 'VITE_R2_BUCKET_NAME']
      .filter((k) => !import.meta.env[k])
    if (missing.length) {
      setError(`Missing env vars: ${missing.join(', ')}. Add them to .env.local`)
      setLoading(false)
      return
    }

    fetchAllRaces()
      .then((data) => { setRaces(data); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [])

  return { races, loading, error }
}

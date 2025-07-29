export const NEXT_PUBLIC_tealbase_URL = process.env.NEXT_PUBLIC_tealbase_URL
export const NEXT_PUBLIC_tealbase_KEY = process.env.NEXT_PUBLIC_tealbase_KEY

export const DEFAULT_AVATARS_BUCKET = 'avatars'

export type Profile = {
  id: string
  avatar_url: string
  username: string
  website: string
  updated_at: string
}

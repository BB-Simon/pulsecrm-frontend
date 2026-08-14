export interface ApiKey {
  id: string
  name: string
  keyPreview: string
  createdById: string
  lastUsedAt: string | null
  revokedAt: string | null
  createdAt: string
}

export interface ApiKeyCreated extends ApiKey {
  key: string
}

export interface ApiKeyInput {
  name: string
}

export type TDomain = {
  domainId?: number
  domain?: string
  createdAt?: string
  expirationProtected?: boolean
  expires?: string
  exposeWhois?: boolean
  holdRegistrar?: boolean
  locked?: boolean
  nameServers?: string[] | null
  privacy?: boolean
  registrarCreatedAt?: string
  renewAuto?: boolean
  renewable?: boolean
  status?: string
  transferProtected?: boolean

  ID?: string
  Name?: string
  User?: string
  Created?: string
  Expires?: string
  IsExpired?: boolean
  IsLocked?: boolean
  AutoRenew?: boolean
  WhoisGuard?: string
  IsPremium?: boolean
  IsOurDNS?: boolean
}

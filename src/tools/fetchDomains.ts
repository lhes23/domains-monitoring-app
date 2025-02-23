import { TDomain } from '@/app/type'

export const fetchGodaddyDomains = async () => {
  const res = await fetch(
    `${process.env.GODADDY_URL}?limit=1000&offset=0&sort=expiration`,
    {
      headers: {
        Authorization: `sso-key ${process.env.GODADDY_API_KEY}:${process.env.GODADDY_API_SECRET}`,
        'Content-Type': 'application/json'
      }
    }
  )

  if (!res.ok)
    return console.error(
      'Failed to fetch domains:',
      res.status,
      await res.text()
    )

  const domains = await res.json()

  const activeDomains = domains
    .filter((domain: TDomain) => domain.status?.toLowerCase() !== 'cancelled')
    .filter(
      (domain: TDomain) => domain.status?.toLowerCase() !== 'expired_reassigned'
    )
    .filter(
      (domain: TDomain) => domain.status?.toLowerCase() !== 'updated_ownership'
    )
  return activeDomains
}

export const fetchNamecheapDomains = async () => {
  const apiUser = process.env.NAMECHEAP_API_USER
  const apiKey = process.env.NAMECHEAP_API_KEY
  const username = process.env.NAMECHEAP_USERNAME
  const clientIp = process.env.NAMECHEAP_CLIENT_IP

  const url = `${process.env.AWS_EC2_PROXY_URL}/namecheap?ApiUser=${apiUser}&ApiKey=${apiKey}&UserName=${username}&ClientIp=${clientIp}`
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })

  if (!res.ok) {
    console.error(`Error fetching page`, res.status, await res.text())
  }
  return res.json()
}

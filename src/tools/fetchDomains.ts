import { TDomain } from '@/app/type'
import { XMLParser } from 'fast-xml-parser'

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

  const sortedDomains = activeDomains.sort((a: TDomain, b: TDomain) => {
    if (!a.expires || !b.expires) return
    return new Date(a.expires).getTime() - new Date(b.expires).getTime()
  })

  return sortedDomains
}

export const fetchNamecheapDomains = async () => {
  const apiUser = process.env.NAMECHEAP_API_USER
  const apiKey = process.env.NAMECHEAP_API_KEY
  const username = process.env.NAMECHEAP_USERNAME
  const clientIp = process.env.NAMECHEAP_CLIENT_IP

  let page = 1
  let allDomains: TDomain[] = []
  let totalPages = 1 // Default to 1, will be updated dynamically

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    textNodeName: 'value'
  })
  while (page <= totalPages) {
    const url = `${process.env.AWS_EC2_PROXY_URL}?ApiUser=${apiUser}&ApiKey=${apiKey}&UserName=${username}&ClientIp=${clientIp}&Command=namecheap.domains.getList&Page=${page}&PageSize=100`

    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/xml' }
    })

    if (!res.ok) {
      console.error(
        `Error fetching page ${page}:`,
        res.status,
        await res.text()
      )
      break
    }

    const xmlText = await res.text()
    const json = parser.parse(xmlText)
    const domains =
      json.ApiResponse.CommandResponse.DomainGetListResult.Domain || []
    allDomains = [...allDomains, ...domains]

    // Update total pages based on the response
    const pagingInfo = json.ApiResponse.CommandResponse.Paging
    const totalItems = parseInt(pagingInfo.TotalItems, 10)
    const pageSize = parseInt(pagingInfo.PageSize, 10)
    totalPages = Math.ceil(totalItems / pageSize)

    console.log(
      `Fetched page ${page} of ${totalPages} - Total domains so far: ${allDomains.length}`
    )

    page++
  }

  return allDomains
}

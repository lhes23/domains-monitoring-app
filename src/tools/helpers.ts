import { TDomain } from '@/app/type'

export const sortDomains = (domains: TDomain[]) => {
  return domains.sort((a: TDomain, b: TDomain) => {
    const dateA = a.expires
      ? new Date(a.expires).getTime()
      : a.Expires
      ? new Date(a.Expires).getTime()
      : 0
    const dateB = b.expires
      ? new Date(b.expires).getTime()
      : b.Expires
      ? new Date(b.Expires).getTime()
      : 0

    return dateA - dateB
  })
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date
    .toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    })
    .replace(',', '')
}

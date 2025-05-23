import {
  fetchGodaddyDomains,
  fetchNamecheapDomains
} from '@/tools/fetchDomains'
import { TDomain } from './type'
import { formatDate, sortDomains } from '@/tools/helpers'

async function saveDomainStatus(domain: string) {
  try {
    const response = await fetch(domain, {
      method: 'HEAD',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error('Failed to save domain status')
    }
    const text = await response.text()

    // Only parse if text is not empty
    const data = text ? JSON.parse(text) : {}
    return data
  } catch (error) {
    console.error('Error saving domain status:', error)
  }
}

export default async function Home() {
  const goDaddyDomains = await fetchGodaddyDomains()
  const namecheapDomains = await fetchNamecheapDomains()
  const sortedDomains = sortDomains([...goDaddyDomains, ...namecheapDomains])

  const status = saveDomainStatus('https://ippei.com')
  console.log(status)

  return (
    <main>
      <div
        className="flex justify-center items-center h-20 bg-slate-300
        text-white text-5xl font-bold"
      >
        <h1>Domains Monitoring App</h1>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-7xl mx-auto">
        <h1 className="m-4 font-bold text-3xl">
          Total Domains : {sortedDomains.length}
        </h1>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Domain Name
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                  Expiration Date
                  <span>
                    <svg
                      className="w-3 h-3 ms-1.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                    </svg>
                  </span>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                  Registrar
                  <span>
                    <svg
                      className="w-3 h-3 ms-1.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                    </svg>
                  </span>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                  Status
                  <span>
                    <svg
                      className="w-3 h-3 ms-1.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                    </svg>
                  </span>
                </div>
              </th>

              {/* <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th> */}
            </tr>
          </thead>
          <tbody>
            {sortedDomains.map((domain: TDomain) => {
              const expirationDate = domain.Expires ?? domain.expires
              if (!expirationDate) return null // Instead of return (which breaks rendering)
              const registrar = domain.status ? 'Godaddy' : 'Namecheap'
              const expires = new Date(expirationDate)
              const textColor = expires < new Date() ? 'text-red-500' : ''

              return (
                <tr
                  key={domain.domainId ?? domain.ID}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                >
                  <td
                    scope="row"
                    className={`px-6 py-4 font-medium whitespace-nowrap ${textColor}`}
                  >
                    {domain.domain ?? domain.Name}
                  </td>
                  <td className={`px-6 py-4 ${textColor}`}>
                    {formatDate(expirationDate)}
                  </td>
                  <td className={`px-6 py-4 ${textColor}`}>{registrar}</td>
                  <td>Status</td>

                  {/* <td className={`px-6 py-4 text-right ${textColor}`}>
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                  </td> */}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </main>
  )
}

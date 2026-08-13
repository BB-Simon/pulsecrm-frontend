export interface SearchContactResult {
  id: string
  firstName: string
  lastName: string
  email: string | null
  companyId: string | null
  companyName: string | null
}

export interface SearchDealResult {
  id: string
  title: string
  value: number
  status: 'OPEN' | 'WON' | 'LOST'
  contactId: string
  contactName: string
  companyId: string | null
  companyName: string | null
}

export interface SearchResults {
  contacts: SearchContactResult[]
  deals: SearchDealResult[]
}

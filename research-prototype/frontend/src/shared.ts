export type Summary = {
  active_members: number
  hired: number
  scholarship_holders: number
  contractors: number
  researchers: number
  former_members: number
}

export type TrendPoint = {
  month: string
  total: number
  hired: number
  scholarship_holders: number
  contractors: number
  researchers: number
}

export type RoleRow = { role: string; is_research: boolean; total: number }

export type Team = {
  name: string
  status: 'active' | 'inactive'
  leader: string | null
  active_members: number
  researchers: number
  active_projects: number
  topics: string[]
}

export type EndingContract = {
  name: string
  role: string
  team: string | null
  contract_type: string
  end_date: string
  days_left: number
}

export const EMPLOYMENT_TYPES = [
  { key: 'hired', label: 'Hired personnel', color: '#2a78d6' },
  { key: 'scholarship_holders', label: 'Scholarship holders', color: '#eb6834' },
  { key: 'contractors', label: 'Contractors', color: '#1baf7a' },
] as const

export function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function percent(part: number, total: number) {
  return total === 0 ? 0 : Math.round((part / total) * 100)
}

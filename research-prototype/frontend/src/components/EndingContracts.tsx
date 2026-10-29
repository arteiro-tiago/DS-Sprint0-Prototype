import { Badge, Card, Table } from 'react-bootstrap'

import { formatDate, type EndingContract } from '../shared'

function badgeColor(daysLeft: number) {
  if (daysLeft <= 30) return 'danger'
  if (daysLeft <= 60) return 'warning'
  return 'secondary'
}

export default function EndingContracts({ contracts }: { contracts: EndingContract[] }) {
  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body>
        <Card.Title>Contracts ending in the next 90 days</Card.Title>

        {contracts.length === 0 ? (
          <p className="text-body-secondary mb-0">No contracts end in the next 90 days.</p>
        ) : (
          <Table hover responsive size="sm" className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Person</th>
                <th>Role</th>
                <th>Team</th>
                <th>Contract</th>
                <th>Ends</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={`${contract.name}-${contract.end_date}`}>
                  <td className="fw-medium">{contract.name}</td>
                  <td>{contract.role}</td>
                  <td>{contract.team ?? '—'}</td>
                  <td>{contract.contract_type}</td>
                  <td className="text-nowrap">
                    {formatDate(contract.end_date)}{' '}
                    <Badge
                      bg={badgeColor(contract.days_left)}
                      text={badgeColor(contract.days_left) === 'warning' ? 'dark' : undefined}
                    >
                      in {contract.days_left} days
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  )
}

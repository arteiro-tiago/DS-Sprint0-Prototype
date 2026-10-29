import { Badge, Card, ProgressBar } from 'react-bootstrap'

import type { RoleRow } from '../shared'

export default function RoleList({ roles }: { roles: RoleRow[] }) {
  const biggest = Math.max(1, ...roles.map((role) => role.total))

  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body>
        <Card.Title>By role</Card.Title>

        {roles.map((role) => (
          <div key={role.role} className="mb-3">
            <div className="d-flex justify-content-between small mb-1">
              <span>
                {role.role}{' '}
                {role.is_research && (
                  <Badge bg="light" text="dark" className="border fw-normal">
                    Research
                  </Badge>
                )}
              </span>
              <strong>{role.total}</strong>
            </div>
            <ProgressBar now={role.total} max={biggest} style={{ height: 6 }} />
          </div>
        ))}
      </Card.Body>
    </Card>
  )
}

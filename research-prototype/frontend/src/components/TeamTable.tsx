import { Badge, Card, Table } from 'react-bootstrap'

import type { Team } from '../shared'

export default function TeamTable({ teams }: { teams: Team[] }) {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <Card.Title>Teams</Card.Title>

        <Table hover responsive className="mb-0 align-middle">
          <thead>
            <tr>
              <th>Team</th>
              <th>Status</th>
              <th>Active members</th>
              <th>Researchers</th>
              <th>Active projects</th>
              <th>Research topics</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.name}>
                <td>
                  <div className="fw-medium">{team.name}</div>
                  <div className="small text-body-secondary">Led by {team.leader ?? '—'}</div>
                </td>
                <td>
                  <Badge bg={team.status === 'active' ? 'success' : 'secondary'}>{team.status}</Badge>
                </td>
                <td className="fw-semibold">{team.active_members}</td>
                <td>{team.researchers}</td>
                <td>{team.active_projects}</td>
                <td>
                  {team.topics.map((topic) => (
                    <Badge key={topic} bg="light" text="dark" className="border fw-normal me-1">
                      {topic}
                    </Badge>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

import { useEffect, useState } from 'react'
import { Alert, Col, Container, Row, Spinner } from 'react-bootstrap'

import CompositionChart from './components/CompositionChart'
import EndingContracts from './components/EndingContracts'
import KpiCards from './components/KpiCards'
import RoleList from './components/RoleList'
import TeamTable from './components/TeamTable'
import TrendChart from './components/TrendChart'
import type { EndingContract, RoleRow, Summary, Team, TrendPoint } from './shared'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function getJson(path: string) {
  const response = await fetch(`${API_URL}/api/workforce${path}`)
  if (!response.ok) throw new Error(`Request to ${path} failed`)
  return response.json()
}

export default function App() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [trend, setTrend] = useState<TrendPoint[]>([])
  const [roles, setRoles] = useState<RoleRow[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [endingSoon, setEndingSoon] = useState<EndingContract[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      getJson('/summary'),
      getJson('/trend'),
      getJson('/roles'),
      getJson('/teams'),
      getJson('/contracts/ending-soon'),
    ])
      .then(([summaryData, trendData, rolesData, teamsData, endingData]) => {
        setSummary(summaryData)
        setTrend(trendData)
        setRoles(rolesData)
        setTeams(teamsData)
        setEndingSoon(endingData)
      })
      .catch(() => setError('Could not load the data. Check that the database and the workforce-service are running.'))
  }, [])

  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="min-vh-100 bg-body-tertiary">
      <Container className="py-4 py-md-5">
        <header className="mb-4">
          <h1 className="h3 fw-bold mb-1">HumanISE.info</h1>
          <p className="text-body-secondary mb-0">High-level people metrics — {today}</p>
        </header>

        {error && <Alert variant="danger">{error}</Alert>}

        {!summary && !error && <Spinner animation="border" role="status" />}

        {summary && trend.length > 0 && (
          <>
            <KpiCards summary={summary} firstMonth={trend[0]} />

            <Row className="g-3 mt-1">
              <Col lg={5}>
                <CompositionChart summary={summary} />
              </Col>
              <Col lg={7}>
                <TrendChart points={trend} />
              </Col>
            </Row>

            <Row className="g-3 mt-1">
              <Col lg={8}>
                <EndingContracts contracts={endingSoon} />
              </Col>
              <Col lg={4}>
                <RoleList roles={roles} />
              </Col>
            </Row>

            <div className="mt-3">
              <TeamTable teams={teams} />
            </div>
          </>
        )}
      </Container>
    </div>
  )
}

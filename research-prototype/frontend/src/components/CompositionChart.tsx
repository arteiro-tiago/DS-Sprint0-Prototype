import { Card, Col, Row } from 'react-bootstrap'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { EMPLOYMENT_TYPES, percent, type Summary } from '../shared'

export default function CompositionChart({ summary }: { summary: Summary }) {
  const data = EMPLOYMENT_TYPES.map((type) => ({
    name: type.label,
    value: summary[type.key],
    color: type.color,
  }))

  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body>
        <Card.Title>Workforce composition</Card.Title>
        <Card.Text className="small text-body-secondary">Active members by type of contract.</Card.Text>

        <Row className="align-items-center">
          <Col sm={6} className="position-relative" style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="62%"
                  outerRadius="95%"
                  stroke="#ffffff"
                  strokeWidth={2}
                  isAnimationActive={false}
                >
                  {data.map((slice) => (
                    <Cell key={slice.name} fill={slice.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="position-absolute top-50 start-50 translate-middle text-center">
              <div className="kpi-value">{summary.active_members}</div>
              <div className="small text-body-secondary">members</div>
            </div>
          </Col>

          <Col sm={6}>
            <ul className="list-unstyled mb-0">
              {data.map((slice) => (
                <li key={slice.name} className="d-flex align-items-center gap-2 py-2 border-bottom">
                  <span className="color-dot" style={{ backgroundColor: slice.color }} />
                  <span className="flex-grow-1">{slice.name}</span>
                  <strong>{slice.value}</strong>
                  <span className="text-body-secondary small" style={{ width: 40, textAlign: 'right' }}>
                    {percent(slice.value, summary.active_members)}%
                  </span>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

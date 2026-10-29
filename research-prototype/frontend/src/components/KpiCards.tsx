import { Card, Col, Row } from 'react-bootstrap'

import { percent, type Summary, type TrendPoint } from '../shared'

export default function KpiCards({ summary, firstMonth }: { summary: Summary; firstMonth: TrendPoint }) {
  const cards = [
    {
      title: 'Active members',
      value: summary.active_members,
      before: firstMonth.total,
      note: `${summary.former_members} former members`,
    },
    {
      title: 'Hired personnel',
      value: summary.hired,
      before: firstMonth.hired,
      note: `${percent(summary.hired, summary.active_members)}% of active members`,
    },
    {
      title: 'Active researchers',
      value: summary.researchers,
      before: firstMonth.researchers,
      note: `${percent(summary.researchers, summary.active_members)}% of active members`,
    },
    {
      title: 'Contractors',
      value: summary.contractors,
      before: firstMonth.contractors,
      note: `${percent(summary.contractors, summary.active_members)}% of active members`,
    },
  ]

  return (
    <Row xs={1} sm={2} lg={4} className="g-3">
      {cards.map((card) => {
        const change = card.value - card.before

        return (
          <Col key={card.title}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <Card.Subtitle className="mb-2 text-body-secondary">{card.title}</Card.Subtitle>
                <div className="kpi-value">{card.value}</div>
                <div className="small text-body-secondary mt-2">{card.note}</div>
                <div className="small text-body-secondary">
                  {change > 0 && `▲ ${change} since ${firstMonth.month}`}
                  {change < 0 && `▼ ${-change} since ${firstMonth.month}`}
                  {change === 0 && `No change since ${firstMonth.month}`}
                </div>
              </Card.Body>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

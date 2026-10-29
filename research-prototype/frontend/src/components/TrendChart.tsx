import { Card } from 'react-bootstrap'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { EMPLOYMENT_TYPES, type TrendPoint } from '../shared'

export default function TrendChart({ points }: { points: TrendPoint[] }) {
  const lastIndex = EMPLOYMENT_TYPES.length - 1

  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body>
        <Card.Title>Headcount over the last 12 months</Card.Title>
        <Card.Text className="small text-body-secondary">
          People with a contract on the 1st of each month (the last bar is today).
        </Card.Text>

        <div className="d-flex flex-wrap gap-3 small mb-2">
          {EMPLOYMENT_TYPES.map((type) => (
            <span key={type.key} className="d-flex align-items-center gap-2">
              <span className="color-dot" style={{ backgroundColor: type.color }} />
              {type.label}
            </span>
          ))}
        </div>

        <div style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid vertical={false} stroke="#e9ecef" />
              <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 12, fill: '#6c757d' }} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6c757d' }} />
              <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }} />
              {EMPLOYMENT_TYPES.map((type, index) => (
                <Bar
                  key={type.key}
                  dataKey={type.key}
                  name={type.label}
                  stackId="people"
                  fill={type.color}
                  stroke="#ffffff"
                  strokeWidth={1}
                  maxBarSize={28}
                  radius={index === lastIndex ? [4, 4, 0, 0] : 0}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card.Body>
    </Card>
  )
}

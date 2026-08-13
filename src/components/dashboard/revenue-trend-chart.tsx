import { useState } from 'react'
import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/format'
import type { RevenueTrendPoint } from '@/types/dashboard'

function formatMonth(month: string): string {
  const [year, monthNum] = month.split('-').map(Number)
  return new Date(year, monthNum - 1, 1).toLocaleDateString('en-US', {
    month: 'short',
  })
}

function ChartTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null
  const datum = payload[0].payload as RevenueTrendPoint

  return (
    <div className="rounded-md border border-mist bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-mono text-xs tracking-wide text-ink/50 uppercase">
        {formatMonth(datum.month)}
      </p>
      <p className="mt-1 font-mono text-base text-ink">
        {formatCurrency(datum.revenue)}
      </p>
    </div>
  )
}

export function RevenueTrendChart({ data }: { data: RevenueTrendPoint[] }) {
  const [showTable, setShowTable] = useState(false)

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-heading text-lg text-ink">Revenue trend</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-ink/50"
          onClick={() => setShowTable((v) => !v)}
        >
          {showTable ? 'View chart' : 'View table'}
        </Button>
      </div>

      {showTable ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.month}>
                <TableCell>{formatMonth(row.month)}</TableCell>
                <TableCell className="font-mono">
                  {formatCurrency(row.revenue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart
            data={data}
            margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--mist)"
              strokeDasharray="0"
            />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              tickLine={false}
              axisLine={{ stroke: 'var(--mist)' }}
              tick={{
                fill: 'var(--ink)',
                fillOpacity: 0.6,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={64}
              tick={{
                fill: 'var(--ink)',
                fillOpacity: 0.4,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
              }}
              tickFormatter={(value: number) => formatCurrency(value)}
            />
            <Tooltip
              content={ChartTooltip}
              cursor={{ stroke: 'var(--ochre)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--ledger)"
              strokeWidth={2}
              fill="var(--ledger)"
              fillOpacity={0.1}
              dot={{
                r: 4,
                fill: 'var(--ledger)',
                stroke: 'var(--card)',
                strokeWidth: 2,
              }}
              activeDot={{
                r: 5,
                fill: 'var(--ledger)',
                stroke: 'var(--card)',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

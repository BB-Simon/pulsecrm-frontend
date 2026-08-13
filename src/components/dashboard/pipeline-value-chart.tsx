import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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

export interface PipelineChartDatum {
  stageName: string
  dealCount: number
  totalValue: number
  isWon: boolean
  isLost: boolean
}

function barColor(datum: PipelineChartDatum): string {
  if (datum.isWon) return 'var(--ledger)'
  if (datum.isLost) return 'var(--brick)'
  return 'var(--chart-pipeline-open)'
}

function ChartTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null
  const datum = payload[0].payload as PipelineChartDatum

  return (
    <div className="rounded-md border border-mist bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-mono text-xs tracking-wide text-ink/50 uppercase">
        {datum.stageName}
      </p>
      <p className="mt-1 font-mono text-base text-ink">
        {formatCurrency(datum.totalValue)}
      </p>
      <p className="text-xs text-ink/50">
        {datum.dealCount} {datum.dealCount === 1 ? 'deal' : 'deals'}
      </p>
    </div>
  )
}

export function PipelineValueChart({ data }: { data: PipelineChartDatum[] }) {
  const [showTable, setShowTable] = useState(false)

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-heading text-lg text-ink">
          Pipeline value by stage
        </h2>
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
              <TableHead>Stage</TableHead>
              <TableHead>Deals</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.stageName}>
                <TableCell>{row.stageName}</TableCell>
                <TableCell className="font-mono">{row.dealCount}</TableCell>
                <TableCell className="font-mono">
                  {formatCurrency(row.totalValue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--mist)"
              strokeDasharray="0"
            />
            <XAxis
              dataKey="stageName"
              tickLine={false}
              axisLine={{ stroke: 'var(--mist)' }}
              tick={{
                fill: 'var(--ink)',
                fillOpacity: 0.6,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
              }}
              tickFormatter={(value: string) => value.toUpperCase()}
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
              cursor={{ fill: 'var(--mist)', fillOpacity: 0.4 }}
            />
            <Bar dataKey="totalValue" maxBarSize={24} radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.stageName} fill={barColor(entry)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

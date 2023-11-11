import { Chart as Chartjs, registerables } from 'chart.js/auto'
import { useState } from 'react'
import { Chart } from "react-chartjs-2"
import { useStore } from "../../store"
import { calculateLinkItemTotals } from '../../store/selectors/item'
import s from './itemSummaryCharts.module.css'
Chartjs.register(...registerables)

type ChartTypes = 'unitPrice' | 'dispensingFee' | 'markupPercentage'
export default function ItemSummaryCharts({ itemKeys }: { itemKeys: ItemKey[] }) {
  const catalogs = useStore(state => state.catalog)!
  const calc = calculateLinkItemTotals(itemKeys, catalogs)
  const [chartType, setActiveChart] = useState<ChartTypes>('unitPrice')

  if (itemKeys.length === 0 ||
    !(calc.avgDispensingFee ||
      calc.avgUnitPrice ||
      calc.avgMarkupPercentage)) return null

  let units: number[] = []
  let average = 0
  let min = 0
  let max = 0

  if (chartType === 'unitPrice') {
    units = calc.unitPrices
    average = calc.avgUnitPrice
    min = calc.minUnitPrice
    max = calc.maxUnitPrice
  }

  if (chartType === 'dispensingFee') {
    units = calc.dispensingFees
    average = calc.avgDispensingFee
    min = calc.minDispensingFee
    max = calc.maxDispensingFee
  }

  if (chartType === 'markupPercentage') {
    units = calc.markupPercentages
    average = calc.avgMarkupPercentage
    min = calc.minMarkupPercentage
    max = calc.maxMarkupPercentage
  }

  return (
    <div className={s.container}>
      <div className={s.chartTypeSelector}>
        <button
          className={`${s.chartTypeButton} ${chartType === 'unitPrice' ? s.active : ''}`}
          onClick={() => setActiveChart('unitPrice')}
        >
          Unit Price
        </button>
        <button
          className={`${s.chartTypeButton} ${chartType === 'dispensingFee' ? s.active : ''}`}
          onClick={() => setActiveChart('dispensingFee')}
        >
          Dispensing Fee
        </button>
        <button
          className={`${s.chartTypeButton} ${chartType === 'markupPercentage' ? s.active : ''}`}
          onClick={() => setActiveChart('markupPercentage')}
        >
          Markup Percentage
        </button>
      </div>
      <CostChart
        officeIds={calc.officeIds}
        units={units}
        average={average}
        min={min}
        max={max} />
    </div>
  )

}

type ChartProps = {
  officeIds: string[],
  units: number[],
  average: number,
  min: number,
  max: number
}

function CostChart({ officeIds, units, average, min, max }: ChartProps) {
  return (
    <>
      <div className={s.chart}>
        <Chart type='bar'
          height={100}
          options={{


          }}
          data={{
            labels: officeIds,
            datasets: [
              {
                label: 'Value',
                type: 'bar',
                data: units,
                borderColor: 'rgba(0, 255, 255, 0.5)',
                backgroundColor: 'rgba(0, 255, 255, 0.5)'
              },
              {
                label: 'Average',
                type: 'line',
                data: officeIds.map(() => average),
                borderColor: '#00FF00',
                backgroundColor: '#00FF00'
              },
              {
                label: 'Max',
                type: 'line',
                data: officeIds.map(() => max),
                borderColor: '#FFFF00',
                backgroundColor: '#FFFF00'
              },
              {
                label: 'Min',
                type: 'line',
                data: officeIds.map(() => min),
                backgroundColor: '#FF00FF',
                borderColor: '#FF00FF'
              }
            ]
          }} />
      </div>
    </>
  )
} 
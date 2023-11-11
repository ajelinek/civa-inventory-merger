import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { FaCaretDown, FaCaretRight } from 'react-icons/fa6'
import { RxDividerVertical } from 'react-icons/rx'
import { Link } from 'react-router-dom'
import { useCatalogItem, useStore } from '../../store'
import { calculateLinkItemTotals } from '../../store/selectors/item'
import ItemSummaryCharts from '../ItemSummaryCharts'
import Money from '../Money'
import { OfficeIdsDisplay } from '../OfficeIdDisplay'
import s from './itemSummary.module.css'

export default function ItemSummary({ itemKey, selector }: { itemKey: ItemKey, selector: Selector<ItemKey> }) {
  const item = useCatalogItem(itemKey)
  const [active, setActive] = useState(false)
  if (!item) return null

  function ClassificationDisplay() {
    return (
      <>
        {item?.subClassificationName
          ? <p className={s.subTitle}>C -{item.classificationName}
            <RxDividerVertical className={s.divider} />  SC - {item.subClassificationName}
          </p>
          : <p className={s.subTitle}>C - {item?.classificationName}</p>}
      </>
    )
  }

  return (
    <div className={s.container} >
      <div className={s.summary}>
        <input type='checkbox'
          onChange={(e) => selector.onSelect(e, itemKey)}
          checked={selector.isSelected(itemKey)}
        />

        <div className={s.summaryContent} >
          <div className={s.summaryTitle} >
            <Link className={`${s.title} ${item.status === 'inactive' ? s.inactiveTitle : ''}`}
              to={`/item/${itemKey.recordId}/${itemKey.officeId}`}>
              <span className={s.id}>{item.officeId}-{item.itemId}</span> - {item.itemDescription}
            </Link>
            {item.officeId === 'CIVA' && <><OfficeIdList item={item} /></>}
          </div>
          <div className={s.secondaryInfo}>
            <ClassificationDisplay />
            {item.officeId === 'CIVA'
              ? <MasterCostingInfo item={item} />
              : <OfficeCostingInfo item={item} />
            }
          </div>
        </div>
        <button className={s.hideShowButton} onClick={() => setActive(!active)}>
          {active ? <FaCaretDown /> : <FaCaretRight />}
        </button>
      </div>

      {active &&
        <div className={s.itemDetails}>
          <ItemAttributes item={item} />
          <div className={s.chartArea}>

            {(item.linkedItems?.length && item.linkedItems.length > 0) &&
              <ItemSummaryCharts itemKeys={item.linkedItems} />}
          </div>
        </div>
      }
    </div>
  )

}

function ItemAttributes({ item }: { item: ItemRecord }) {
  return (
    <div>
      <p className={s.attribute}>
        <span className={s.label}>Definition:</span> {item.definition}
      </p>
      <p className={s.attribute}>
        <span className={s.label}>Item Type:</span> {item.itemType}
      </p>
      <p className={s.attribute}>
        <span className={s.label}>Item Type Description:</span> {item.itemTypeDescription}
      </p>
      <p className={s.attribute}>
        <span className={s.label}>Unit Price:</span> <Money>{item.unitPrice}</Money>
      </p>
      <p className={s.attribute}>
        <span className={s.label}>Dispensing Fee:</span> <Money>{item.dispensingFee}</Money>
      </p>
      <p className={s.attribute}>
        <span className={s.label}>Minimum Price:</span> <Money>{item.minimumPrice}</Money>
      </p>
      <p className={s.attribute}>
        <span className={s.label}>Mark Up Percentage:</span> {item.markUpPercentage?.toFixed(1)}%
      </p>
      <p className={s.attribute}>
        <span className={s.label}>Status:</span> {item.status ? item.status : 'active'}
      </p>
      <p className={s.attribute}>
        <span className={s.label}>Mapped:
        </span> {item.classificationMappedTimestamp && dayjs(item.classificationMappedTimestamp).format('ddd, MMM D, YYYY h:mm A')
        }
      </p>
      <p className={s.attribute}>
        <span className={s.label}>Linked:
        </span> {item.itemLinkedTimestamp && dayjs(item.itemLinkedTimestamp).format('ddd, MMM D, YYYY h:mm A')
        }
      </p>
      <p className={s.attribute}>
        <span className={s.label}>Original Item ID:</span> {item.originalItemId}
      </p>
      <p className={s.attribute}>
        <span className={s.label}>Last Update:</span> {dayjs(item.lastUpdateTimestamp).format('ddd, MMM D, YYYY h:mm A')}
      </p>
      <p className={s.attribute}>
        <span className={s.label}>Database Record ID:</span> {item.recordId}
      </p>
    </div>

  )
}

function MasterCostingInfo({ item }: { item: ItemRecord }) {
  const catalogs = useStore(state => state.catalog)!
  const costs = useMemo(() => calculateLinkItemTotals(item.linkedItems || [], catalogs), [item])

  return (
    <div className={s.costInfo}>
      <div className={s.costItem}>
        {costs.avgDispensingFee ? <>
          <span className={s.costLabel}>DF:</span>
          <div className={s.fieldSet}>
            <span className={s.costLabel}>&mu;</span>
            <span className={s.moneyValue}><Money>{costs.avgDispensingFee}</Money></span>
          </div>
          <div className={s.fieldSet}>
            <span className={s.costLabel}>&sigma;<sub>^2</sub></span>
            <span className={s.moneyValue}>{costs.dispensingFeeVariance.toFixed(1)}%</span>
          </div>
        </> : null}
      </div>
      <div className={s.costItem}>
        {costs.avgUnitPrice ? <>
          <span className={s.cotLabel}>UP:</span>
          <div className={s.fieldSet}>
            <span className={s.costLabel}>&mu;</span>
            <span className={s.moneyValue}><Money>{costs.avgUnitPrice}</Money></span>
          </div>
          <div className={s.fieldSet}>
            <span className={s.costLabel}>&sigma;<sub>^2</sub></span>
            <span className={s.moneyValue}>{costs.unitPriceVariance.toFixed(1)}%</span>
          </div>
        </> : null}
      </div>
      <div className={s.costItem}>
        {costs.avgUnitPrice ? <>
          <div className={s.fieldSet}>
            <span className={s.costLabel}>MU:</span>
            <span className={s.moneyValue}>{costs.avgMarkupPercentage.toFixed(1)}%</span>
          </div>
        </> : null}
      </div>
    </div>
  )
}

function OfficeCostingInfo({ item }: { item: ItemRecord }) {
  return (
    <div className={s.costInfo}>
      <p className={s.costItem}>
        {item.dispensingFee ? <>
          <span className={s.costLabel}>DF:</span>
          <span className={s.moneyValue}><Money>{item.dispensingFee}</Money></span>
        </> : null}
      </p>   <p className={s.costItem}>
        {item.unitPrice ? <>
          <span className={s.costLabel}>UP:</span>
          <span className={s.moneyValue}><Money>{item.unitPrice}</Money></span>
        </> : null}
      </p>
      <p className={s.costItem}>
        {item.unitPrice ? <>
          <span className={s.costLabel}>MU:</span>
          <span className={s.moneyValue}>{item.markUpPercentage?.toFixed(1)}%</span>
        </> : null}
      </p>
    </div>
  )
}

function OfficeIdList({ item }: { item: ItemRecord }) {
  const officeIds = item.linkedItems?.map(linkedItem => linkedItem.officeId) || []
  return <OfficeIdsDisplay officeIds={officeIds} />
}
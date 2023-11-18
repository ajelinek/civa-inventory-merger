import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { FaCaretDown, FaCaretRight } from 'react-icons/fa6'
import { RxDividerVertical } from 'react-icons/rx'
import { Link } from 'react-router-dom'
import { useCatalogItem, useMarkedProcessed, useStore } from '../../store'
import { calculateLinkItemTotals } from '../../store/selectors/item'
import ItemSummaryCharts from '../ItemSummaryCharts'
import ItemTitle from '../ItemTitle'
import Money from '../Money'
import s from './itemSummary.module.css'

export default function ItemSummary({ itemKey, selector, expandAll }: { itemKey: ItemKey, selector: Selector<ItemKey>, expandAll?: boolean }) {
  const item = useCatalogItem(itemKey)
  const [active, setActive] = useState(expandAll)
  useEffect(() => { setActive(expandAll) }, [expandAll])

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
          <ItemTitle itemKey={itemKey} s={s} />
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
            {(item.officeId === 'CIVA' && item.linkedItems?.length && item.linkedItems.length > 0) &&
              <ItemSummaryCharts itemKeys={item.linkedItems} />}
          </div>
        </div>
      }
    </div>
  )

}

function ItemAttributes({ item }: { item: ItemRecord }) {
  const linkedItem = useCatalogItem(item.itemLinkedTo)
  const markProcessed = useMarkedProcessed()

  return (
    <div>
      <div className={s.attribute}>
        <span className={s.label}>Item Id:</span>
        <p className={s.valueGroup}>
          <span className={s.value}>{item.itemId}</span>
          {linkedItem && item.itemId !== linkedItem.itemId && <span className={s.linkedValue}>{linkedItem?.itemId}</span>}
        </p>
      </div>
      <div className={s.attribute}>
        <span className={s.label}>Description:</span>
        <p className={s.valueGroup}>
          <span className={s.value}>{item.itemDescription}</span>
          {linkedItem && item.itemDescription !== linkedItem.itemDescription && <span className={s.linkedValue}>{linkedItem?.itemDescription}</span>}
        </p>
      </div>
      {/* ... other attributes ... */}
      <div className={s.attribute}>
        <span className={s.label}>Classification:</span>
        <p className={s.valueGroup}>
          <span className={s.value}>{item.classificationId} - {item.classificationName}</span>
          {linkedItem && (item.classificationId !== linkedItem.classificationId || item.classificationName !== linkedItem.classificationName) && <span className={s.linkedValue}>{linkedItem.classificationId} - {linkedItem.classificationName}</span>}
        </p>
      </div>
      <div className={s.attribute}>
        <span className={s.label}>Sub Classification:</span>
        <p className={s.valueGroup}>
          <span className={s.value}>{item.subClassificationId} - {item.subClassificationName}</span>
          {linkedItem && (item.subClassificationId !== linkedItem.subClassificationId || item.subClassificationName !== linkedItem.subClassificationName) && <span className={s.linkedValue}>{linkedItem.subClassificationId} - {linkedItem.subClassificationName}</span>}
        </p>
      </div>
      <div className={s.attribute}>
        <span className={s.label}>Item Type:</span>
        <p className={s.valueGroup}>
          <span className={s.value}>{item.itemType}</span>
          {linkedItem && item.itemType !== linkedItem.itemType && <span className={s.linkedValue}>{linkedItem.itemType}</span>}
        </p>
      </div>
      <div className={s.attribute}>
        <span className={s.label}>Item Type Description:</span>
        <p className={s.valueGroup}>
          <span className={s.value}>{item.itemTypeDescription}</span>
          {linkedItem && item.itemTypeDescription !== linkedItem.itemTypeDescription && <span className={s.linkedValue}>{linkedItem.itemTypeDescription}</span>}
        </p>
      </div>
      <div className={s.attribute}>
        <span className={s.label}>Unit Price:</span>
        <p className={s.valueGroup}>
          <span className={s.value}><Money>{item.unitPrice}</Money></span>
          {linkedItem && item.unitPrice !== linkedItem.unitPrice && <span className={s.linkedValue}><Money>{linkedItem?.unitPrice}</Money></span>}
        </p>
      </div>
      <div className={s.attribute}>
        <span className={s.label}>Dispensing Fee:</span>
        <p className={s.valueGroup}>
          <span className={s.value}><Money>{item.dispensingFee}</Money></span>
          {linkedItem && item.dispensingFee !== linkedItem.dispensingFee && <span className={s.linkedValue}><Money>{linkedItem?.dispensingFee}</Money></span>}
        </p>
      </div>
      <div className={s.attribute}>
        <span className={s.label}>Mark Up Percentage:</span>
        <p className={s.valueGroup}>
          <span className={s.value}>{item.markUpPercentage?.toFixed(1)}%</span>
          {linkedItem?.markUpPercentage && item.markUpPercentage !== linkedItem.markUpPercentage && <span className={s.linkedValue}>{linkedItem?.markUpPercentage?.toFixed(1)}%</span>}
        </p>
      </div>
      <div className={s.attribute}>
        <span className={s.label}>Status:</span>
        <p className={s.valueGroup}>
          <span className={s.value}>{item.status ? item.status : 'active'}</span>
          {linkedItem && item.status && item.status !== linkedItem.status && <span className={s.linkedValue}>{linkedItem.status ? linkedItem.status : 'active'}</span>}
        </p>
      </div>
      <div className={s.attribute}>
        <span className={s.label}>Mapped:
        </span> {item.classificationMappedTimestamp && dayjs(item.classificationMappedTimestamp).format('ddd, MMM D, YYYY h:mm A')
        }
      </div>
      <div className={s.attribute}>
        <span className={s.label}>Linked To:
        </span> <Link to={`/item/${item.itemLinkedTo?.recordId}/${item.itemLinkedTo?.officeId}`}>{item.itemLinkedTo?.recordId}</Link>
      </div>
      <div className={s.attribute}>
        <span className={s.label}>Last Update:</span> {item.lastUpdateTimestamp && dayjs(item.lastUpdateTimestamp).format('ddd, MMM D, YYYY h:mm A')}
      </div>
      <div className={s.attribute}>
        <span className={s.label}>Marked Processed:</span> {item.processed && dayjs(item.processed).format('ddd, MMM D, YYYY h:mm A')}
      </div>
      <div className={s.attribute}>
        <span className={s.label}>Database Record ID:</span> {item.recordId}
      </div>
      {(item.officeId !== 'CIVA' &&
        <button className={s.processedButton}
          onClick={() => markProcessed.execute({ recordId: item.recordId, officeId: item.officeId })}
          aria-busy={markProcessed.loading}>
          Mark Processed
        </button>)}
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
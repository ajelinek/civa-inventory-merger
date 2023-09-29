import dayjs from 'dayjs'
import { useState } from 'react'
import { FaCaretDown, FaCaretRight } from 'react-icons/fa6'
import { RxDividerVertical } from 'react-icons/rx'
import { useNavigate } from 'react-router-dom'
import { useCatalogItem } from '../../store'
import Money from '../Money'
import s from './itemSummary.module.css'

export default function ItemSummary({ itemKey, selector }: { itemKey: ItemKey, selector: Selector<ItemKey> }) {
  const item = useCatalogItem(itemKey)
  const nav = useNavigate()
  const [active, setActive] = useState(false)
  if (!item) return null

  return (
    <div className={s.container} >
      <div className={s.summary}>
        <div>
          <input type='checkbox'
            onChange={(e) => selector.onSelect(e, itemKey)}
            checked={selector.isSelected(itemKey)}
          />
        </div>
        <div className={s.summaryContent} >
          <div className={s.summaryTitle} onClick={() => nav(`/item/${itemKey.recordId}/${itemKey.officeId}`)}>
            <p className={s.title}><span className={s.id}>{item.officeId}-{item.itemId}</span> - {item.itemDescription} </p>
            {item.subClassificationName
              ? <p className={s.subTitle}>C -{item.classificationName}
                <RxDividerVertical className={s.divider} />  SC - {item.subClassificationName}
              </p>
              : <p className={s.subTitle}>C - {item.classificationName}</p>}
          </div>
          <div className={s.costInfo}>
            <p className={s.costItem}>
              {item.unitPrice ? <>
                <span className={s.label}>UP:</span>
                <span className={s.moneyValue}><Money>{item.unitPrice}</Money></span>
              </> : null}
            </p>
            <p className={s.costItem}>
              {item.unitPrice ? <>
                <span className={s.label}>MU:</span>
                <span className={s.moneyValue}>{item.markUpPercentage}%</span>
              </> : null}
            </p>
            <p className={s.costItem}>
              {item.dispensingFee ? <>
                <span className={s.label}>DF:</span>
                <span className={s.moneyValue}><Money>{item.dispensingFee}</Money></span>
              </> : null}
            </p>
          </div>
          <button className={s.hideShowButton}
            onClick={() => setActive(!active)}>
            {active ? <FaCaretDown /> : <FaCaretRight />}
          </button>
        </div>
      </div>

      {active &&
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
            <span className={s.label}>Mark Up Percentage:</span> <Money>{item.markUpPercentage}</Money>
          </p>
          <p className={s.attribute}>
            <span className={s.label}>Mapped:
            </span> {item.classificationMappedTimestamp && dayjs(item.classificationMappedTimestamp).format('ddd, MMM D, YYYY h:mm A')
            }
          </p>
          <p className={s.attribute}>
            <span className={s.label}>Original Item ID:</span> {item.originalItemId}
          </p>
          <p className={s.attribute}>
            <span className={s.label}>Database Record ID:</span> {item.recordId}
          </p>
        </div>
      }
    </div>
  )
}
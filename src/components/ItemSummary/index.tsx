import { useState } from 'react'
import { useStore } from '../../store'
import s from './itemSummary.module.css'
import Money from '../Money'
import { FaCaretDown, FaCaretRight } from 'react-icons/fa6'
import { RxDividerVertical } from 'react-icons/rx'
import dayjs from 'dayjs'

export default function ItemSummary({ itemId, selector }: { itemId: string, selector: Selector<ItemRecord> }) {
  const [active, setActive] = useState(false)
  const itemRecord = useStore(state => state.catalog[itemId])

  if (!itemRecord) {
    return <div>Item not found</div>
  }

  return (
    <div className={s.container} >
      <div className={s.summary}>
        <div>
          <input type='checkbox'
            onChange={(e) => selector.onSelect(e, itemRecord)}
            checked={selector.isSelected(itemRecord)}
          />
        </div>
        <div className={s.summaryContent} onClick={() => setActive(!active)}>
          <div  >
            <p className={s.title}><span className={s.id}>{itemRecord.itemId}</span> - {itemRecord.itemDescription} </p>
            <p className={s.subTitle}>C -{itemRecord.classificationName} <RxDividerVertical className={s.divider} />  SC - {itemRecord.subClassificationName}</p>
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
            <span className={s.label}>Definition:</span> {itemRecord.definition}
          </p>
          <p className={s.attribute}>
            <span className={s.label}>Item Type:</span> {itemRecord.itemType}
          </p>
          <p className={s.attribute}>
            <span className={s.label}>Item Type Description:</span> {itemRecord.itemTypeDescription}
          </p>
          <p className={s.attribute}>
            <span className={s.label}>Unit Price:</span> <Money>{itemRecord.unitPrice}</Money>
          </p>
          <p className={s.attribute}>
            <span className={s.label}>Dispensing Fee:</span> <Money>{itemRecord.dispensingFee}</Money>
          </p>
          <p className={s.attribute}>
            <span className={s.label}>Minimum Price:</span> <Money>{itemRecord.minimumPrice}</Money>
          </p>
          <p className={s.attribute}>
            <span className={s.label}>Mark Up Percentage:</span> <Money>{itemRecord.markUpPercentage}</Money>
          </p>
          <p className={s.attribute}>
            <span className={s.label}>Mapped:</span> {dayjs(itemRecord.mapped).format()}
          </p>
        </div>
      }
    </div>
  )
}
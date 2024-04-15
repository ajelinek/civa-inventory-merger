import { RxDividerVertical } from 'react-icons/rx'
import s from './unMatchedDisplay.module.css'

type props = {
  officeIds: OfficeId[]
  label?: string
}
export function OfficeIdsDisplay({ officeIds, label }: props) {

  return (
    <div className={s.unmatched}>
      {label && <label className={s.notFoundOfficeLabel}>{label}</label>}
      {officeIds.map((officeId, index) =>
        <span key={officeId + index} className={s.officeList}>
          <span className={s.officeId}>{officeId}</span>
          {index < officeIds.length - 1 && <RxDividerVertical className={s.divider} />}
        </span>
      )}
    </div>
  )
}

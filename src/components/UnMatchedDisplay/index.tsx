import { RxDividerVertical } from 'react-icons/rx'
import s from './unMatchedDisplay.module.css'

type props = {
  unMatchedOfficeIds: OfficeId[]
}
export function UnMatchedDisplay({ unMatchedOfficeIds }: props) {

  return (
    <div className={s.unmatched}>
      <label className={s.notFoundOfficeLabel}>Unmatched Offices: </label>
      {unMatchedOfficeIds.map((officeId, index) =>
        <span key={officeId} className={s.officeList}>
          <span className={s.officeId}>{officeId}</span>
          {index < unMatchedOfficeIds.length - 1 && <RxDividerVertical className={s.divider} />}
        </span>
      )}
    </div>
  )
}

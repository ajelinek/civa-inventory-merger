import { sort } from "fast-sort"
import { useSearchParamsListToggle } from "../../hooks/searchParams"
import { useStore } from "../../store"
import s from './catalogFacetSearch.module.css'


export default function FacetedSearch() {
  const classifications = useStore(state => state.org?.classifications)!
  const offices = useStore(state => state.org?.offices)!
  const officeParams = useSearchParamsListToggle('o')
  const classificationParams = useSearchParamsListToggle('c')
  const subClassificationParams = useSearchParamsListToggle('sc')


  return (
    <div className={s.container}>
      <div className={s.offices}>
        <h3>Offices</h3>
        {sort(Object.entries(offices)).asc(o => o[1].name).map(([key, value]) => (
          <div key={key}>
            <input
              id={key}
              aria-labelledby={key}
              type="checkbox"
              checked={officeParams.isSelected(key)}
              onChange={() => officeParams.toggle(key)}
            />
            <label htmlFor={key}>{value.name}</label>
          </div>
        ))}
      </div>

      <div className={s.classifications}>
        <h3>Classifications</h3>
        {sort(Object.entries(classifications)).asc(c => c[1].name).map(([key, value]) => (
          <div className={s.classificationSet} key={key}>
            <input
              id={key}
              aria-labelledby={key}
              type="checkbox"
              checked={classificationParams.isSelected(key)}
              onChange={() => classificationParams.toggle(key)}
            />
            <label htmlFor={key}>{value.name}</label>
            <div className={s.subClassificationSection}>
              {sort(Object.entries(classifications[key]?.subClassifications || {})).asc(cs => cs[1]?.name).map(([subKey, subValue]) => (
                <div key={subKey}>
                  <input
                    id={subKey}
                    aria-labelledby={subKey}
                    type="checkbox"
                    checked={subClassificationParams.isSelected(subKey)}
                    onChange={() => {
                      subClassificationParams.toggle(subKey)
                    }}
                  />
                  <label htmlFor={subKey}>{subValue.name}</label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

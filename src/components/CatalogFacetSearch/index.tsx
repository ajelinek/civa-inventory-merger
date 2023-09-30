import { sort } from "fast-sort"
import { useEffect } from "react"
import { useSearchParam, useSearchParamsListToggle } from "../../hooks/searchParams"
import { useStore } from "../../store"
import s from './catalogFacetSearch.module.css'


export default function FacetedSearch() {
  const classifications = useStore(state => state.org?.classifications)!

  return (
    <div className={s.container}>
      <div className={s.offices}>
        <h3>Offices</h3>
        <OfficeFacet />
      </div>

      <div className={s.classifications}>
        <h3>Classifications</h3>
        {sort(Object.entries(classifications)).asc(c => c[1].name).map(([classificationKey, value]) =>
          <ClassificationFacet key={classificationKey} classification={classificationKey} value={value} />
        )}
      </div>

      <div className={s.business}>
        <h3>Business</h3>
        <BusinessFacet />

      </div>
    </div>
  )
}

function BusinessFacet() {
  const unitPriceLow = useSearchParam('upl')
  const unitPriceHigh = useSearchParam('uph')
  const dispensingFeeLow = useSearchParam('dfl')
  const dispensingFeeHigh = useSearchParam('dfh')
  const markUpPercentageLow = useSearchParam('mpl')
  const markUpPercentageHigh = useSearchParam('mph')

  return (
    <div>
      <div className={s.range}>
        <label>Unit Price</label>

        <fieldset>
          <input type="number" id="unitPriceLow" value={unitPriceLow.value || ''} onChange={(e) => unitPriceLow.setValue(e.target.value)} className={s.inputNumber} />
          <span className={s.toWord}>to</span>
          <input type="number" id="unitPriceHigh" value={unitPriceHigh.value || ''} onChange={(e) => unitPriceHigh.setValue(e.target.value)} className={s.inputNumber} />
        </fieldset>
      </div>
      <div className={s.range}>
        <label>Dispensing Fee</label>
        <fieldset>
          <input type="number" id="dispensingFeeLow" value={dispensingFeeLow.value || ''} onChange={(e) => dispensingFeeLow.setValue(e.target.value)} className={s.inputNumber} />
          <span className={s.toWord}>to</span>
          <input type="number" id="dispensingFeeHigh" value={dispensingFeeHigh.value || ''} onChange={(e) => dispensingFeeHigh.setValue(e.target.value)} className={s.inputNumber} />
        </fieldset>
      </div>
      <div className={s.range}>
        <label>Mark Up Percentage</label>
        <fieldset>
          <input type="number" id="markUpPercentageLow" value={markUpPercentageLow.value || ''} onChange={(e) => markUpPercentageLow.setValue(e.target.value)} className={s.inputNumber} />
          <span className={s.toWord}>to</span>
          <input type="number" id="markUpPercentageHigh" value={markUpPercentageHigh.value || ''} onChange={(e) => markUpPercentageHigh.setValue(e.target.value)} className={s.inputNumber} />
        </fieldset>
      </div>
    </div>

  )
}

function OfficeFacet() {
  const offices = useStore(state => state.org?.offices)!
  const officeParams = useSearchParamsListToggle('o')
  const officeKeys = Object.keys(offices) as OfficeId[]
  const sortedOfficeKeys = sort(officeKeys).asc(k => offices[k].name)

  return (
    <>
      {sortedOfficeKeys.map(key =>
        <div key={key}>
          <input
            id={key}
            aria-labelledby={key}
            type="checkbox"
            checked={officeParams.isSelected(key)}
            onChange={() => officeParams.toggle(key)}
          />
          <label htmlFor={key}>{offices[key].name}</label>
        </div>
      )}
    </>
  )
}

function ClassificationFacet({ classification, value }: { classification: string, value: Classification }) {
  const classifications = useStore(state => state.org?.classifications)!
  const classificationParams = useSearchParamsListToggle('c')
  const subClassificationParams = useSearchParamsListToggle('sc')

  useEffect(() => {
    if (!classificationParams.isSelected(classification)) {
      subClassificationParams.removeMany(Object.keys(classifications[classification]?.subClassifications || {}))
    }
  }, [classificationParams.isSelected(classification)])

  return (
    <div className={s.classificationSet} key={classification}>
      <input
        id={classification}
        aria-labelledby={classification}
        type="checkbox"
        checked={classificationParams.isSelected(classification)}
        onChange={() => classificationParams.toggle(classification)}
      />
      <label htmlFor={classification}>{value.name}</label>
      {classificationParams.isSelected(classification) &&
        <div className={s.subClassificationSection}>
          {sort(Object.entries(classifications[classification]?.subClassifications || {})).asc(cs => cs[1]?.name).map(([subKey, subValue]) => (
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
      }
    </div>

  )
}

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

      <div className={s.misc}>
        <h3>Mapping Helpers</h3>
        <MappingHelperFacets />
      </div>
    </div>
  )
}

function MappingHelperFacets() {
  const missingOfficeIds = useSearchParam('mo')
  const differentItemId = useSearchParam('di')
  const differentClassification = useSearchParam('dc')
  const differentItemDescription = useSearchParam('did')
  const multiOffice = useSearchParam('mso')
  const nameAllCaps = useSearchParam('nac')
  const inactiveLinkedToMaster = useSearchParam('il2m')
  const unsimilarItemDescription = useSearchParam('uid')
  const duplicateMasterIds = useSearchParam('dmi')
  const mismatchedItemTypes = useSearchParam('mit')


  return (
    <div className={s.mappingFilters}>
      <fieldset>
        <input type="checkbox" id="missingOfficeIds" checked={!!missingOfficeIds.value} onChange={() => missingOfficeIds.toggle()} />
        <label htmlFor="missingOfficeIds">Missing Office Ids</label>
      </fieldset>
      <fieldset>
        <input type="checkbox" id="differentItemId" checked={!!differentItemId.value} onChange={() => differentItemId.toggle()} />
        <label htmlFor="differentItemId">Different Item Id</label>
      </fieldset>
      <fieldset>
        <input type="checkbox" id="differentClassifcation" checked={!!differentClassification.value} onChange={() => differentClassification.toggle()} />
        <label htmlFor="differentClassifcation">Different Classification</label>
      </fieldset>
      <fieldset>
        <input type="checkbox" id="differentItemDescription" checked={!!differentItemDescription.value} onChange={() => differentItemDescription.toggle()} />
        <label htmlFor="differentItemDescription">Different Item Description</label>
      </fieldset>
      <fieldset>
        <input type="checkbox" id="multiOffice" checked={!!multiOffice.value} onChange={() => multiOffice.toggle()} />
        <label htmlFor="multiOffice">Multi Office</label>
      </fieldset>
      <fieldset>
        <input type="checkbox" id="nameAllCaps" checked={!!nameAllCaps.value} onChange={() => nameAllCaps.toggle()} />
        <label htmlFor="nameAllCaps">Name All Caps</label>
      </fieldset>
      <fieldset>
        <input type="checkbox" id="inactiveLinkedToMaster" checked={!!inactiveLinkedToMaster.value} onChange={() => inactiveLinkedToMaster.toggle()} />
        <label htmlFor="inactiveLinkedToMaster">Inactive Linked To Master</label>
      </fieldset>
      <fieldset>
        <input type="checkbox" id="unsimilarItemDescription" checked={!!unsimilarItemDescription.value} onChange={() => unsimilarItemDescription.toggle()} />
        <label htmlFor="unsimilarItemDescription">Unsimilar Item Description</label>
      </fieldset>
      <fieldset>
        <input type="checkbox" id="duplicateMasterIds" checked={!!duplicateMasterIds.value} onChange={() => duplicateMasterIds.toggle()} />
        <label htmlFor="duplicateMasterIds">Duplicate Master Ids</label>
      </fieldset>
      <fieldset>
        <input type="checkbox" id="mismatchedItemTypes" checked={!!mismatchedItemTypes.value} onChange={() => mismatchedItemTypes.toggle()} />
        <label htmlFor="mismatchedItemTypes">Mismatched Item Types</label>
      </fieldset>
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
  const unitPriceVarianceLow = useSearchParam('upvl')
  const unitPriceVarianceHigh = useSearchParam('upvh')
  const dispensingFeeVarianceLow = useSearchParam('dfvl')
  const dispensingFeeVarianceHigh = useSearchParam('dfvh')

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
        <label>Unit Price Variance</label>
        <fieldset>
          <input type="number" id="unitPriceVarianceLow" value={unitPriceVarianceLow.value || ''} onChange={(e) => unitPriceVarianceLow.setValue(e.target.value)} className={s.inputNumber} />
          <span className={s.toWord}>to</span>
          <input type="number" id="unitPriceVarianceHigh" value={unitPriceVarianceHigh.value || ''} onChange={(e) => unitPriceVarianceHigh.setValue(e.target.value)} className={s.inputNumber} />
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
        <label>Dispensing Fee Variance</label>
        <fieldset>
          <input type="number" id="dispensingFeeVarianceLow" value={dispensingFeeVarianceLow.value || ''} onChange={(e) => dispensingFeeVarianceLow.setValue(e.target.value)} className={s.inputNumber} />
          <span className={s.toWord}>to</span>
          <input type="number" id="dispensingFeeVarianceHigh" value={dispensingFeeVarianceHigh.value || ''} onChange={(e) => dispensingFeeVarianceHigh.setValue(e.target.value)} className={s.inputNumber} />
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
      <input
        id='SelectAllOffices'
        type="checkbox"
        checked={officeParams.values.length === officeKeys.length}
        onChange={() => officeParams.isSelectedAll(officeKeys) ? officeParams.addAll(['CIVA']) : officeParams.addAll(officeKeys)}
      />
      <label htmlFor='SelectAllOffices'>Select All</label>
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

import { useStore } from "../../store"
import { classificationsForSelectInput, subClassificationsForSelectInput } from "../../store/selectors/classifications"
import { itemTypesForSelectInput } from "../../store/selectors/itemType"
import { officesForSelectInput } from "../../store/selectors/offices"


type props = {
  value: string | undefined
  className?: string,
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
} & React.SelectHTMLAttributes<HTMLSelectElement>
export function OfficeSelector({ value, onChange, className, ...attr }: props) {
  const offices = useStore(state => state.org?.offices)!
  const officesOptions = officesForSelectInput(offices)

  return (
    <fieldset className={className}>
      <label htmlFor="office">Office</label>
      <select id="office" name="officeId" value={value || ''} onChange={onChange} {...attr}>
        <option value="" >Select an office</option>
        {officesOptions.map(office => (
          <option key={office.value} value={office.value}>{office.label}</option>
        ))}
      </select>
    </fieldset>
  )
}

export function ClassificationSelector({ value, onChange, className }: props) {
  const classifications = useStore(state => state.org?.classifications)!
  const classificationsOptions = classificationsForSelectInput(classifications)

  return (
    <fieldset className={className}>
      <label htmlFor="classification">Classification</label>
      <select id="classification" name="classificationId" value={value || ''} onChange={onChange}>
        <option value="" >Select a classification</option>
        {classificationsOptions.map(classification => (
          <option key={classification.value} value={classification.value}>{classification.label}</option>
        ))}
      </select>
    </fieldset>
  )
}

type subClassificationProps = props & { classification: string }
export function SubClassificationSelector({ value, onChange, classification, className }: subClassificationProps) {
  const classifications = useStore(state => state.org?.classifications)!
  const subClassificationsOptions = subClassificationsForSelectInput(classifications, classification)

  return (
    <fieldset className={className}>
      <label htmlFor="subClassification">Sub Classification</label>
      <select id="subClassification" name="subClassificationId" value={value || ''} onChange={onChange}>
        <option value="" >Select a sub classification</option>
        {subClassificationsOptions.map(subClassification => (
          <option key={subClassification.value} value={subClassification.value}>{subClassification.label}</option>
        ))}
      </select>
    </fieldset>
  )
}

export function ItemTypeSelector({ value, onChange, className }: props) {
  const itemTypes = useStore(state => state.org?.itemTypes)!
  const itemTypeOptions = itemTypesForSelectInput(itemTypes)

  return (
    <fieldset className={className}>
      <label htmlFor="itemType">Item Type</label>
      <select id="itemType" name="itemType" value={value || ''} onChange={onChange}>
        <option value="" disabled={true}>Select an item type</option>
        {itemTypeOptions.map(itemType => (
          <option key={itemType.value} value={itemType.value}>{itemType.label}</option>
        ))}
      </select>
    </fieldset>
  )
}

export function ItemSortSelector({ value, onChange, className }: props) {
  return (
    <fieldset className={className}>
      <label htmlFor="itemSort">Sort By</label>
      <select id="itemSort" name="itemSort" value={value || 'relevance'} onChange={onChange}>
        <option value="relevance">Relevance</option>
        <option value="name">Name</option>
        <option value="date">Last Update Time</option>
        <option value="markup">Markup</option>
        <option value="unitPrice">Unit Price</option>
        <option value="dispensingFee">Dispensing Fee</option>
      </select>
    </fieldset>
  )
}
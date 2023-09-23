import { useStore } from "../../store"
import { classificationsForSelectInput, subClassificationsForSelectInput } from "../../store/selectors/classifications"
import { officesForSelectInput } from "../../store/selectors/offices"


type props = {
  value: string | undefined
  className?: string,
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}
export function OfficeSelector({ value, onChange, className }: props) {
  const offices = useStore(state => state.org?.offices)!
  const officesOptions = officesForSelectInput(offices)

  return (
    <fieldset className={className}>
      <label htmlFor="office">Office</label>
      <select id="office" name="officeId" value={value || ''} onChange={onChange}>
        <option value="" disabled={true}>Select an office</option>
        {officesOptions.map(office => (
          <option key={office.value} value={office.value}>{office.label}</option>
        ))}
      </select>
    </fieldset>
  )
}

export function ClassificationSelector({ value, onChange, className }: props) {
  console.log("🚀 ~ file: selectors.tsx:29 ~ ClassificationSelector ~ value:", value)
  const classifications = useStore(state => state.org?.classifications)!
  const classificationsOptions = classificationsForSelectInput(classifications)

  return (
    <fieldset className={className}>
      <label htmlFor="classification">Classification</label>
      <select id="classification" name="classificationId" value={value || ''} onChange={onChange}>
        <option value="" disabled={true}>Select a classification</option>
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
        <option value="" disabled={true}>Select a sub classification</option>
        {subClassificationsOptions.map(subClassification => (
          <option key={subClassification.value} value={subClassification.value}>{subClassification.label}</option>
        ))}
      </select>
    </fieldset>
  )

}
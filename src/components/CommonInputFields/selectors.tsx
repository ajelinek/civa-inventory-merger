import { useStore } from "../../store"
import { classificationsForSelectInput, subClassificationsForSelectInput } from "../../store/selectors/classifications"
import { officesForSelectInput } from "../../store/selectors/offices"


type props = {
  value: string,
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}
export function OfficeSelector({ value, onChange }: props) {
  const offices = useStore(state => state.offices)
  const officesOptions = officesForSelectInput(offices)

  return (
    <>
      <label htmlFor="office">Office</label>
      <select id="office" name="office" value={value} onChange={onChange}>
        <option value="" disabled={true}>Select an office</option>
        {officesOptions.map(office => (
          <option key={office.value} value={office.value}>{office.label}</option>
        ))}
      </select>
    </>
  )
}

export function ClassificationSelector({ value, onChange }: props) {
  const classifications = useStore(state => state.classifications)
  const classificationsOptions = classificationsForSelectInput(classifications)

  return (
    <div>
      <label htmlFor="classification">Classification</label>
      <select id="classification" name="classification" value={value} onChange={onChange}>
        <option value="" disabled={true}>Select a classification</option>
        {classificationsOptions.map(classification => (
          <option key={classification.value} value={classification.value}>{classification.label}</option>
        ))}
      </select>
    </div>
  )
}

type subClassificationProps = props & { classification: string }
export function SubClassificationSelector({ value, onChange, classification }: subClassificationProps) {
  const classifications = useStore(state => state.classifications)
  const subClassificationsOptions = subClassificationsForSelectInput(classifications, classification)

  return (
    <div>
      <label htmlFor="subClassification">Sub Classification</label>
      <select id="subClassification" name="subClassification" value={value} onChange={onChange}>
        <option value="" disabled={true}>Select a sub classification</option>
        {subClassificationsOptions.map(subClassification => (
          <option key={subClassification.value} value={subClassification.value}>{subClassification.label}</option>
        ))}
      </select>
    </div>
  )

}
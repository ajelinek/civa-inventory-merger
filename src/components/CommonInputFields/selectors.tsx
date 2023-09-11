import { useStore } from "../../store"
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
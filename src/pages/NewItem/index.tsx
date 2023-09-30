import ItemForm from "../../components/ItemForm"
import s from './newItem.module.css'

export default function NewItemPage() {
  return (
    <div className={s.container}>
      <section className={s.contentForm}>
        <h2>New Item</h2>
        <ItemForm />
      </section>
    </div>
  )
}
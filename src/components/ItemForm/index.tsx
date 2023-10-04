import { nanoid } from "nanoid/non-secure"
import { useEffect } from "react"
import useFormManagement from "../../hooks/userFormManagement"
import { useCatalogItem, useStore, useUpsertItem } from "../../store"
import { AlertMessage } from "../AlertMessage"
import { ClassificationSelector, ItemTypeSelector, OfficeSelector, StatusSelector, SubClassificationSelector } from "../CommonInputFields/selectors"
import s from './itemForm.module.css'
import { useNavigate } from "react-router-dom"

type props = {
  itemKey?: ItemKey
}

export default function ItemForm({ itemKey }: props) {
  const nav = useNavigate()
  const item = useCatalogItem(itemKey)
  const createItem = useUpsertItem()
  const classifications = useStore(state => state.org?.classifications)
  const itemTypes = useStore(state => state.org?.itemTypes)
  const form = useFormManagement(initItem(item), async (item) => {
    item.classificationName = classifications?.[item.classificationId]?.name || ""
    item.subClassificationName = classifications?.[item.classificationId]?.subClassifications?.[item.subClassificationId]?.name || ""
    item.itemTypeDescription = itemTypes?.[item.itemType].name || ""
    await createItem.execute(item)
    if (!itemKey) nav(`/item/${item.recordId}/${item.officeId}`)
  })

  const createEditText = !!item ? 'Update' : 'Create'

  function initItem(item: ItemRecord | undefined): CreateItemRecordInput {
    return ({
      recordId: item?.recordId || nanoid(8),
      officeId: item?.officeId || 'CIVA',
      itemId: item?.itemId || "",
      itemDescription: item?.itemDescription || "",
      classificationId: item?.classificationId || "",
      classificationName: item?.classificationName || "",
      subClassificationId: item?.subClassificationId || "",
      subClassificationName: item?.subClassificationName || "",
      unitOfMeasure: item?.unitOfMeasure || "",
      itemType: item?.itemType || "U",
      itemTypeDescription: item?.itemTypeDescription || "",
      minimumPrice: item?.minimumPrice || 0,
      markUpPercentage: item?.markUpPercentage || 0,
      unitPrice: item?.unitPrice || 0,
      dispensingFee: item?.dispensingFee || 0,
      status: item?.status || "active",
      linkedItems: item?.linkedItems || [],
    })
  }

  useEffect(() => {
    form.updateState(initItem(item))
  }, [item])

  return (
    <div className={s.container}>
      <AlertMessage message={createItem.error?.message} />
      <form className={s.form} onSubmit={form.onSubmit}>
        <div className={s.formGroup}>
          <OfficeSelector className={s.fieldset} value={form.data.officeId} onChange={form.onChange} disabled={!!item} />
          <StatusSelector className={s.fieldset} value={form.data.status} onChange={form.onChange} />
        </div>
        <div className={s.formGroup}>
          <ClassificationSelector className={s.fieldset} value={form.data.classificationId} onChange={form.onChange} />
          <SubClassificationSelector className={s.fieldset} value={form.data.subClassificationId} onChange={form.onChange} classification={form.data.classificationId} />
        </div>
        <fieldset className={s.itemDescription}>
          <label htmlFor="itemDescription">Item Description</label>
          <input type="text" id="itemDescription" name="itemDescription" value={form.data.itemDescription} onChange={form.onChange} />
        </fieldset>
        <div className={s.formGroup}>
          <ItemTypeSelector className={s.fieldset} value={form.data.itemType} onChange={form.onChange} />
          <fieldset className={s.fieldset}>
            <label htmlFor="itemId">Item Id</label>
            <input type="text" id="itemId" name="itemId" value={form.data.itemId} onChange={form.onChange} />
          </fieldset>
          <fieldset className={s.fieldset}>
            <label htmlFor="dispensingFee">Dispensing Fee</label>
            <input type="text" id="dispensingFee" name="dispensingFee" value={'' + form.data.dispensingFee} onChange={form.onChange} />
          </fieldset>
          <fieldset className={s.fieldset}>
            <label htmlFor="unitOfMeasure">Unit of Measure</label>
            <input type="text" id="unitOfMeasure" name="unitOfMeasure" value={form.data.unitOfMeasure} onChange={form.onChange} />
          </fieldset>
        </div>
        <div className={s.formGroup}>
          <fieldset className={s.fieldset}>
            <label htmlFor="minimumPrice">Minimum Price</label>
            <input type="number" id="minimumPrice" name="minimumPrice" value={'' + form.data.minimumPrice} onChange={form.onChange} />
          </fieldset>
          <fieldset className={s.fieldset}>
            <label htmlFor="markUpPercentage">Mark Up Percentage</label>
            <input type="number" id="markUpPercentage" name="markUpPercentage" value={'' + form.data.markUpPercentage} onChange={form.onChange} />
          </fieldset>
        </div>
        <button type="submit" aria-busy={createItem.loading}>{createEditText}</button>
      </form>
    </div>
  )

}
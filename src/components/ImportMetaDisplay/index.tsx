import s from './style.module.css'

export default function ImportMetaDisplay({ meta }: { meta: OfficeCatalogMetadata }) {
  return (
    <div className={s.container}>
      <h2>Import Results</h2>
      <p className={s.attribute}>
        <span className={s.label}>Number of Inventory Items Imported:</span> {meta.inventoryItemsImported || 0}
      </p>
      <p className={s.attribute}>
        <span className={s.label}>Number of Pricing Items Imported:</span> {meta.pricingItemsImported || 0}
      </p>
      <p className={s.attribute}>
        <span className={s.label}>Number of Joined Pricing Items:</span> {meta.matchedPricingItems || 0}
      </p>
      <p className={s.attribute}>
        <span className={s.label}>Number of Items Linked To Primary Catalog:</span>
        {meta.numberOfItemsLinkedToMaster || 0}
        &nbsp; | &nbsp;
        {((meta.numberOfItemsLinkedToMaster / meta.inventoryItemsImported) * 100).toFixed(1) || 0}%
      </p>
      <p className={s.attribute}>
        <span className={s.label}>Unmatched Pricing Item Ids:</span> {meta.unmatchedPricingItems.join(', ')}
      </p>
      <p className={s.attribute}>
        <span className={s.label}>Multiple Pricing Entry Item Ids:</span> {meta.multiplePricingInfoItems.join(', ')}
      </p>
      <p className={s.attribute}>
        <span className={s.label}>Errored Pricing Item Ids:</span> {meta.erroredPricingItems.join(', ')}
      </p>
    </div>
  )
}


type ItemCompositeKey = Pick<ItemRecord, 'officeId' | 'subClassificationId' | 'itemId'>
export const itemRecordId = (item: ItemCompositeKey) => `${item.officeId}-${item.itemId}`

export const getItem = (itemKey: ItemKey, catalog: Catalogs) => {
  return catalog[itemKey.officeId][itemKey.recordId]
}

export function calculateLinkItemTotals(linkedItems: ItemKey[], catalogs: Catalogs): LinkItemTotals {
  const unitPrices: number[] = []
  const dispensingFees: number[] = []
  const markupPercentages: number[] = []

  linkedItems.forEach((linkedItem) => {
    const catalogItem = catalogs[linkedItem.officeId][linkedItem.recordId]
    if (catalogItem) {
      unitPrices.push(catalogItem.unitPrice || 0)
      dispensingFees.push(catalogItem.dispensingFee || 0)
      markupPercentages.push(catalogItem.markUpPercentage || 0)
    }
  })

  const maxUnitPrice = Math.max(...unitPrices)
  const minUnitPrice = Math.min(...unitPrices)
  const avgUnitPrice = unitPrices.reduce((a, b) => a + b, 0) / unitPrices.length
  const unitPriceVariance = (((maxUnitPrice - minUnitPrice) / minUnitPrice) * 100)

  const maxDispensingFee = Math.max(...dispensingFees)
  const minDispensingFee = Math.min(...dispensingFees)
  const avgDispensingFee = dispensingFees.reduce((a, b) => a + b, 0) / dispensingFees.length
  const dispensingFeeVariance = (((maxDispensingFee - minDispensingFee) / minDispensingFee) * 100)

  const maxMarkupPercentage = Math.max(...markupPercentages)
  const minMarkupPercentage = Math.min(...markupPercentages)
  const avgMarkupPercentage = (markupPercentages.reduce((a, b) => a + b, 0) / markupPercentages.length)

  return {
    maxUnitPrice,
    minUnitPrice,
    avgUnitPrice,
    unitPriceVariance,
    maxDispensingFee,
    minDispensingFee,
    avgDispensingFee,
    dispensingFeeVariance,
    maxMarkupPercentage,
    minMarkupPercentage,
    avgMarkupPercentage,
  }
}
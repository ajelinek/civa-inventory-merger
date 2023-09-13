import { useStore } from ".."

export function classificationsForSelectInput(classifications: Classifications) {
  const classificationKeys = Object.keys(classifications)
  return classificationKeys.map((key) => {
    return { value: key, label: `${key} - ${classifications[key].name}` }
  })
}

export function subClassificationsForSelectInput(classifications: Classifications, classification: string) {
  const subClassifications = classifications[classification]?.subClassifications
  if (!subClassifications) return []

  const classificationKeys = Object.keys(subClassifications)
  return classificationKeys.map((key) => {
    return { value: key, label: `${key} - ${subClassifications[key].name}` }
  })
}

export function getClassificationNames(classId: string, subClassId: string) {
  const classifications = useStore.getState().classifications
  return {
    classificationName: classifications[classId]?.name,
    subClassificationName: classifications[classId]?.subClassifications?.[subClassId]?.name || ''
  }
}
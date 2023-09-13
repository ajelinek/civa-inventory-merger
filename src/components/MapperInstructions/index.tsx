import { useState } from "react"
import s from './mapperInstructions.module.css'

export default function MapperInstructions() {

  const [showInstructions, setShowInstructions] = useState<boolean>(true)
  if (!showInstructions) return null

  return (
    <article className={s.instructions}>
      <header>
        Instructions
        <span className={s.close} onClick={() => setShowInstructions(!setShowInstructions)}>X</span>
      </header>
      Select the classification and Sub classifications you want to map all of the
      elements to. Once selected you will have 3 different columns.  Column 1 will show
      all of the inventory items that have been mapped to the selected classification and
      sub classification.  Column 2 will show suggested mappings based on key words found in
      existing mappings, and token searches. Column 3 will show all of the inventory items that have not
    </article>
  )
}
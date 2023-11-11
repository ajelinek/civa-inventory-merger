import { useState } from "react"
import { AiOutlineInfoCircle } from "react-icons/ai"
import s from './advancedSearchHelp.module.css'

const terms = [
  {
    token: "cat",
    matchType: "fuzzy match",
    description: "Items that fuzzy match 'cat'",
  },
  {
    token: "=dog",
    matchType: "exact match",
    description: "Items that are 'dog'",
  },
  {
    token: "'kitten",
    matchType: "include match",
    description: "Items that include 'kitten'",
  },
  {
    token: "!puppy",
    matchType: "inverse exact match",
    description: "Items that do not include 'puppy'",
  },
  {
    token: "^animal",
    matchType: "prefix exact match",
    description: "Items that start with 'animal'",
  },
  {
    token: "!^pet",
    matchType: "inverse prefix exact match",
    description: "Items that do not start with 'pet'",
  },
  {
    token: ".jpg$",
    matchType: "suffix exact match",
    description: "Items that end with '.jpg'",
  },
  {
    token: "!.png$",
    matchType: "inverse suffix exact match",
    description: "Items that do not end with '.png'",
  },
]


export default function AdvancedSearchTable({ className }: { className?: string }) {
  const [showModal, setShowModal] = useState(false)
  return (
    <div className={className}>
      <a className={s.helpButton} onClick={() => setShowModal(true)}>
        <AiOutlineInfoCircle /> Advanced Search Help

      </a>
      {showModal && (
        <dialog open={showModal}>
          <article className={s.content}>
            <header>
              <a aria-label="Close" className='close' onClick={() => setShowModal(false)}> </a>
              Advanced Search Help
            </header>
            <table className="advanced-search-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Match type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {terms.map((term) => (
                  <tr key={term.token}>
                    <td>{term.token}</td>
                    <td>{term.matchType}</td>
                    <td>{term.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className={s.defintions}>
              <dt>Exclude Inactive:</dt>
              <dd>Show only Active Items</dd>

              <dt>Exclude Mapped:</dt>
              <dd>Only applies to CIVA, and will show any item that has not been mapped to a classification or sub classifcation</dd>

              <dt>Exclude Linked:</dt>
              <dd>Show any item that has not been liked to the primary catalog. If viewing the primary catalog CIVA, then show items that do not have every "loaded" office linked.</dd>
            </dl>

          </article>
        </dialog>
      )}
    </div>
  )
};

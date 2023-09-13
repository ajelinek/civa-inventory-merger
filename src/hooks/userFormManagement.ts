import React, { useState } from 'react'

export default function useFormManagement<Data, onSubmitReturn>(
  defaultState: Partial<Data>,
  formSubmitCb: (data: Partial<Data>) => onSubmitReturn = defaultFormSubmit
) {

  const [initialState, setInitialState] = useState<Partial<Data>>({ ...defaultState })
  const [data, setData] = useState<Partial<Data>>({ ...defaultState } as Data)
  const [isDirty, setIsDirty] = useState(false)

  /**
   * Update the current state based on the name attribute..  The name attribute
   * and the key in the object must match
   */
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newState = { ...data, [e.target.name]: e.target.value } as Data
    //TODO: Change to Deep Equal Lib
    setIsDirty(JSON.stringify(initialState) !== JSON.stringify(newState))
    setData(newState)
    return newState
  }

  /** Prevent form default and call passed in formSubmitCb */
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    return formSubmitCb(data)
  }

  /** Merge the current state with the passed in state */
  function updateState(updatedData: Partial<Data>) {
    const newState = { ...data, ...updatedData }
    setData(newState)
    setIsDirty(JSON.stringify(initialState) !== JSON.stringify(newState))
    return newState
  }

  /**If new state is provided than set state to that, otherwise set it to the initial state passed in */
  function resetState(newState?: Partial<Data>) {
    const state = newState && !('nativeEvent' in newState) ? newState : initialState
    setInitialState(state)
    setData(state)
    setIsDirty(false)
  }

  return {
    data,
    isDirty,
    onChange,
    onSubmit,
    resetState,
    updateState
  }
}

//@ts-ignore
function defaultFormSubmit<T, R>(data: T): R {
  throw new Error('No formSubmitCb function was provided')
}

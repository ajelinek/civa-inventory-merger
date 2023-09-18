import { useEffect } from 'react'
import { useAsyncCallback } from 'react-async-hook'
import { useStore } from '..'
import { login, logout, subScribeToAuthChanges } from '../providers/auth'

export function useAuthorizedUser() {
  useEffect(() => {
    const unsubscribe = subScribeToAuthChanges(user => {
      useStore.setState({ user })
    })

    return () => unsubscribe()
  }, [])
}

export function useLogin() {
  return useAsyncCallback(login)
}

export function useLogout() {
  return useAsyncCallback(logout)
}
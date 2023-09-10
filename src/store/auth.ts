import { useEffect } from 'react'
import { useStore } from '.'
import { auth } from './firebase'
import { useAsyncCallback } from 'react-async-hook'
import { signInWithEmailAndPassword } from 'firebase/auth'

export function useAuthorizedUser() {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      useStore.setState({ user })
    })

    return () => unsubscribe()
  }, [])
}


export function useLogin() {
  return useAsyncCallback(async (email: string | null | undefined, password: string | null | undefined) => {
    if (!email || !password) {
      throw new Error('Username and password are required')
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email.toLocaleLowerCase(), password)
      useStore.setState({ user: cred.user })
      return cred.user
    } catch (error) {
      throw new Error(userErrorMessage(error))
    }
  })
}

export function useLogout() {
  return useAsyncCallback(async () => {
    try {
      await auth.signOut()
      useStore.setState({ user: null })
    } catch (error) {
      throw new Error(userErrorMessage(error))
    }
  })
}

function userErrorMessage(error: any) {
  if (!error) return ''

  const { code } = error
  if (code === 'auth/missing-email') return 'Sorry, but an email address is required'
  if (code === 'auth/missing-password') return 'Sorry, but a password is required'
  if (code === 'auth/email-already-in-use') return 'Sorry, that email is already in use, please login'
  if (code === 'auth/user-not-found') return 'Sorry, we can not find that email'
  if (code === 'auth/wrong-password') return 'Sorry, that was the wrong password'
  if (code === 'auth/invalid-email') return 'Sorry, but that is an invalid email'
  if (code === 'auth/weak-password') return 'Sorry, but the password is a little too weak.  Must be over 6 characters'
  if (code === 'VALIDATION') return error.message
  if (code) return 'Sorry, there were issues logging in, please try again'
}
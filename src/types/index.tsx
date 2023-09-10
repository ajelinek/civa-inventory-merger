type FirebaseUser = import('firebase/auth').User


interface Store {
  user: FirebaseUser | null | undefined
}

interface Creds {
  email: string
  password: string
}
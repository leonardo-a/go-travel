import { useSegments, useRouter } from 'expo-router'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  deleteSecureItem,
  getSecureItem,
  saveSecureItem,
} from '../services/secure-storage'
import { SplashLoading } from '@components/partials/SplashLoading'

export type AuthType = {
  signIn: (session: string) => void
  signOut: () => void
  session?: string | null
}

const AuthContext = createContext<AuthType | null>(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useAuth must be wrapped in a <SessionProvider />')
    }
  }

  return value as AuthType
}

async function useProtectedRoute(session: string | null) {
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)'

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !session &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace('/sign-in')
    } else if (session && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/home')
    }
  }, [session, segments])
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null)

  useProtectedRoute(session)

  return (
    <AuthContext.Provider
      value={{
        signIn: (session: string) => {
          setSession(session)

          saveSecureItem('session', session)
        },

        signOut: () => {
          setSession(null)

          deleteSecureItem('session')
        },
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

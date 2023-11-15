import { useEffect, useState } from 'react'
import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native'
import { Link } from 'expo-router'
import colors from 'tailwindcss/colors'
import AppLogo from '../../assets/vectors/logo.svg'

import { useAuth } from '@contexts/auth'
import { getSecureItem } from '@services/secure-storage'
import { validateEmail } from '@utils/validate-fields'

import { Background } from '@components/ui/Background'
import { TextInput } from '@components/ui/TextInput'
import { api } from '@libs/axios'
import { AxiosError } from 'axios'
import { ScreenStatus } from '@interfaces/app'
import { cn } from '@utils/merge'

export default function SignIn() {
  const auth = useAuth()

  const [status, setStatus] = useState<ScreenStatus>('pending')
  const [email, setEmail] = useState<string>()
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null)
  const [password, setPassword] = useState<string>()
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null)

  async function getSession() {
    setStatus('pending')
    try {
      const session = await getSecureItem('session')

      if (session) {
        auth.signIn(session)
      }
      setStatus('done')
    } catch (err) {
      console.log({ errSession: err })
      setStatus('error')
    }
  }

  useEffect(() => {
    getSession()
  }, [auth])

  function handleEmailChange(value: string) {
    const isValid = validateEmail(value)
    setEmail(value)
    setIsEmailValid(isValid)

    if (status !== 'done') {
      setStatus('done')
    }
  }

  function handlePasswordChange(value: string) {
    setPassword(value)
    setIsPasswordValid(value.length > 7)

    if (status !== 'done') {
      setStatus('done')
    }
  }

  async function handleSubmit() {
    if (!isPasswordValid || !isEmailValid) {
      return Alert.alert(
        'Error',
        'Preencha todos os campos corretamente para continuar',
      )
    }

    setStatus('pending')

    try {
      const { data } = await api.post('/auth', {
        email,
        password,
      })

      auth.signIn(data.token)
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log({ err })
      }
      setStatus('error')
    }
  }

  return (
    <Background className="items-center justify-center flex-1">
      <View
        className={cn([
          'items-center justify-center w-10/12 px-5 py-8 space-y-5 rounded-xl bg-dark-800 border-2 border-dark-800',
          status === 'error' && 'border-ruby-500',
        ])}
      >
        <AppLogo width={128} height={128} />
        <Text className="text-3xl font-bold text-purple-100">
          Bem-vindo(a)!
        </Text>
        <View className="items-center w-full space-y-8">
          <View className="w-full px-4 space-y-4">
            <TextInput
              placeholder="email"
              autoComplete="email"
              onChangeText={handleEmailChange}
              validation={
                isEmailValid === null
                  ? 'none'
                  : isEmailValid
                  ? 'success'
                  : 'error'
              }
            />
            <TextInput
              placeholder="senha"
              secureTextEntry
              onChangeText={handlePasswordChange}
              validation={
                isPasswordValid === null
                  ? 'none'
                  : isPasswordValid
                  ? 'success'
                  : 'error'
              }
            />
          </View>
          <View className="items-center w-full space-y-3">
            {status === 'pending' && (
              <View className="items-center justify-center w-9/12 px-4 py-2 rounded-lg bg-purple-600/50">
                <ActivityIndicator color={colors.neutral[900]} />
              </View>
            )}
            {status === 'done' && (
              <Pressable
                onPress={handleSubmit}
                className="items-center justify-center w-9/12 px-4 py-2 bg-purple-600 rounded-lg"
              >
                <Text className="font-bold uppercase">Entrar</Text>
              </Pressable>
            )}
            {status === 'error' && (
              <View className="items-center justify-center w-9/12 px-4 py-2 rounded-lg bg-ruby-400">
                <Text className="font-bold text-center uppercase">
                  Credenciais inválidas, tente novamente
                </Text>
              </View>
            )}
            <Link href="/register" className="underline text-dark-500">
              ou crie uma nova conta
            </Link>
          </View>
        </View>
      </View>
      {status === 'pending' && (
        <View className="absolute z-20 items-center justify-center w-full h-full bg-dark-800/50">
          <ActivityIndicator color={colors.purple[600]} size={42} />
        </View>
      )}
    </Background>
  )
}

import { useState } from 'react'
import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import { Link } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'

import { useAuth } from '@contexts/auth'
import { captureException } from '@services/sentry'
import { api } from '@libs/axios'
import { validateEmail } from '@utils/validate-fields'
import { ScreenStatus } from '@interfaces/app'

import { Background } from '@components/ui/Background'
import { TextInput } from '@components/ui/TextInput'
import { FormField } from '@components/ui/FormField'

import AppLogo from '../../assets/vectors/logo.svg'
import colors from 'tailwindcss/colors'
import { AxiosError } from 'axios'

export default function Register() {
  const auth = useAuth()

  const [status, setStatus] = useState<ScreenStatus>('done')
  const [name, setName] = useState<string>()
  const [username, setUsername] = useState<string>()
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null)
  const [email, setEmail] = useState<string>()
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null)
  const [password, setPassword] = useState<string>()
  // const [passwordConfirmation, setPasswordConfirmation] = useState<string>()
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null)

  function handleUsernameChange(value: string) {
    const isValid = /^[a-z0-9_-]+$/g.test(value)
    setUsername(value)
    setIsUsernameValid(isValid && value.length > 4)

    if (status !== 'done') {
      setStatus('done')
    }
  }

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
    if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
      setStatus('error')
      return
    }

    setStatus('pending')
    try {
      const { data } = await api.post('/register', {
        username,
        name,
        email,
        password,
      })

      setStatus('done')
      auth.signIn(data.token)
    } catch (err) {
      if (
        err instanceof AxiosError &&
        (err.status === 400 || err.status === 409)
      ) {
        return
      }
      captureException(err)
      setStatus('error')
      console.log({ errRegister: err })
    }
  }

  return (
    <Background className="items-center justify-center flex-1 w-full">
      <View className="relative items-center justify-center w-10/12 px-5 py-8 space-y-5 rounded-xl bg-dark-800">
        <Link href="/sign-in" className="absolute p-2 top-3 left-1">
          <ArrowLeft size={32} className="text-purple-100" />
        </Link>
        <AppLogo width={104} height={104} />
        <Text className="text-3xl font-bold text-purple-100">Criar conta</Text>
        <View className="w-full px-4 space-y-2">
          <FormField title="Nome">
            <TextInput placeholder="John Doe" onChangeText={setName} />
          </FormField>
          <FormField title="Nome de usuário">
            <TextInput
              placeholder="john_doe"
              onChangeText={handleUsernameChange}
              validation={
                isUsernameValid === null
                  ? 'none'
                  : isUsernameValid
                  ? 'success'
                  : 'error'
              }
            />
          </FormField>
          <FormField title="Email">
            <TextInput
              placeholder="ex.: johndoe@email.com"
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
          </FormField>
          <FormField title="Senha">
            <TextInput
              placeholder="********"
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
          </FormField>
        </View>
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
            <Text className="text-lg font-bold text-center uppercase text-dark-800">
              Cadastrar
            </Text>
          </Pressable>
        )}
        {status === 'error' && (
          <View className="items-center justify-center w-9/12 px-4 py-2 rounded-lg bg-ruby-400">
            <Text className="font-bold text-center uppercase">
              Campos incorretos
            </Text>
          </View>
        )}
      </View>
    </Background>
  )
}

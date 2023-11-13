import { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Switch, Text, View } from 'react-native'
import { User } from 'lucide-react-native'
import colors from 'tailwindcss/colors'

import { api } from '@libs/axios'
import { ScreenStatus } from '@interfaces/app'
import { UserProps } from '@interfaces/users'

import { Header } from '@components/partials/Header'
import { Background } from '@components/ui/Background'
import { ContentTab } from '@components/ui/ContentTab'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Profile() {
  const [status, setStatus] = useState<ScreenStatus>('pending')
  const [notifyFriend, setNotifyFriend] = useState<boolean>(false)
  const [notifyList, setNotifyList] = useState<boolean>(false)

  const [user, setUser] = useState<UserProps | null>(null)

  async function getProfile() {
    setStatus('pending')
    try {
      const { data } = await api.get('/me')

      setUser(data.user)
      setStatus('done')
    } catch (err) {
      console.log({ profileErr: err })
      setStatus('error')
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  return (
    <Background className="flex-1">
      <SafeAreaView className="flex-1">
        <Header />
        <View className="items-center justify-center mb-10 space-y-8">
          <View className="items-center justify-center w-32 h-32 rounded-full bg-dark-700">
            <User size={76} strokeWidth={1} className="text-purple-100" />
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-purple-100">
              {user?.name}
            </Text>
            <Text className="text-base text-purple-100">{user?.status}</Text>
          </View>
        </View>
        <ContentTab showHandle={false}>
          {status === 'pending' && (
            <View className="pt-16">
              <ActivityIndicator color={colors.violet[600]} size={44} />
            </View>
          )}
          {status === 'done' && (
            <ScrollView className="w-full px-4 mt-4 space-y-4">
              <View className="space-y-3">
                <View className="space-y-2">
                  <Text className="text-base font-bold text-purple-100">
                    Nome de usuário
                  </Text>
                  <View className="w-full px-3 py-4 rounded-lg bg-dark-700">
                    <Text className="text-base text-dark-300">
                      {user?.username}
                    </Text>
                  </View>
                </View>
                <View className="space-y-2">
                  <Text className="text-base font-bold text-purple-100">
                    Email
                  </Text>
                  <View className="w-full px-3 py-4 rounded-lg bg-dark-700">
                    <Text className="text-base text-dark-300">
                      {user?.email}
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <Text className="text-lg font-bold text-purple-100">
                  Notificações
                </Text>
                <View className="px-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base text-dark-200">
                      Pedidos de Amizade
                    </Text>
                    <Switch
                      onChange={() => setNotifyFriend((prev) => !prev)}
                      value={notifyFriend}
                    />
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base text-dark-200">
                      Convites para listas
                    </Text>
                    <Switch
                      onChange={() => setNotifyList((prev) => !prev)}
                      value={notifyList}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
          {status === 'error' && (
            <View className="px-10 pt-16">
              <Text className="text-xl font-bold text-center text-ruby-400">
                Não foi possível carregar as informações do usuário!
              </Text>
            </View>
          )}
        </ContentTab>
      </SafeAreaView>
    </Background>
  )
}

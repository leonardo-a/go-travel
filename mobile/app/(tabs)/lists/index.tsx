import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, View, Text } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import colors from 'tailwindcss/colors'

import { getSecureItem } from '@services/secure-storage'
import { api } from '@libs/axios'

import { Header } from '@components/partials/Header'
import { ContentList } from '@components/ui/ContentList'
import { ListItem } from '@components/ui/ListItem'
import { ListProps } from '@interfaces/lists'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Lists() {
  const { update } = useLocalSearchParams()
  const [lists, setLists] = useState<ListProps[]>([])
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [status, setStatus] = useState<'pending' | 'done' | 'error'>('pending')

  async function getLists() {
    setStatus('pending')
    const token = await getSecureItem('session')

    try {
      const response = await api.get('/lists/search', {
        headers: { Authorization: `Bearer ${token}` },
      })

      setLists(response.data.lists)
      setStatus('done')
    } catch (err) {
      console.log({ err })
      setStatus('error')
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    getLists().finally(() => {
      setTimeout(() => {
        setRefreshing(false)
      }, 500)
    })
  }, [])

  useEffect(() => {
    getLists()
  }, [update])

  return (
    <View className="items-center flex-1 bg-dark-800">
      <SafeAreaView className="items-center flex-1 w-full">
        {/* Header */}
        <Header title="Listas" />

        {/* Content */}
        <ContentList
          listClassName="mt-12"
          search={true}
          onRefresh={onRefresh}
          refreshing={refreshing}
        >
          <ListItem
            name="Nova Lista"
            action="add"
            onPress={() => router.push('/lists/new')}
          />
          {lists.length > 0 &&
            status === 'done' &&
            lists.map((list, index) => {
              return (
                <ListItem
                  key={`list-${index}`}
                  name={list.name}
                  onPress={() => router.push(`/lists/${list.id}`)}
                />
              )
            })}
          {status === 'error' && (
            <View className="items-center justify-center w-full py-5">
              <Text className="text-base font-bold text-ruby-500">
                Não foi possível carregar as listas
              </Text>
            </View>
          )}
          {status === 'pending' && (
            <View className="items-center justify-center w-full py-5">
              <ActivityIndicator color={colors.purple[600]} />
            </View>
          )}
        </ContentList>
      </SafeAreaView>
    </View>
  )
}

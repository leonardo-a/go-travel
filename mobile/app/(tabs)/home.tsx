import { useCallback, useEffect, useState } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Plane, Map } from 'lucide-react-native'
import colors from 'tailwindcss/colors'

import { api } from '@libs/axios'

import { Background } from '@components/ui/Background'
import { ContentTab } from '@components/ui/ContentTab'
import { Header } from '@components/partials/Header'
import { Carousel } from '@components/ui/Carousel'
import { ListPreview } from '@components/partials/ListPreview'
import { TravelPreview } from '@components/partials/TravelPreview'
import { EmptyLists } from '@components/partials/EmptyLists'
import { TravelProps } from '@interfaces/lists'
import { ScrollRefresh } from '@components/ui/ScrollRefresh'

interface ListProps {
  id: string
  name: string
  coverUrl: string | null
  members: string[]
}

export default function Home() {
  const [lists, setLists] = useState<ListProps[]>([])
  const [travels, setTravels] = useState<TravelProps[]>([])
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [status, setStatus] = useState<'pending' | 'done' | 'error'>('pending')

  async function getTravelsLists() {
    setStatus('pending')

    // Lists
    try {
      const response = await api.get('/lists/search')

      setLists(response.data.lists)
    } catch (err) {
      setStatus('error')
      console.log({ err })
    }

    // Upcoming Travels
    try {
      const response = await api.get('/travels')

      setTravels(response.data.travels)
    } catch (err) {
      setStatus('error')
      console.log({ err })
    }

    setStatus('done')
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    getTravelsLists().finally(() => {
      setTimeout(() => {
        setRefreshing(false)
      }, 300)
    })
  }, [])

  useEffect(() => {
    getTravelsLists()
  }, [])

  return (
    <Background className="flex-1">
      <SafeAreaView className="justify-between flex-1">
        <Header />
        <View className="px-5 my-10">
          <Text className="text-xl font-bold text-purple-100">
            Bem Vindo(a)!
          </Text>
          <Text className="leading-none text-white">
            Qual será seu próximo destino?
          </Text>
        </View>
        <ContentTab>
          <ScrollRefresh onRefresh={onRefresh} refreshing={refreshing}>
            {status === 'done' && lists.length === 0 && (
              <EmptyLists className="pt-4" />
            )}
            {status === 'done' && lists.length > 0 && (
              <View className="w-full h-full pt-4 space-y-8">
                {travels.length > 0 && (
                  <Carousel
                    title="Próximas Viagens"
                    icon={Plane}
                    data={travels}
                    renderItem={({ item, index }) => {
                      return (
                        <TravelPreview key={`travel-${index}`} travel={item} />
                      )
                    }}
                  />
                )}
                <Carousel
                  title="Minhas Listas"
                  icon={Map}
                  data={lists}
                  renderItem={({ item, index }) => {
                    return (
                      <ListPreview
                        key={`list-${index}`}
                        id={`${item.id}`}
                        name={item.name}
                        members={item.members}
                      />
                    )
                  }}
                />
              </View>
            )}
            {status === 'pending' && (
              <ActivityIndicator
                color={colors.violet[600]}
                size={36}
                className="pt-20"
              />
            )}
          </ScrollRefresh>
        </ContentTab>
      </SafeAreaView>
    </Background>
  )
}

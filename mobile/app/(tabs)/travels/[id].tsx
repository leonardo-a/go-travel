import { useEffect, useState } from 'react'
import { View, Text, Image, ActivityIndicator, Pressable } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Calendar, ChevronRight, Clock, Map, Plane } from 'lucide-react-native'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import colors from 'tailwindcss/colors'

import { api } from '@libs/axios'

import { ContentTab } from '@components/ui/ContentTab'
import { CountryBadge } from '@components/ui/CountryBadge'
import { Details } from '@components/ui/Detail'
import { Header } from '@components/partials/Header'
import { MembersPreview } from '@components/partials/MembersPreview'

interface TravelDetailsProps {
  id: string
  list_id: string
  transportation_id: string | null
  cover_photo: string | null
  destination: string
  country: string
  start_date: string
  duration: number
  costs: number | null
  completed_at: string | null
  updated_at: string
  list: {
    id: string
    name: string
    members: string[]
  }
}

export default function TravelDetails() {
  const { id } = useLocalSearchParams()
  const [status, setStatus] = useState<'pending' | 'done' | 'error'>('pending')
  const [details, setDetails] = useState<TravelDetailsProps>()

  async function getTravelDetails() {
    setStatus('pending')

    try {
      const { data } = await api.get(`/travels/${id}`)

      setDetails(data.travel)
      setStatus('done')
    } catch (err) {
      setStatus('error')
      if (err instanceof AxiosError) {
        console.log(err.response?.data)
      }

      console.log({ err })
    }
  }

  useEffect(() => {
    getTravelDetails()
  }, [])

  if (!details || status === 'pending') {
    return (
      <View className="items-center justify-center flex-1 bg-dark-800">
        <ActivityIndicator color={colors.violet[600]} size={44} />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-marigold-400">
      {details.cover_photo ? (
        <View className="absolute top-0 w-full h-96 ">
          <Image
            alt={`travel-cover-${id}`}
            source={{ uri: details.cover_photo }}
            className="w-full h-full -z-10"
          />
        </View>
      ) : (
        <View className="absolute items-center justify-center w-full -top-3 h-96 -z-10 bg-marigold-300">
          <Text className="font-bold uppercase text-9xl text-marigold-600">
            {details.destination.charAt(0)}
          </Text>
        </View>
      )}

      <SafeAreaView className="justify-between flex-1">
        <Header />
        <View className="h-[60%]">
          <ContentTab className="relative" showHandle={false}>
            <CountryBadge country={details.country} />
            <View className="w-full h-full pt-2 space-y-4">
              <Text className="text-3xl font-bold text-purple-100">
                {details.destination}
              </Text>
              <View className="justify-between flex-1 px-2 space-y-4">
                <View className="space-y-3">
                  <View className="flex-row justify-between">
                    <Details
                      icon={Calendar}
                      name="Partida"
                      value={dayjs(details.start_date).format('DD MMM. YYYY')}
                    />
                    <Details
                      icon={Clock}
                      name="Duração"
                      value={`${details.duration} dia${
                        details.duration > 1 ? 's' : ''
                      }`}
                    />
                  </View>
                  <View>
                    <Details
                      icon={Map}
                      name="Lista de Viagens"
                      value={details.list.name}
                    />
                  </View>
                </View>
                <View className="flex-row space-x-6">
                  {details.costs && (
                    <View className="px-5 py-2 space-y-2 rounded-lg bg-marigold-400">
                      <Text className="font-bold text-dark-800">Passagem</Text>
                      <View>
                        <Text className="text-sm text-dark-700">
                          a partir de
                        </Text>
                        <Text className="text-2xl font-bold text-dark-800">
                          {details.costs.toLocaleString('pt-br', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </Text>
                      </View>
                    </View>
                  )}
                  {details.transportation_id && (
                    <View className="px-5 py-2 space-y-2 rounded-lg bg-lime-300">
                      <Text className="font-bold text-dark-800">
                        Transporte
                      </Text>
                      <Plane size={48} className="text-dark-800" />
                    </View>
                  )}
                </View>
                <View className="space-y-1">
                  <Text className="text-base font-bold text-purple-100">
                    Membros da viagem
                  </Text>
                  <Link href={`/lists/${details.list.id}?page=members`} asChild>
                    <Pressable className="flex-row items-center justify-between w-full h-20 px-3 rounded-lg bg-dark-700">
                      <MembersPreview
                        names={details.list.members}
                        iconClassName="w-10 h-10"
                      />
                      <Text className="text-base text-purple-100">Mostrar</Text>
                      <View className="items-center justify-center w-12 h-12 rounded-lg bg-marigold-400">
                        <ChevronRight size={24} className="text-dark-700" />
                      </View>
                    </Pressable>
                  </Link>
                </View>
              </View>
            </View>
          </ContentTab>
        </View>
      </SafeAreaView>
    </View>
  )
}

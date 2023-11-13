import { useEffect, useState } from 'react'
import {
  View,
  ScrollView,
  Text,
  Pressable,
  SafeAreaView,
  TextInput,
  Platform,
  Image,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import dayjs from 'dayjs'
import { ImageIcon } from 'lucide-react-native'

import { api } from '@libs/axios'
import { ScreenStatus } from '@interfaces/app'
import { ListDetailsProps } from '@interfaces/lists'

import { DatePicker } from '@components/ui/DatePicker'
import { AndroidDatePicker } from '@components/ui/AndroidDatePicker'
import { Header } from '@components/partials/Header'
import { FormField } from '@components/ui/FormField'
import { Loading } from '@components/ui/Loading'
import { AxiosError } from 'axios'

export default function NewTravel() {
  const { listId } = useLocalSearchParams()
  const [status, setStatus] = useState<ScreenStatus>('pending')
  const [list, setList] = useState<ListDetailsProps>()

  // const firstDayOfNextMonth = dayjs().add(1, 'M').startOf('M').toDate()

  // Form Values
  const [destination, setDestination] = useState<string>()
  const [cover, setCover] = useState<string | null>(null)
  const [country, setCountry] = useState<string>()
  const [duration, setDuration] = useState<number>()
  const [costs, setCosts] = useState<number>()
  const [startAt, setStartAt] = useState<Date>()

  function clearForm() {
    setDestination(undefined)
    setCountry(undefined)
    setDuration(undefined)
    setCosts(undefined)
    setStartAt(undefined)
  }

  async function getList() {
    setStatus('pending')

    try {
      const { data } = await api.get(`/lists/${listId}`)

      setList(data.list)
      setStatus('done')
    } catch (err) {
      setStatus('error')
      console.log({ err })
    }
  }

  function handleCostsChange(value: string) {
    if (!value) {
      return setCosts(undefined)
    }

    let costsValue = parseInt(value)

    if (Number.isNaN(costsValue)) {
      const numericValue = value
        .split(/\s+/)[1]
        ?.replaceAll('.', '')
        .replace(',', '')

      costsValue = parseFloat(numericValue) / 100
    }

    return setCosts(costsValue)
  }

  function handleDurationChange(value: string) {
    if (!value) {
      return setDuration(undefined)
    }

    const duration = parseInt(value)

    if (Number.isNaN(duration)) {
      return setDuration(undefined)
    }

    if (duration === 0) {
      return setDuration(1)
    }

    return setDuration(duration)
  }

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      })

      if (result.assets && result.assets[0]) {
        setCover(result.assets[0].uri)
      }
    } catch (err) {}
  }

  async function uploadCover() {
    try {
      const uploadFormData = new FormData()

      uploadFormData.append('file', {
        uri: cover,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as any)

      const { data } = await api.post('/travels/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return data.fileUrl as string
    } catch (err) {
      return null
    }
  }

  async function handleSubmit() {
    setStatus('pending')

    let coverUrl: string | null = null

    if (cover) {
      coverUrl = await uploadCover()

      if (!coverUrl) {
        return
      }
    }

    try {
      const { data, status } = await api.post(`/lists/${listId}/travels`, {
        destination,
        country,
        duration,
        costs: costs ? costs * 100 : undefined,
        coverUrl: coverUrl || undefined,
        startAt,
      })

      if (status === 201) {
        console.log(data)

        setStatus('done')
        clearForm()

        router.back()
      }
    } catch (err) {
      setStatus('error')
      console.log({ err })
    }
  }

  useEffect(() => {
    getList()
  }, [listId])

  // console.log({ listId })

  if (!list || status === 'pending') {
    return <Loading />
  }

  return (
    <SafeAreaView className="items-center flex-1 bg-dark-800">
      {/* Header */}
      <Header title={list.name} />
      <View className="items-center justify-between w-full">
        <View className="w-full py-3 pb-64 mt-4 space-y-4 px-7">
          <Text className="text-2xl font-bold text-purple-100">
            Nova Viagem
          </Text>
          {/* Form */}
          <ScrollView className="w-full px-1 py-1 space-y-6">
            {/* FormInput */}
            <FormField title="Foto de Capa">
              <Pressable
                className="items-center justify-center w-4/5 h-40 bg-purple-400 rounded-xl"
                onPress={openImagePicker}
              >
                {cover ? (
                  <Image
                    alt="travel-preview"
                    source={{ uri: cover }}
                    className="object-cover w-full h-full rounded-xl"
                  />
                ) : (
                  <>
                    <ImageIcon size={32} className="text-purple-500" />
                    <Text className="text-sm text-purple-500">
                      Clique para escolher uma foto
                    </Text>
                  </>
                )}
              </Pressable>
            </FormField>

            {/* FormInput */}
            <FormField title="Destino">
              <TextInput
                placeholder="Para onde você vai?"
                value={destination}
                onChangeText={setDestination}
                placeholderTextColor="#56565A"
                className="w-full px-4 py-2 text-purple-100 rounded-lg bg-dark-700 placeholder:text-dark-300"
              />
            </FormField>

            {/* FormInput */}
            <FormField title="País" className="w-2/3">
              <TextInput
                value={country}
                onChangeText={setCountry}
                placeholderTextColor="#56565A"
                className="w-full px-4 py-2 text-purple-100 rounded-lg bg-dark-700 placeholder:text-dark-300"
              />
            </FormField>
            <View className="flex-row space-x-4">
              {/* FormInput */}
              <FormField title="Inicío" className="w-1/2">
                {Platform.OS === 'android' ? (
                  <AndroidDatePicker date={startAt} setDate={setStartAt} />
                ) : (
                  <DatePicker date={startAt} setDate={setStartAt} />
                )}
              </FormField>
              {/* FormInput */}
              <FormField
                title="Duração"
                subtitle="(em dias)"
                className="flex-1"
              >
                <TextInput
                  value={duration?.toString()}
                  onChangeText={handleDurationChange}
                  keyboardType="numeric"
                  placeholderTextColor="#56565A"
                  className="w-full px-4 py-2 text-purple-100 rounded-lg bg-dark-700 placeholder:text-dark-300"
                />
              </FormField>
            </View>
            {/* FormInput */}
            <FormField
              title="Custo Estimado"
              subtitle="(em R$)"
              className="w-2/3 mb-4"
            >
              <TextInput
                value={costs?.toLocaleString('pt-br', {
                  style: 'currency',
                  currency: 'BRL',
                })}
                onChangeText={handleCostsChange}
                keyboardType="numeric"
                placeholderTextColor="#56565A"
                className="w-full px-4 py-2 text-purple-100 rounded-lg bg-dark-700 placeholder:text-dark-300"
              />
            </FormField>
          </ScrollView>
        </View>
      </View>
      <Pressable
        onPress={handleSubmit}
        className="items-center justify-center w-9/12 py-3 mt-auto mb-6 bg-purple-500 rounded-lg"
      >
        <Text className="text-lg font-bold uppercase text-dark-800">
          Adicionar
        </Text>
      </Pressable>
    </SafeAreaView>
  )
}

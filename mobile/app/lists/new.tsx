import { useState } from 'react'
import { View, Text, Pressable, Alert, Image } from 'react-native'
import { router } from 'expo-router'
import { TextInput } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image as ImageIcon } from 'lucide-react-native'
import * as ImagePicker from 'expo-image-picker'

import { api } from '@libs/axios'

import { Header } from '@components/partials/Header'
import { FormField } from '@components/ui/FormField'
import { getSecureItem } from '@services/secure-storage'
import { MembersModal } from '@components/partials/MembersModal'

export default function NewList() {
  const [name, setName] = useState<string>()
  const [members, setMembers] = useState<string[]>([])
  const [showMembersModal, setShowMembersModal] = useState<boolean>(false)
  const [cover, setCover] = useState<string | null>(null)

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
        name: 'list_image.jpg',
        type: 'image/jpeg',
      } as any)

      const { data } = await api.post('/lists/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return data.fileUrl as string
    } catch (err) {
      console.log({ err })
      return null
    }
  }

  async function handleSubmit() {
    let coverUrl: string | null = null

    if (cover) {
      coverUrl = await uploadCover()

      if (!coverUrl) {
        return
      }
    }

    try {
      const token = await getSecureItem('session')

      await api.post(
        '/lists',
        {
          name,
          members,
          cover: coverUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      router.push({
        pathname: '/lists/',
        params: { update: new Date().toISOString() },
      })
    } catch (err) {
      console.log(err)
      return Alert.alert('Error', 'Não foi possivel criar a lista.')
    }
  }

  return (
    <>
      <SafeAreaView className="items-center flex-1 bg-dark-800">
        {/* Header */}
        <Header title="Listas" />
        <View className="items-center justify-between w-full">
          <View className="w-full py-3 mt-4 space-y-4 px-7">
            <Text className="text-2xl font-bold text-purple-100">
              Nova Lista
            </Text>
            {/* Form */}
            <View className="w-full px-2 py-1 space-y-6">
              {/* FormInput */}
              {/* FormInput */}
              <FormField title="Foto de Capa">
                <Pressable
                  className="items-center justify-center w-4/5 h-40 bg-purple-400 rounded-xl"
                  onPress={openImagePicker}
                >
                  {cover ? (
                    <Image
                      alt="list-preview"
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
              <FormField title="Nome">
                <TextInput
                  placeholder="Como você quer chamar a lista?"
                  placeholderTextColor="#56565A"
                  className="w-full px-4 py-2 text-purple-100 rounded-lg bg-dark-700 placeholder:text-dark-300"
                  onChangeText={setName}
                />
              </FormField>

              {/* FormInput */}
              <FormField title="Membros" subtitle="(opcional)">
                <Pressable
                  onPress={() => setShowMembersModal(true)}
                  className="items-center w-56 py-3 rounded-lg bg-marigold-400"
                >
                  <Text className="font-bold text-dark-800">
                    Quem vai participar?
                  </Text>
                </Pressable>
              </FormField>
            </View>
          </View>
        </View>
        <Pressable
          onPress={handleSubmit}
          className="items-center justify-center w-9/12 py-3 mt-auto mb-6 bg-purple-500 rounded-lg"
        >
          <Text className="text-lg font-bold uppercase text-dark-800">
            Salvar Lista
          </Text>
        </Pressable>
      </SafeAreaView>
      <MembersModal
        isVisible={showMembersModal}
        setIsVisible={setShowMembersModal}
        members={members}
        setMembers={setMembers}
      />
    </>
  )
}

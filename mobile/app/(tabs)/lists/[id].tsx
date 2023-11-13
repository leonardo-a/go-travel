import { Header } from '@components/partials/Header'
import { TravelsGrid } from '@components/partials/TravelsGrid'
import { ContentList } from '@components/ui/ContentList'
import { FriendItem } from '@components/ui/FriendItem'
import { Loading } from '@components/ui/Loading'
import { TravelProps } from '@interfaces/lists'
import { api } from '@libs/axios'
import { cn } from '@utils/merge'
import { AxiosError } from 'axios'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Pressable, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Member {
  id: string
  name: string
  status?: string
}

export default function ListDetails() {
  const { id, page } = useLocalSearchParams()

  const [status, setStatus] = useState<'pending' | 'done' | 'error'>('pending')
  const [content, setContent] = useState<'travels' | 'members'>('travels')
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [members, setMembers] = useState<Member[]>([])
  const [travels, setTravels] = useState<TravelProps[]>([])

  async function getListData() {
    setStatus('pending')

    // Members
    try {
      const { data } = await api.get(`/lists/${id}/members`)

      setMembers(data.members)
    } catch (err) {
      setStatus('error')
      console.log(err)

      return
    }

    // Travels
    try {
      const { data } = await api.get(`/lists/${id}/travels`)

      setTravels(data.travels)
    } catch (err) {
      setStatus('error')
      if (err instanceof AxiosError) {
        console.log(err.response?.data)
      }

      console.log(err)

      return
    }

    setStatus('done')
  }

  useEffect(() => {
    if (page === 'members') {
      setContent('members')
    } else {
      setContent('travels')
    }
  }, [page])

  useFocusEffect(
    useCallback(() => {
      getListData()
      return () => {
        setMembers([])
        setTravels([])
      }
    }, []),
  )

  // useEffect(() => {
  //   getListData()
  // }, [])

  function handleContentChange(page: 'travels' | 'members', search?: boolean) {
    router.setParams({ page })
    setShowSearch(!!search)
  }

  if (status === 'pending') {
    return <Loading />
  }

  return (
    <View className="flex-1 bg-dark-800">
      <SafeAreaView className="flex-1">
        <Header title="Detalhes da Lista" />
        {/* Friends Tabs */}
        <View className="flex-row justify-center w-full px-6 mt-3 mb-6 ">
          <Pressable
            onPress={() => handleContentChange('travels', false)}
            className={cn([
              'w-1/3 rounded-lg py-2  items-center justify-center',
              content === 'travels' && 'bg-purple-600',
            ])}
          >
            <Text className="text-base font-bold text-purple-100">Viagens</Text>
          </Pressable>
          <Pressable
            onPress={() => handleContentChange('members', false)}
            className={cn([
              'w-1/3 rounded-lg py-2 items-center justify-center',
              content === 'members' && 'bg-purple-600',
            ])}
          >
            <Text className="text-base font-bold text-purple-100">Membros</Text>
          </Pressable>
        </View>
        {content === 'travels' ? (
          <TravelsGrid
            listId={id as string}
            data={travels}
            search={showSearch}
          />
        ) : (
          <ContentList search={showSearch}>
            {members.map((member, index) => (
              <FriendItem key={`list-member-${index}`} name={member.name} />
            ))}
          </ContentList>
        )}
      </SafeAreaView>
    </View>
  )
}

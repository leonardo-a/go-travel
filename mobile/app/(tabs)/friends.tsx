import { AddFriendModal } from '@components/partials/AddFriendModal'
import { Header } from '@components/partials/Header'
import { ContentList } from '@components/ui/ContentList'
import { FriendItem } from '@components/ui/FriendItem'
import { Loading } from '@components/ui/Loading'
import { FriendProps } from '@interfaces/users'
import { api } from '@libs/axios'
import { cn } from '@utils/merge'
import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Pressable, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Friends() {
  const { refresh, page } = useLocalSearchParams()

  const [status, setStatus] = useState<'pending' | 'done' | 'error'>('pending')
  const [content, setContent] = useState<'friends' | 'sent' | 'received'>(
    'friends',
  )
  const [friends, setFriends] = useState<FriendProps[]>([])
  const [sent, setSent] = useState<FriendProps[]>([])
  const [received, setReceived] = useState<FriendProps[]>([])
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [showSearch, setShowSearch] = useState<boolean>(true)

  async function getFriends() {
    setStatus('pending')

    // Accepted Friends
    try {
      const { data } = await api.get('/friends/search')

      setFriends(data.friends)
    } catch (err) {
      setStatus('error')
      console.log(err)

      return
    }

    // Pending Friends
    try {
      const { data } = await api.get('/friends/search?accepted=false')

      // const pendingFriend as  as [] = data.friends

      const requestsSent: FriendProps[] = []
      const requestsReceived: FriendProps[] = []

      data.friends.forEach((friend: FriendProps) => {
        if (friend.requestedByMe) {
          requestsSent.push(friend)
        } else {
          requestsReceived.push(friend)
        }
      })

      setSent(requestsSent)
      setReceived(requestsReceived)
    } catch (err) {
      setStatus('error')
      console.log(err)

      return
    }

    setStatus('done')
  }

  // useFocusEffect(
  //   useCallback(() => {
  //     getFriends()
  //     return () => {
  //       setStatus('pending')
  //       setFriends([])
  //       setReceived([])
  //       setSent([])
  //     }
  //   }, []),
  // )

  useEffect(() => {
    getFriends()

    if (refresh) {
      setContent('friends')
    }
  }, [refresh])

  function handleContentChange(
    page: 'friends' | 'sent' | 'received',
    search?: boolean,
  ) {
    setContent(page)
    setShowSearch(!!search)
  }

  function renderList() {
    let data: FriendProps[]
    let type: 'default' | 'sent' | 'received'
    if (content === 'received') {
      type = 'received'
      data = received
    } else if (content === 'sent') {
      type = 'sent'
      data = sent
    } else {
      type = 'default'
      data = friends
    }

    return data.map((item, index) => {
      return (
        <FriendItem
          key={`friend-${content}-${index}`}
          id={item.id}
          name={item.name}
          username={item.username}
          type={type}
        />
      )
    })
  }

  if (status === 'pending') {
    return <Loading />
  }

  return (
    <View className="flex-1 bg-dark-800">
      <SafeAreaView className="flex-1">
        <Header title="Amigos" />
        {/* Friends Tabs */}
        <View className="flex-row w-full px-6 mt-3 mb-6 ">
          <Pressable
            onPress={() => handleContentChange('friends', true)}
            className={cn([
              'w-1/3 rounded-lg py-2  items-center justify-center',
              content === 'friends' && 'bg-purple-600',
            ])}
          >
            <Text className="text-base font-bold text-purple-100">Amigos</Text>
          </Pressable>
          <Pressable
            onPress={() => handleContentChange('sent')}
            className={cn([
              'w-1/3 rounded-lg py-2  items-center justify-center',
              content === 'sent' && 'bg-purple-600',
            ])}
          >
            <Text className="text-base font-bold text-purple-100">
              Enviados
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleContentChange('received')}
            className={cn([
              'w-1/3 rounded-lg py-2  items-center justify-center',
              content === 'received' && 'bg-purple-600',
            ])}
          >
            <Text className="text-base font-bold text-purple-100">
              Recebidos
            </Text>
          </Pressable>
        </View>
        <ContentList search={showSearch}>
          {content === 'friends' && (
            <FriendItem
              name="Adicionar amigo"
              action="add"
              onPress={() => setShowAddModal(true)}
            />
          )}
          {renderList()}
        </ContentList>
      </SafeAreaView>
      <AddFriendModal isVisible={showAddModal} setIsVisible={setShowAddModal} />
    </View>
  )
}

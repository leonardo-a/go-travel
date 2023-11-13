import { FriendItem } from '@components/ui/FriendItem'
import { Loading } from '@components/ui/Loading'
import { TextInput } from '@components/ui/TextInput'
import { ScreenStatus } from '@interfaces/app'
import { UserProps } from '@interfaces/users'
import { api } from '@libs/axios'
import { Users, X } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Modal, View, Text, ScrollView, Pressable } from 'react-native'

interface AddFriendModalProps {
  isVisible: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddFriendModal({
  isVisible,
  setIsVisible,
}: AddFriendModalProps) {
  const [status, setStatus] = useState<ScreenStatus>('done')
  const [users, setUsers] = useState<UserProps[]>([])
  const [search, setSearch] = useState<string>()

  async function getUsers(search: string) {
    // if (search.length < 3) {
    //   return
    // }

    setStatus('pending')

    try {
      const { data } = await api.get('/users', { params: { q: search } })

      setUsers(data.users)
      setStatus('done')
    } catch (err) {
      console.log({ err })
      setStatus('error')
    }
  }

  useEffect(() => {
    if (search) {
      getUsers(search)
    } else {
      setUsers([])
    }
  }, [search])

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        setIsVisible(false)
      }}
    >
      <View className="items-center justify-center flex-1 w-full bg-dark-900/90">
        <View className="justify-between w-5/6 rounded-lg bg-dark-800 h-3/5">
          <View className="items-end w-full">
            <Pressable
              onPress={() => {
                setIsVisible(false)
              }}
              className="px-4 py-3"
            >
              <X size={16} className="text-ruby-500" />
            </Pressable>
          </View>
          <View className="flex-1 px-5 pb-5 space-y-5">
            <TextInput
              placeholder="digite um nome ou usuário..."
              onChangeText={setSearch}
            />
            {status === 'pending' && <Loading />}
            {status === 'done' && (
              <View className="flex-1 w-full px-1 rounded-lg bg-dark-700">
                {users.length > 0 ? (
                  <ScrollView className="flex-1 w-full">
                    {users.map((user, index) => {
                      return (
                        <FriendItem
                          key={`found-user-${index}`}
                          name={user.name}
                          id={user.id}
                          username={user.username}
                          type="request"
                          className="my-2"
                        />
                      )
                    })}
                  </ScrollView>
                ) : (
                  <View className="items-center justify-center flex-1 px-5 space-y-5">
                    <Text className="text-lg font-bold text-center text-dark-500">
                      Procure novos amigos para suas viagens!
                    </Text>
                    <Users size={48} className="text-dark-500" />
                  </View>
                )}
              </View>
            )}
            {status === 'error' && (
              <View className="items-center justify-center flex-1 px-5">
                <Text className="text-lg font-bold text-center text-ruby-500">
                  Não foi possível buscar por usuários
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}

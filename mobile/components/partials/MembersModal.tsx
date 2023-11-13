import React, { useEffect, useState } from 'react'
import {
  Modal,
  View,
  Pressable,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { X, Check } from 'lucide-react-native'
import colors from 'tailwindcss/colors'
import { FriendProps } from '@interfaces/users'
import { api } from '@libs/axios'
import { ScreenStatus } from '@interfaces/app'
import { FriendItem } from '@components/ui/FriendItem'
import { cn } from '@utils/merge'

interface MembersModalProps {
  isVisible: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  members: string[]
  setMembers: React.Dispatch<React.SetStateAction<string[]>>
}

export function MembersModal({
  isVisible,
  setIsVisible,
  members,
  setMembers,
}: MembersModalProps) {
  const [friends, setFriends] = useState<FriendProps[]>([])
  const [status, setStatus] = useState<ScreenStatus>('pending')

  async function getFriends() {
    setStatus('pending')
    try {
      const { data } = await api.get('/friends/search')

      setFriends(data.friends)
      setStatus('done')
    } catch (err) {
      console.log(err)
      setStatus('error')
    }
  }

  function toogleSelection(id: string) {
    if (members.includes(id)) {
      setMembers(members.filter((item) => item !== id))
    } else {
      setMembers([id, ...members])
    }
  }

  function handleCancel() {
    setIsVisible(false)
    setMembers([])
  }

  function handleSubmit() {
    setIsVisible(false)
  }

  useEffect(() => {
    if (isVisible) {
      getFriends()
    }
  }, [isVisible])

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        setIsVisible(false)
      }}
    >
      <View className="items-center justify-center flex-1 w-full bg-dark-900/40">
        <View className="justify-between w-5/6 p-5 space-y-5 rounded-lg bg-dark-700 h-3/5">
          {status === 'pending' && (
            <View className="items-center justify-center flex-1">
              <ActivityIndicator color={colors.purple[600]} />
            </View>
          )}
          {status === 'done' && (
            <ScrollView className="flex-1">
              {friends.map((friend, index) => {
                return (
                  <View
                    key={`friend-${index}`}
                    className="relative justify-center"
                  >
                    <FriendItem
                      name={friend.name}
                      username={friend.username}
                      onPress={() => toogleSelection(friend.friendId)}
                    />
                    <Pressable
                      onPress={() => toogleSelection(friend.friendId)}
                      className={cn([
                        'absolute right-2 w-8 h-8 border rounded-lg border-lime-400 bg-dark-800 items-center justify-center',
                        members.includes(friend.friendId) && 'bg-lime-400',
                      ])}
                    >
                      {members.includes(friend.friendId) && (
                        <Check className="text-dark-800" size={24} />
                      )}
                    </Pressable>
                  </View>
                )
              })}
            </ScrollView>
          )}
          {status === 'error' && (
            <View className="items-center justify-center flex-1">
              <Text className="text-xl font-bold text-center text-ruby-500">
                Não foi possível carregar sua lista de amigos
              </Text>
            </View>
          )}
          <View className="flex-row justify-end w-full space-x-4">
            <Pressable
              onPress={handleCancel}
              className="flex-row items-center justify-center px-4 py-2 space-x-2 rounded-lg bg-ruby-400"
            >
              <Text className="font-bold text-dark-700">Cancelar</Text>
              <X size={20} className="text-dark-700" />
            </Pressable>
            {status === 'done' && (
              <Pressable
                onPress={handleSubmit}
                className="flex-row items-center justify-center px-3 py-2.5 space-x-2 rounded-lg bg-lime-400"
              >
                <Text className="font-bold text-dark-700">Convidar</Text>
                <Check size={20} className="text-dark-700" />
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}

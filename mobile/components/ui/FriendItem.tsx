import { api } from '@libs/axios'
import { cn } from '@utils/merge'
import { router } from 'expo-router'
import { Plus, UserMinus, UserPlus, X } from 'lucide-react-native'
import { Pressable, View, Text, PressableProps } from 'react-native'

interface FriendItemProps extends PressableProps {
  id?: string
  name: string
  username?: string
  status?: string
  type?: 'default' | 'sent' | 'received' | 'request'
  action?: 'default' | 'add'
}

export function FriendItem({
  id,
  name,
  action,
  username,
  type,
  ...props
}: FriendItemProps) {
  async function handleFriendRequest(accepted: boolean) {
    if (!id) {
      return
    }

    await api.patch(`/friends/request`, {
      friendRequestId: id,
      accepted,
    })

    router.setParams({ refresh: new Date().toString(), page: 'friends' })
  }

  async function handleSendFriendRequest() {
    if (!username) {
      return
    }

    const { data } = await api.post('/friends/request', {
      username,
    })

    router.setParams({ refresh: new Date().toString(), page: 'friends' })
  }

  return (
    <Pressable
      className="flex-row items-center justify-between w-full h-14"
      {...props}
    >
      <View
        className={cn([
          'flex-row items-center space-x-4 w-full',
          type === 'received' && 'w-[60%]',
          (type === 'sent' || type === 'request') && 'w-[80%]',
        ])}
      >
        {action === 'add' ? (
          <View className="items-center justify-center w-12 h-12 rounded-full bg-tiger-400">
            <Plus size={28} className="text-dark-800" />
          </View>
        ) : (
          <View className="items-center justify-center w-12 h-12 bg-purple-700 rounded-full">
            <Text className="text-xl font-bold text-dark-700">
              {name.charAt(0)}
            </Text>
          </View>
        )}
        <View className="justify-center h-full">
          <Text
            className={cn([
              'text-lg font-bold text-purple-100',
              !username && 'my-auto',
            ])}
          >
            {name}
          </Text>
          {username && (
            <Text className="text-sm text-purple-200">{username}</Text>
          )}
        </View>
      </View>
      {type === 'received' && (
        <View className="flex-row space-x-3">
          <Pressable
            className="h-full p-2"
            onPress={() => handleFriendRequest(true)}
          >
            <UserPlus size={32} className="text-lime-400" />
          </Pressable>
          <Pressable
            className="h-full p-2"
            onPress={() => handleFriendRequest(false)}
          >
            <UserMinus size={32} className="text-ruby-400" />
          </Pressable>
        </View>
      )}
      {type === 'sent' && (
        <Pressable
          className="h-full p-2"
          onPress={() => handleFriendRequest(false)}
        >
          <X size={32} className="text-ruby-400 my-auto" />
        </Pressable>
      )}
      {type === 'request' && (
        <Pressable
          className="h-full py-2 px-3"
          onPress={() => handleSendFriendRequest()}
        >
          <UserPlus size={32} className="text-lime-400" />
        </Pressable>
      )}
    </Pressable>
  )
}

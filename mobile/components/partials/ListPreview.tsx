import { Pressable, View, Text, Image } from 'react-native'
import { Link } from 'expo-router'

import { cn } from '@utils/merge'

import { MembersPreview } from './MembersPreview'

interface ListPreviewProps {
  id: string
  name: string
  members: string[]
  cover: string | null
}

export function ListPreview({ id, name, members, cover }: ListPreviewProps) {
  return (
    <Link href={`/lists/${id}`} asChild>
      <Pressable className="flex-row items-center px-3 space-x-2 rounded-lg w-60 h-28 bg-dark-700">
        <View className="w-20 h-20">
          {cover ? (
            <Image
              alt={`travel-cover-${id}`}
              source={{ uri: cover }}
              className="w-full h-full rounded-lg"
            />
          ) : (
            <View className="items-center justify-center w-full h-full bg-purple-300 rounded-lg">
              <Text className="text-xl font-bold text-purple-700 uppercase">
                {name.charAt(0)}
              </Text>
            </View>
          )}
        </View>
        <View
          className={cn([
            'justify-between h-20',
            members.length === 0 && 'justify-center',
          ])}
        >
          <Text className="text-xl font-bold text-purple-100">{name}</Text>
          {members.length > 0 && (
            <View className="py-1">
              <Text className="text-xs text-purple-100">Membros</Text>
              {/* Member List Preview */}

              <MembersPreview names={members} />
            </View>
          )}
        </View>
      </Pressable>
    </Link>
  )
}

import { Link } from 'expo-router'
import { Pressable, View, Text } from 'react-native'
import { MembersPreview } from './MembersPreview'
import { cn } from '@utils/merge'

interface ListPreviewProps {
  id: string
  name: string
  members: string[]
}

export function ListPreview({ id, name, members }: ListPreviewProps) {
  return (
    <Link href={`/lists/${id}`} asChild>
      <Pressable className="flex-row items-center px-3 space-x-2 rounded-lg w-60 h-28 bg-dark-700">
        <View className="items-center justify-center w-20 h-20 bg-purple-300 rounded-lg">
          <Text className="text-xl font-bold text-purple-700 uppercase">
            {name.charAt(0)}
          </Text>
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

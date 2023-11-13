import { Pressable, View } from 'react-native'
import { Search } from 'lucide-react-native'

import { cn } from '@utils/merge'

import { TextInput } from './TextInput'
import { ScrollRefresh } from './ScrollRefresh'

interface ContentListProps {
  children: React.ReactNode
  listClassName?: string
  search?: boolean
  refreshing?: boolean
  onRefresh?: () => void
}

export function ContentList({
  children,
  listClassName,
  search,
  refreshing,
  onRefresh,
}: ContentListProps) {
  return (
    <View className={cn(['flex-1 w-full px-6 space-y-4', listClassName])}>
      {search && (
        <View className="flex-row justify-between">
          <TextInput
            className="w-10/12 h-10"
            placeholder="procurar por nome..."
          />
          <Pressable className="items-center justify-center w-10 h-10 p-2 rounded-lg bg-marigold-400">
            <Search size={20} className="text-dark-800 " />
          </Pressable>
        </View>
      )}
      <View className="flex-1 w-full p-3 rounded-lg bg-dark-700">
        <ScrollRefresh
          refreshing={refreshing || false}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          className="space-y-3"
        >
          {children}
        </ScrollRefresh>
      </View>
    </View>
  )
}

import { ListProps } from '@interfaces/lists'
import { Plus } from 'lucide-react-native'
import { Pressable, PressableProps, View, Text, Image } from 'react-native'

interface ListItemProps extends PressableProps {
  list?: ListProps
  action?: 'default' | 'add'
}

export function ListItem({ action, list, ...props }: ListItemProps) {
  const title = list ? list.name : 'Nova Lista'
  return (
    <Pressable
      className="flex-row items-center w-full h-16 space-x-4"
      {...props}
    >
      {action === 'add' ? (
        <View className="items-center justify-center w-16 h-16 rounded-lg bg-tiger-400">
          <Plus size={32} className="text-dark-800" />
        </View>
      ) : list && list.coverUrl ? (
        <Image
          alt={`travel-cover-${list.id}`}
          source={{ uri: list.coverUrl }}
          className="w-16 h-16 rounded-lg"
        />
      ) : (
        <View className="items-center justify-center w-16 h-16 bg-purple-700 rounded-lg">
          <Text className="text-xl font-bold uppercase">{title.charAt(0)}</Text>
        </View>
      )}

      <Text className="text-lg font-bold text-purple-100">{title}</Text>
    </Pressable>
  )
}

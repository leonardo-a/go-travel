import { Plus } from 'lucide-react-native'
import { Pressable, PressableProps, View, Text } from 'react-native'

interface ListItemProps extends PressableProps {
  name: string
  action?: 'default' | 'add'
}

export function ListItem({ action, name, ...props }: ListItemProps) {
  return (
    <Pressable
      className="h-16 w-full flex-row space-x-4 items-center"
      {...props}
    >
      {action === 'add' ? (
        <View className="w-16 h-16 rounded-lg bg-tiger-400 items-center justify-center">
          <Plus size={32} className="text-dark-800" />
        </View>
      ) : (
        <View className="w-16 h-16 rounded-lg bg-purple-700 items-center justify-center">
          <Text className="text-2xl font-bold">{name.charAt(0)}</Text>
        </View>
      )}

      <Text className="text-purple-100 font-bold text-lg">{name}</Text>
    </Pressable>
  )
}

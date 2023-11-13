import { Pressable, View, Text, StyleProp, ViewStyle } from 'react-native'
import { Link } from 'expo-router'
import { Plus } from 'lucide-react-native'

interface TravelPreviewProps {
  listId: string
  className?: string
  style?: StyleProp<ViewStyle>
}

export function TravelAdd({ listId, style }: TravelPreviewProps) {
  return (
    <Link style={style} href={`/travels/new?listId=${listId}`} asChild>
      <Pressable className="items-center justify-center w-40 p-2 space-y-2 rounded-lg h-52 bg-dark-700">
        <View className="items-center space-y-4">
          <View className="items-center justify-center w-16 h-16 rounded-full bg-tiger-400">
            <Plus size={40} className="text-dark-700" />
          </View>
          <Text className="text-purple-100">Nova Viagem</Text>
        </View>
      </Pressable>
    </Link>
  )
}

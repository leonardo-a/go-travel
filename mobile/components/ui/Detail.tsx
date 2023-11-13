import { LucideIcon } from 'lucide-react-native'
import { View, Text } from 'react-native'

interface DetailsProps {
  icon: LucideIcon
  name: string
  value: string
}

export function Details({ icon: Icon, name, value }: DetailsProps) {
  return (
    <View className="flex-row space-x-2 items-center">
      <Icon size={34} className="text-purple-600" />
      <View>
        <Text className="text-xs text-purple-200">{name}</Text>
        <Text className="text-base text-purple-100">{value}</Text>
      </View>
    </View>
  )
}

import { View, Text } from 'react-native'
import { MapPin } from 'lucide-react-native'

interface CountryBadgeProps {
  country: string
}

export function CountryBadge({ country }: CountryBadgeProps) {
  return (
    <View className="absolute z-10 flex-row items-center px-5 py-1 space-x-2 rounded-lg bg-violet-600/70 -top-12 right-5">
      <MapPin size={24} className="text-purple-100" />
      <Text className="text-xl font-bold text-purple-100">{country}</Text>
    </View>
  )
}

import { View, ActivityIndicator } from 'react-native'
import colors from 'tailwindcss/colors'

export default function Loading() {
  return (
    <View className="items-center justify-center flex-1 w-full bg-dark-800">
      <ActivityIndicator color={colors.purple[600]} />
    </View>
  )
}

import { View, ActivityIndicator } from 'react-native'
import colors from 'tailwindcss/colors'

export function Loading() {
  return (
    <View className="items-center justify-center flex-1 bg-dark-800">
      <ActivityIndicator color={colors.violet[600]} size={44} />
    </View>
  )
}

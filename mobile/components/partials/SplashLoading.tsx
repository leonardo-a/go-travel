import { ActivityIndicator, View } from 'react-native'
import colors from 'tailwindcss/colors'

import Logo from '@assets/vectors/logo.svg'
const size = 200
export function SplashLoading() {
  return (
    <View className="items-center justify-center flex-1 bg-dark-800">
      <View className="relative">
        <Logo width={size} height={size} />
        <View className="absolute w-[200px] -bottom-32">
          <ActivityIndicator size={48} color={colors.violet[700]} />
        </View>
      </View>
    </View>
  )
}

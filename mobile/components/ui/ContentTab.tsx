import { StyleProp, View, ViewStyle } from 'react-native'

interface ContentTabProps {
  className?: string
  showHandle?: boolean
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export function ContentTab({ children, showHandle, style }: ContentTabProps) {
  return (
    <View
      className="flex-1 w-full bg-dark-800 rounded-t-[32px] py-4 px-6"
      style={style}
    >
      {showHandle !== false && (
        <View className="items-center w-full">
          <View className="w-5/6 h-3 bg-purple-600 rounded-full" />
        </View>
      )}
      {children}
    </View>
  )
}

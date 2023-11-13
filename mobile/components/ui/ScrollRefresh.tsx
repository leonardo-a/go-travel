import { ScrollView, RefreshControl, ScrollViewProps } from 'react-native'

interface ScrollRefreshProps extends ScrollViewProps {
  refreshing: boolean
  onRefresh?: () => void
}

export function ScrollRefresh({
  onRefresh,
  refreshing,
  children,
  ...props
}: ScrollRefreshProps) {
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      {...props}
    >
      {children}
    </ScrollView>
  )
}

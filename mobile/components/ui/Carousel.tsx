import { LucideIcon } from 'lucide-react-native'
import { View, Text, FlatList, FlatListProps } from 'react-native'

interface CarouselProps<T> extends FlatListProps<T> {
  title: string
  icon: LucideIcon
}

export function Carousel<T>({
  title,
  icon: Icon,
  data,
  renderItem,
  style,
  ...props
}: CarouselProps<T>) {
  return (
    <View className="space-y-4" style={style}>
      <View className="flex-row space-x-4 items-center">
        <Icon size={24} className="text-purple-600" />
        <Text className="text-lg font-bold text-purple-100">{title}</Text>
      </View>
      <FlatList
        className="w-full"
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
        data={data}
        renderItem={renderItem}
        {...props}
      />
    </View>
  )
}

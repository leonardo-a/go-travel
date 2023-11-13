import { View, Text, Pressable, StyleProp, ViewStyle } from 'react-native'
import { Link } from 'expo-router'
import { ArrowRight } from 'lucide-react-native'

import Travelers from '../../assets/vectors/travelers.svg'
import { cn } from '@utils/merge'

interface EmptyListsProps {
  className?: string
  style?: StyleProp<ViewStyle>
}

export function EmptyLists({ className, style }: EmptyListsProps) {
  return (
    <View
      className={cn([
        'w-full h-full items-center justify-center space-y-8',
        className,
      ])}
      style={style}
    >
      <View className="w-2/3">
        <Text className="text-purple-100 text-lg font-bold text-center">
          Você ainda não possuí nenhuma lista de viagens
        </Text>
      </View>
      <Travelers />
      <Link href="/lists/new" asChild>
        <Pressable className="px-6 py-2 rounded-xl bg-purple-600">
          <View className="flex-row items-center justify-center space-x-2 leading-none">
            <ArrowRight size={20} className="text-purple-100" />
            <Text className="font-bold text-lg text-purple-100 leading-none">
              Comece a Planejar
            </Text>
          </View>
        </Pressable>
      </Link>
    </View>
  )
}

import {
  Pressable,
  View,
  Text,
  StyleProp,
  ViewStyle,
  Image,
} from 'react-native'
import { Link } from 'expo-router'
import dayjs from 'dayjs'
import { Calendar, MapPin } from 'lucide-react-native'

import { TravelProps } from '@interfaces/lists'

interface TravelPreviewProps {
  className?: string
  travel: TravelProps
  style?: StyleProp<ViewStyle>
  action?: 'default' | 'add'
}

export function TravelPreview({ style, travel }: TravelPreviewProps) {
  return (
    <Link style={style} href={`/travels/${travel.id}`} asChild>
      <Pressable className="items-center w-40 p-2 space-y-2 rounded-lg h-52 bg-dark-700">
        <View className="relative w-36 h-36">
          {travel.cover_photo ? (
            <Image
              alt={`travel-cover-${travel.id}`}
              source={{ uri: travel.cover_photo }}
              className="w-full h-full rounded-lg"
            />
          ) : (
            <View className="items-center justify-center w-full h-full rounded-lg bg-marigold-300">
              <Text className="text-3xl font-bold uppercase text-marigold-600">
                {travel.destination.charAt(0)}
              </Text>
            </View>
          )}
          <View className="absolute px-2 py-1 rounded-xl bg-purple-600/70 top-1 right-1">
            <View className="flex-row items-center space-x-1">
              <MapPin size={14} className="text-purple-100" />
              <Text className="text-xs text-purple-100">{travel.country}</Text>
            </View>
          </View>
        </View>
        <View className="justify-between flex-1 w-full">
          <Text
            numberOfLines={1}
            className="overflow-hidden font-bold text-purple-100"
          >
            {travel.destination}
          </Text>
          <View className="flex-row items-center space-x-1">
            <Calendar size={14} className="text-purple-600" />
            <Text className="text-xs text-purple-100">
              {dayjs(travel.start_date).format('DD/MM/YYYY')}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  )
}

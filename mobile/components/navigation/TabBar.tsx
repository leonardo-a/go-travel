import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { Home, Users, Map } from 'lucide-react-native'
import { View, Pressable } from 'react-native'

export function TabBar({ navigation }: BottomTabBarProps) {
  return (
    <View className="flex-row justify-center w-full py-2 itens-center space-x-14 bg-dark-800">
      <Pressable
        className="items-center justify-center w-16 h-16 my-auto"
        onPress={() => router.replace('/home')}
      >
        <Home size={24} className="text-purple-100" />
      </Pressable>
      <Pressable
        className="p-1 border border-purple-700 rounded-full"
        onPress={() => router.push('/lists/')}
      >
        <LinearGradient
          // Button Linear Gradient
          colors={['#F46D01', '#5C2BB1']}
          start={{ x: 1, y: 0.1 }}
          end={{ x: 0, y: 0.4 }}
          className="flex items-center justify-center w-16 h-16 rounded-full"
        >
          <Map size={24} className="text-purple-100" />
        </LinearGradient>
      </Pressable>
      <Pressable
        className="items-center justify-center w-16 h-16 my-auto"
        onPress={() => navigation.navigate('friends')}
      >
        <Users size={24} className="text-purple-100" />
      </Pressable>
    </View>
  )
}

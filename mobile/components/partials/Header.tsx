import { Button } from '@components/ui/Button'
import { router, usePathname } from 'expo-router'
import { ChevronLeft, LogOut, User } from 'lucide-react-native'
import { View, Text } from 'react-native'
import { useAuth } from '../../contexts/auth'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  const currentPath = usePathname()
  const auth = useAuth()

  return (
    <View className="flex-row items-center justify-between w-full px-6 py-4">
      {router.canGoBack() ? (
        <Button onPress={() => router.back()}>
          <ChevronLeft size={32} className="text-purple-100" />
        </Button>
      ) : (
        <View className="w-1 h-1" />
      )}
      {title && <Text className="text-lg text-purple-100">{title}</Text>}
      {currentPath === '/profile' ? (
        <Button onPress={() => auth.signOut()}>
          <LogOut size={28} className="text-ruby-400" />
        </Button>
      ) : (
        <Button onPress={() => router.push('/profile')}>
          <User size={32} className="text-purple-100" />
        </Button>
      )}
    </View>
  )
}

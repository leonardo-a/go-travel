import { Tabs } from 'expo-router'
import { TabBar } from '@components/navigation/TabBar'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="home"
      tabBar={TabBar}
    />
  )
}

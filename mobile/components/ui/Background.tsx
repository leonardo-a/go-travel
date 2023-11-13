import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

interface BackgroundProps {
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
  className?: string
}

export function Background({ children, style }: BackgroundProps) {
  return (
    <LinearGradient
      // Button Linear Gradient
      colors={['#5C2BB1', '#F46D01']}
      start={{ x: 1, y: 0.1 }}
      style={style}
    >
      {children}
    </LinearGradient>
  )
}

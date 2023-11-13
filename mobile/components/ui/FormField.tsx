import React from 'react'
import { View, Text, StyleProp, ViewStyle } from 'react-native'

interface FormFieldProps {
  title: string
  subtitle?: string
  className?: string
  style?: StyleProp<ViewStyle>
  children: React.ReactNode
}

export function FormField({
  title,
  children,
  subtitle,
  style,
}: FormFieldProps) {
  return (
    <View className="space-y-1" style={style}>
      <View className="flex-row items-center space-x-1">
        <Text className="text-lg font-semibold text-purple-100">{title}</Text>
        {subtitle && (
          <Text className="text-xs font-semibold text-purple-300">
            {subtitle}
          </Text>
        )}
      </View>
      {children}
    </View>
  )
}

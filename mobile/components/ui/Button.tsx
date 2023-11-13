import React from 'react'
import { Pressable, PressableProps } from 'react-native'

// interface ButtonProps {
//   children?: React.ReactNode
// }

export function Button({ ...props }: PressableProps) {
  return (
    <Pressable
      className="w-12 h-12 bg-dark-700 rounded-2xl items-center justify-center"
      {...props}
    />
  )
}

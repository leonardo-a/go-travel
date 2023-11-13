import { cn } from '@utils/merge'
import {
  TextInput as TextInputRaw,
  TextInputProps as TextInputRawProps,
} from 'react-native'

interface TextInputProps extends TextInputRawProps {
  validation?: 'success' | 'error' | 'none'
}

export function TextInput({
  validation,
  placeholderTextColor,
  ...props
}: TextInputProps) {
  return (
    <TextInputRaw
      placeholderTextColor={placeholderTextColor || '#56565A'}
      autoCapitalize="none"
      className={cn([
        'px-4 py-2 w-full border border-dark-800 bg-dark-700 rounded-lg text-purple-100 placeholder:text-dark-300',
        validation === 'success' && 'border border-lime-500',
        validation === 'error' && 'border border-ruby-500',
      ])}
      {...props}
    />
  )
}

import { cn } from '@utils/merge'
import { View, Text } from 'react-native'

interface MembersPreviewProps {
  names: string[]
  iconClassName?: string
}

interface MemberIconProps {
  name: string
  iconClassName?: string
}

export function MembersPreview({ names, iconClassName }: MembersPreviewProps) {
  const [first, second, ...rest] = names

  return (
    <View className="flex-row">
      <MemberIcon name={first.charAt(0)} iconClassName={iconClassName} />
      {second && (
        <MemberIcon name={second.charAt(0)} iconClassName={iconClassName} />
      )}
      {rest.length > 0 && (
        <MemberIcon
          name={`${rest.length}+`}
          iconClassName={cn(['bg-ruby-400', iconClassName])}
        />
      )}
    </View>
  )
}

function MemberIcon({ iconClassName, name }: MemberIconProps) {
  return (
    <View
      className={cn([
        'w-6 h-6 rounded-full bg-violet-600 items-center justify-center',
        iconClassName,
      ])}
    >
      <Text className="text-xs text-violet-100 uppercase">{name}</Text>
    </View>
  )
}

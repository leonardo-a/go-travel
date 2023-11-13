import { FlatList, Pressable, View } from 'react-native'
import { TextInput } from '../ui/TextInput'
import { Search } from 'lucide-react-native'
import { cn } from '@utils/merge'
import { TravelPreview } from '@components/partials/TravelPreview'
import { TravelProps } from '@interfaces/lists'
import { TravelAdd } from './TravelAdd'

interface TravelsGridProps {
  listId: string
  listClassName?: string
  search?: boolean
  numColumns?: number
  data: TravelProps[]
}

export function TravelsGrid({
  listClassName,
  search,
  data,
  listId,
}: TravelsGridProps) {
  return (
    <View className={cn(['flex-1 w-full px-6 space-y-4', listClassName])}>
      {search && (
        <View className="flex-row justify-between">
          <TextInput
            className="w-10/12 h-10"
            placeholder="procurar por nome..."
          />
          <Pressable className="items-center justify-center w-10 h-10 p-2 rounded-lg bg-marigold-400">
            <Search size={20} className="text-dark-800 " />
          </Pressable>
        </View>
      )}
      <View className="items-center flex-1 w-full rounded-lg">
        <FlatList
          data={[null, ...data]}
          numColumns={2}
          className={cn(['pt-2', [null, ...data].length < 2 && 'w-full px-1'])}
          contentContainerStyle={{
            gap: 12,
            paddingBottom: 12,
          }}
          renderItem={({ item, index }) => {
            if (!item) {
              return (
                <TravelAdd
                  key={`travel-${index}`}
                  listId={listId}
                  className="mx-[6px]"
                />
              )
            }

            return (
              <TravelPreview
                key={`travel-${index}`}
                travel={item}
                className="mx-[6px]"
              />
            )
          }}
        />
      </View>
    </View>
  )
}

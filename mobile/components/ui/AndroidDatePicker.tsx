import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { Pressable, Text } from 'react-native'
import dayjs from 'dayjs'
import { Calendar } from 'lucide-react-native'

interface DatePickerProps {
  date: Date | undefined
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
}

export function AndroidDatePicker({ date, setDate }: DatePickerProps) {
  const onChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate
    setDate(currentDate)
  }

  function showDatePicker() {
    DateTimePickerAndroid.open({
      value: date || new Date(),
      onChange,
      minimumDate: new Date(),
      mode: 'date',
      is24Hour: true,
    })
  }

  return (
    <Pressable
      onPress={showDatePicker}
      className="flex-row items-center px-4 py-3 space-x-2 rounded-lg bg-dark-700"
    >
      <Calendar size={24} className="text-purple-600" />
      <Text className="font-bold text-purple-100">
        {date ? dayjs(date).format('DD/MM/YYYY') : 'dd/mm/aaaa'}
      </Text>
    </Pressable>
  )
}

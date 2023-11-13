import { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { SafeAreaView, Pressable, Text } from 'react-native'
import dayjs from 'dayjs'
import { Calendar } from 'lucide-react-native'

interface DatePickerProps {
  date: Date | undefined
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  const [show, setShow] = useState<boolean>(false)

  return (
    <>
      <Pressable
        onPress={() => setShow(true)}
        className="flex-row items-center px-4 py-3 space-x-2 rounded-lg bg-dark-700"
      >
        <Calendar size={24} className="text-purple-600" />
        <Text className="font-bold text-purple-100">
          {date ? dayjs(date).format('DD/MM/YYYY') : 'dd/mm/aaaa'}
        </Text>
      </Pressable>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date || new Date()}
          minimumDate={new Date()}
          mode="date"
          is24Hour={true}
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate
            setShow(false)

            if (currentDate) {
              setDate(currentDate)
            }
          }}
        />
      )}
    </>
  )
}

interface ListProps {
  id: string
  name: string
  coverUrl: string | null
  members: string[]
}

// export interface ListTravelProps {
//   id: string
//   destination: string
//   country: string
//   startDate: string
//   coverPhoto: string | null
// }

export interface ListDetailsProps {
  id: string
  name: string
  owner_id: string
  cover_photo: string | null
  created_at: string
}

export interface TravelProps {
  id: string
  list_id: string
  transportation_id: number | null
  cover_photo: string | null
  destination: string
  country: string
  start_date: string
  duration: number
  costs: number
  completed_at: string | null
  updated_at: string
}

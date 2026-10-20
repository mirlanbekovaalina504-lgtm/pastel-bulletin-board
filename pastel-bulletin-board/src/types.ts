export type Ad = {
  id: number | string
  title: string
  description: string
  price: number
  category: string
  location: string
  image?: string
  author?: string
  phone?: string
  createdAt?: string
}

export type AdDraft = Omit<Ad, 'id'>

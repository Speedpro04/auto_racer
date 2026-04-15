export interface Store {
  id: string
  slug: string
  name: string
  logo_url: string | null
  banner_url: string | null
  primary_color: string | null
  secondary_color: string | null
  about_text: string | null
  phone: string
  whatsapp: string | null
  instagram: string | null
  city: string
  plan: 'basic' | 'pro' | 'premium'
  active: boolean
  created_at: string
}

export interface Vehicle {
  id: string
  store_id: string
  title: string
  type: 'carro' | 'moto'
  brand: string
  year: number
  km: number
  price: number
  description: string
  status: 'available' | 'sold' | 'paused'
  created_at: string
}

export interface VehicleMedia {
  id: string
  vehicle_id: string
  store_id: string
  url: string
  type: 'image' | 'video'
  order: number
  size_bytes: number
}

export interface StoreUser {
  id: string
  store_id: string
  role: 'owner' | 'manager' | 'staff'
  email: string
}

export interface VehicleWithMedia extends Vehicle {
  media: VehicleMedia[]
}

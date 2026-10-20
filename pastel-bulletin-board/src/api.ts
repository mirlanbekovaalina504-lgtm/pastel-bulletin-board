import type { Ad, AdDraft } from './types'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
const ADS_ENDPOINT = import.meta.env.VITE_ADS_ENDPOINT ?? '/ads'

const sampleAds: Ad[] = [
  { id: 1, title: 'Наушники в отличном состоянии', description: 'Беспроводные наушники, бережно использовались. Всё работает, коробка в комплекте.', price: 2400, category: 'Электроника', location: 'Бишкек', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', author: 'Алина', phone: '+996 555 123 456' },
  { id: 2, title: 'Уютный вязаный кардиган', description: 'Мягкий кардиган нежного кремового цвета. Размер S–M, состояние хорошее.', price: 1200, category: 'Одежда', location: 'Бишкек', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', author: 'Мээрим', phone: '+996 700 123 456' },
  { id: 3, title: 'Книги для учёбы и отдыха', description: 'Несколько интересных книг. Можно купить набором или по отдельности.', price: 700, category: 'Книги', location: 'Бишкек', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80', author: 'Дина', phone: '+996 777 123 456' },
  { id: 4, title: 'Настольная лампа', description: 'Минималистичная лампа для рабочего стола. Свет тёплый, отлично подходит для учёбы.', price: 950, category: 'Дом', location: 'Бишкек', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80', author: 'Айжан', phone: '+996 555 456 789' },
  { id: 5, title: 'Рюкзак на каждый день', description: 'Вместительный рюкзак для ноутбука и учебников. Без повреждений.', price: 1800, category: 'Аксессуары', location: 'Бишкек', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80', author: 'Нурия', phone: '+996 700 456 789' },
  { id: 6, title: 'Комнатное растение', description: 'Неприхотливое зелёное растение в красивом горшке. Хорошо украсит комнату.', price: 500, category: 'Дом', location: 'Бишкек', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80', author: 'Салтанат', phone: '+996 777 456 789' }
]

let localAds = [...sampleAds]
let nextLocalId = 7

function normalizeAd(item: any, index: number): Ad {
  return {
    id: item.id ?? item._id ?? index + 1,
    title: item.title ?? item.name ?? 'Объявление',
    description: item.description ?? item.text ?? '',
    price: Number(item.price ?? 0),
    category: item.category ?? 'Другое',
    location: item.location ?? item.city ?? 'Бишкек',
    image: item.image ?? item.imageUrl ?? item.photo ?? '',
    author: item.author ?? item.nameOfAuthor ?? 'Пользователь',
    phone: item.phone ?? item.contact ?? '',
    createdAt: item.createdAt ?? item.date ?? ''
  }
}

export function isBackendConfigured(): boolean {
  return Boolean(API_BASE_URL && !API_BASE_URL.includes('YOUR-BACKEND-URL'))
}

export async function getAds(): Promise<{ ads: Ad[]; source: 'backend' | 'demo'; warning?: string }> {
  if (!isBackendConfigured()) return { ads: localAds, source: 'demo', warning: 'Показаны демонстрационные объявления. Для подключения backend настройте .env.' }
  try {
    const response = await fetch(`${API_BASE_URL}${ADS_ENDPOINT}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data: unknown = await response.json()
    const items = Array.isArray(data) ? data : (data as any).ads ?? (data as any).content ?? (data as any).items
    if (!Array.isArray(items)) throw new Error('Ответ API не содержит список объявлений')
    return { ads: items.map(normalizeAd), source: 'backend' }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка'
    return { ads: localAds, source: 'demo', warning: `Backend не ответил (${message}). Пока показаны демонстрационные объявления.` }
  }
}

export async function createAd(draft: AdDraft): Promise<Ad> {
  if (!isBackendConfigured()) {
    const ad: Ad = { ...draft, id: nextLocalId++ }
    localAds = [ad, ...localAds]
    return ad
  }
  const response = await fetch(`${API_BASE_URL}${ADS_ENDPOINT}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft)
  })
  if (!response.ok) throw new Error(`Не удалось создать объявление: HTTP ${response.status}`)
  const data = await response.json()
  return normalizeAd(data, nextLocalId++)
}

export async function getAd(id: string): Promise<Ad | undefined> {
  const result = await getAds()
  return result.ads.find(ad => String(ad.id) === id)
}
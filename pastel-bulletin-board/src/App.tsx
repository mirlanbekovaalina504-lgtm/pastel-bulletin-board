import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, BadgeCheck, Camera, Check, ChevronDown, Heart, MapPin, Plus, Search, ShieldCheck, Sparkles, Tag, X } from 'lucide-react'
import { createAd, getAds } from './api'
import type { Ad, AdDraft } from './types'

type Page = 'home' | 'create' | 'details'
const categories = ['Все категории', 'Электроника', 'Одежда', 'Книги', 'Дом', 'Аксессуары', 'Другое']
const money = (value: number) => `${new Intl.NumberFormat('ru-RU').format(value)} сом`

function App() {
  const [page, setPage] = useState<Page>('home')
  const [ads, setAds] = useState<Ad[]>([])
  const [selected, setSelected] = useState<Ad | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Все категории')
  const [sort, setSort] = useState('new')
  const [favorites, setFavorites] = useState<(number | string)[]>([])
  const [notice, setNotice] = useState('')
  const [source, setSource] = useState<'backend' | 'demo'>('demo')
  const [warning, setWarning] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadAds() {
    setLoading(true)
    const result = await getAds()
    setAds(result.ads)
    setSource(result.source)
    setWarning(result.warning ?? '')
    setLoading(false)
  }

  useEffect(() => { void loadAds() }, [])

  const visibleAds = useMemo(() => {
    let result = ads.filter(ad => {
      const text = `${ad.title} ${ad.description} ${ad.category} ${ad.location}`.toLowerCase()
      return text.includes(search.toLowerCase()) && (category === 'Все категории' || ad.category === category)
    })
    if (sort === 'cheap') result = [...result].sort((a, b) => a.price - b.price)
    if (sort === 'expensive') result = [...result].sort((a, b) => b.price - a.price)
    return result
  }, [ads, search, category, sort])

  function openDetails(ad: Ad) { setSelected(ad); setPage('details'); window.scrollTo(0, 0) }
  function goHome() { setPage('home'); setSelected(null); setNotice(''); window.scrollTo(0, 0) }
  function toggleFavorite(id: number | string) {
    setFavorites(old => old.includes(id) ? old.filter(item => item !== id) : [...old, id])
  }

  async function submitAd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const draft: AdDraft = {
      title: String(form.get('title')).trim(),
      description: String(form.get('description')).trim(),
      price: Number(form.get('price')),
      category: String(form.get('category')),
      location: String(form.get('location')).trim() || 'Бишкек',
      image: String(form.get('image')).trim() || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
      author: String(form.get('author')).trim(),
      phone: String(form.get('phone')).trim(),
      createdAt: new Date().toISOString()
    }
    try {
      const created = await createAd(draft)
      setAds(old => [created, ...old.filter(ad => String(ad.id) !== String(created.id))])
      setSelected(created)
      setPage('details')
      setNotice(source === 'demo' ? 'Объявление добавлено в демо-режиме на время этой сессии.' : 'Объявление успешно опубликовано.')
      window.scrollTo(0, 0)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Ошибка при публикации')
    }
  }

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={goHome} aria-label="На главную"><span className="brand-mark"><Sparkles size={21}/></span><span>лаванда<span className="brand-dot">.</span><small>доска объявлений</small></span></button>
      <nav className="nav-links"><button className={page === 'home' ? 'nav-active' : ''} onClick={goHome}>Объявления</button><button onClick={() => { setPage('create'); setNotice(''); window.scrollTo(0,0) }}>Как это работает</button></nav>
      <button className="post-button" onClick={() => { setPage('create'); setNotice(''); window.scrollTo(0,0) }}><Plus size={18}/> Разместить</button>
    </header>

    <main>
      {page === 'home' && <>
        <section className="hero">
          <div className="hero-copy"><span className="eyebrow"><Sparkles size={14}/> Место для хороших находок</span><h1>Вещи находят<br/><em>своих людей.</em></h1><p>Покупай, продавай и отдавай с удовольствием. Просто, по-доброму и рядом.</p>
            <div className="hero-actions"><button className="primary-button" onClick={() => document.getElementById('listings')?.scrollIntoView({behavior:'smooth'})}>Смотреть объявления <ArrowRight size={17}/></button><button className="text-button" onClick={() => setPage('create')}>Подать объявление <Plus size={16}/></button></div>
            <div className="hero-proof"><span className="proof-icon"><ShieldCheck size={17}/></span><span><b>Удобно и просто</b><small>Все нужное — в одном месте</small></span><span className="proof-divider"/><span><b>{ads.length}+</b><small>интересных находок</small></span></div>
          </div>
          <div className="hero-art"><div className="art-blob blob-one"/><div className="art-blob blob-two"/><div className="floating-note"><span>♡</span><div><b>Найди своё</b><small>маленькое счастье</small></div></div><img className="hero-image" src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85" alt="Подборка вещей в нежных оттенках"/><div className="image-caption"><span className="caption-spark">✦</span><div><b>Вторая жизнь вещей</b><small>Больше радости, меньше лишнего</small></div></div></div>
        </section>
        <section className="stats-strip"><div><span className="stat-icon pink"><Heart size={19}/></span><p><b>С любовью</b><small>к хорошим вещам</small></p></div><div><span className="stat-icon lilac"><MapPin size={19}/></span><p><b>Рядом с тобой</b><small>находки в твоём городе</small></p></div><div><span className="stat-icon peach"><BadgeCheck size={19}/></span><p><b>Без сложностей</b><small>публикация за пару минут</small></p></div></section>
        <section id="listings" className="listings-section">
          <div className="section-heading"><div><span className="eyebrow">Твоя следующая находка</span><h2>Свежие объявления<span>.</span></h2><p>Вещи, которым пора найти нового хозяина.</p></div><button className="view-all" onClick={() => {setCategory('Все категории'); setSearch('')}}>Сбросить фильтры <ArrowRight size={16}/></button></div>
          <div className="filters"><label className="search-box"><Search size={19}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Что будем искать?"/></label><label className="select-box"><Tag size={17}/><select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(item=><option key={item}>{item}</option>)}</select><ChevronDown size={16}/></label><label className="select-box sort-box"><select value={sort} onChange={e=>setSort(e.target.value)}><option value="new">Сначала новые</option><option value="cheap">Сначала дешевле</option><option value="expensive">Сначала дороже</option></select><ChevronDown size={16}/></label></div>
          {warning && <div className="api-warning"><span>ℹ</span><div><b>Демо-режим</b><p>{warning}</p></div></div>}
          {loading ? <div className="empty-state">Загружаем объявления…</div> : visibleAds.length ? <div className="ad-grid">{visibleAds.map(ad=><article className="ad-card" key={ad.id}><button className={`favorite ${favorites.includes(ad.id)?'is-favorite':''}`} onClick={()=>toggleFavorite(ad.id)} aria-label="Добавить в избранное"><Heart size={18} fill={favorites.includes(ad.id)?'currentColor':'none'}/></button><button className="ad-image-button" onClick={()=>openDetails(ad)}><img className="ad-image" src={ad.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80'} alt={ad.title}/><span className="category-pill">{ad.category}</span></button><div className="ad-info"><button className="ad-title" onClick={()=>openDetails(ad)}>{ad.title}</button><p className="ad-description">{ad.description}</p><div className="ad-bottom"><strong>{money(ad.price)}</strong><span><MapPin size={13}/>{ad.location}</span></div></div></article>)}</div> : <div className="empty-state"><span>♡</span><h3>Пока ничего не нашлось</h3><p>Попробуй изменить запрос или выбрать другую категорию.</p><button className="primary-button" onClick={()=>{setSearch('');setCategory('Все категории')}}>Сбросить поиск</button></div>}
          <div className="results-note">Показано {visibleAds.length} из {ads.length} объявлений <span>·</span> {source === 'backend' ? 'подключён backend' : 'демонстрационные данные'}</div>
        </section>
        <section className="bottom-cta"><div className="cta-flower">✿</div><div><span className="eyebrow">Есть чем поделиться?</span><h2>Пусть хорошая вещь<br/>найдёт новый дом.</h2><p>Разместить объявление можно всего за пару минут.</p></div><button className="primary-button" onClick={()=>{setPage('create');window.scrollTo(0,0)}}>Создать объявление <ArrowRight size={17}/></button></section>
      </>}

      {page === 'create' && <section className="form-page">
        <button className="back-link" onClick={goHome}><ArrowLeft size={17}/> Вернуться к объявлениям</button>
        <div className="form-layout"><div className="form-intro"><span className="eyebrow"><Sparkles size={14}/> Поделиться легко</span><h1>Создай своё<br/><em>объявление.</em></h1><p>Расскажи о вещи — и помоги ей найти нового владельца.</p><div className="form-tip"><span><Check size={18}/></span><div><b>Небольшой совет</b><p>Добавь понятное описание и честную цену. Так покупателю будет проще принять решение.</p></div></div><div className="steps"><div className="step"><span>01</span><div><b>Расскажи о вещи</b><small>Название, категория и описание</small></div></div><div className="step"><span>02</span><div><b>Укажи детали</b><small>Цена и способ связи</small></div></div><div className="step"><span>03</span><div><b>Готово!</b><small>Объявление появится в списке</small></div></div></div></div>
          <form className="ad-form" onSubmit={submitAd}><div className="form-heading"><div><span className="eyebrow">Новое объявление</span><h2>Заполни детали</h2></div><span className="form-step">1 / 1</span></div>
            <label className="field-label">Название объявления <span>*</span><input name="title" required minLength={3} maxLength={80} placeholder="Например, уютный свитер"/></label>
            <div className="field-row"><label className="field-label">Категория <span>*</span><select name="category" required>{categories.slice(1).map(item=><option key={item}>{item}</option>)}</select></label><label className="field-label">Цена, сом <span>*</span><input name="price" type="number" required min="0" placeholder="1500"/></label></div>
            <label className="field-label">Описание <span>*</span><textarea name="description" required minLength={10} rows={4} maxLength={600} placeholder="Расскажи о состоянии, размере и особенностях вещи…"/></label>
            <label className="field-label">Ссылка на фото <small>(необязательно)</small><div className="input-with-icon"><Camera size={18}/><input name="image" type="url" placeholder="https://example.com/photo.jpg"/></div></label>
            <div className="field-row"><label className="field-label">Твоё имя <span>*</span><input name="author" required placeholder="Как к тебе обращаться?"/></label><label className="field-label">Телефон <span>*</span><input name="phone" required type="tel" placeholder="+996 555 123 456"/></label></div>
            <label className="field-label">Город <input name="location" defaultValue="Бишкек" placeholder="Город"/></label>
            {notice && <div className="inline-notice">{notice}</div>}
            <button className="primary-button submit-button" type="submit">Опубликовать объявление <ArrowRight size={17}/></button><p className="form-terms">Нажимая «Опубликовать», ты подтверждаешь, что информация указана честно.</p>
          </form></div>
      </section>}

      {page === 'details' && selected && <section className="details-page"><button className="back-link" onClick={goHome}><ArrowLeft size={17}/> Все объявления</button><div className="details-card"><div className="details-photo-wrap"><img className="details-photo" src={selected.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80'} alt={selected.title}/><span className="category-pill">{selected.category}</span></div><div className="details-content"><span className="eyebrow">Хорошая находка</span><h1>{selected.title}</h1><div className="details-price">{money(selected.price)}</div><div className="detail-location"><MapPin size={16}/>{selected.location}</div><div className="details-divider"/><h3>Описание</h3><p className="details-description">{selected.description}</p><div className="seller-box"><div className="seller-avatar">{(selected.author || 'П').charAt(0).toUpperCase()}</div><div><small>Продавец</small><b>{selected.author || 'Пользователь'}</b><small>Свяжись, чтобы узнать подробности</small></div></div>{selected.phone && <a className="primary-button contact-button" href={`tel:${selected.phone.replace(/[^\d+]/g,'')}`}>Позвонить продавцу <ArrowRight size={17}/></a>}<button className="outline-button" onClick={()=>toggleFavorite(selected.id)}><Heart size={17} fill={favorites.includes(selected.id)?'currentColor':'none'}/>{favorites.includes(selected.id)?'В избранном':'Добавить в избранное'}</button></div></div></section>}
    </main>
    <footer className="footer"><button className="brand footer-brand" onClick={goHome}><span className="brand-mark"><Sparkles size={18}/></span><span>лаванда<span className="brand-dot">.</span><small>вещи с историей</small></span></button><p>Находи хорошее в простом <span>♡</span></p><small>© 2026 Лаванда · Учебный проект</small></footer>
    {notice && page !== 'create' && <div className="toast" role="status"><Check size={17}/>{notice}<button onClick={()=>setNotice('')}><X size={16}/></button></div>}
  </div>
}

export default App
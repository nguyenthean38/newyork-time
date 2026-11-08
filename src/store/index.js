/* ==========================================================
   Kho trạng thái (Zustand)
   - useUI: chủ đề sáng/tối, cỡ chữ đọc báo, các ngăn kéo / lớp phủ
   - useUser: tài khoản demo lưu trong localStorage (không có máy chủ)
   - useComments: bình luận người xem viết, lượt "Thích", báo cáo
   - useToast: thông báo nhỏ góc dưới
   ========================================================== */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/* ---------------- Giao diện ---------------- */
export function applyTheme(theme) {
  const dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', dark ? '#121212' : '#ffffff')
}

export const useUI = create(
  persist(
    (set) => ({
      theme: 'light',
      readerScale: 1,
      menuOpen: false,
      accountOpen: false,
      searchOpen: false,
      commentsFor: null, // slug bài đang mở bình luận
      dismissed: {}, // các banner đã đóng
      setTheme: (theme) => { applyTheme(theme); set({ theme }) },
      setReaderScale: (readerScale) => set({ readerScale }),
      setMenu: (menuOpen) => set({ menuOpen }),
      setAccount: (accountOpen) => set({ accountOpen }),
      setSearch: (searchOpen) => set({ searchOpen }),
      openComments: (commentsFor) => set({ commentsFor }),
      dismiss: (key) => set((s) => ({ dismissed: { ...s.dismissed, [key]: true } })),
    }),
    { name: 'tt-ui', partialize: (s) => ({ theme: s.theme, readerScale: s.readerScale, dismissed: s.dismissed }) },
  ),
)

/* ---------------- Thông báo ---------------- */
let toastId = 0
export const useToast = create((set) => ({
  items: [],
  push: (text, opts = {}) => {
    const id = ++toastId
    set((s) => ({ items: [...s.items.slice(-2), { id, text, tone: opts.tone || 'ok' }] }))
    setTimeout(() => set((s) => ({ items: s.items.filter((t) => t.id !== id) })), opts.ms || 3800)
  },
  remove: (id) => set((s) => ({ items: s.items.filter((t) => t.id !== id) })),
}))
export const toast = (text, opts) => useToast.getState().push(text, opts)

/* ---------------- Tài khoản demo ---------------- */
const ICON_COLORS = ['#f4c7c3', '#f7dca4', '#cfe8c4', '#bfe0e8', '#c9cdf2', '#e6c6ec', '#f2d0b8']

export const PLANS = {
  news: { id: 'news', name: 'Tin tức', price: 49000, intro: 9000, desc: 'Đọc không giới hạn bài viết, bản tin và podcast.' },
  all: { id: 'all', name: 'Trọn bộ', price: 79000, intro: 19000, desc: 'Tin tức, Trò chơi, Ẩm thực và Podcast — một gói cho tất cả.' },
  family: { id: 'family', name: 'Trọn bộ Gia đình', price: 129000, intro: 39000, desc: 'Trọn bộ cho 4 người dùng, mỗi người một đăng nhập riêng.' },
}

function newAccount(email, password) {
  const letter = (email[0] || 'A').toUpperCase()
  return {
    email,
    password,
    accountNo: String(Math.floor(100000000 + Math.random() * 899999999)),
    firstName: '',
    lastName: '',
    username: '',
    icon: { kind: 'letter', value: letter, color: ICON_COLORS[letter.charCodeAt(0) % ICON_COLORS.length] },
    createdAt: Date.now(),
    interests: [],
    newsletters: ['sang-nay'],
    places: [],
    connected: { google: false, apple: false, work: false },
    subscription: null,
    billing: [],
    saved: [],
    marketing: false,
  }
}

const now = () => Date.now()
const DAY = 86400000

export const useUser = create(
  persist(
    (set, get) => ({
      accounts: {},
      current: null, // email đang đăng nhập
      pendingEmail: '', // email đang trong luồng đăng nhập / đăng ký

      user: () => {
        const { accounts, current } = get()
        return current ? accounts[current] : null
      },
      exists: (email) => Boolean(get().accounts[email.trim().toLowerCase()]),
      setPending: (pendingEmail) => set({ pendingEmail }),

      signup: (email, password, marketing = false) => {
        const e = email.trim().toLowerCase()
        const acc = { ...newAccount(e, password), marketing }
        set((s) => ({ accounts: { ...s.accounts, [e]: acc }, current: e }))
        return acc
      },
      login: (email, password) => {
        const e = email.trim().toLowerCase()
        const acc = get().accounts[e]
        if (!acc) return { ok: false, error: 'Không tìm thấy tài khoản với email này.' }
        if (acc.password !== password) return { ok: false, error: 'Email hoặc mật khẩu bạn nhập chưa đúng. Vui lòng thử lại.' }
        set({ current: e })
        return { ok: true }
      },
      /** Đăng nhập nhanh bằng Google / Apple (giả lập): tạo tài khoản nếu chưa có. */
      socialLogin: (provider) => {
        const e = provider === 'google' ? 'ban.doc.demo@gmail.com' : 'ban.doc.demo@icloud.com'
        const acc = get().accounts[e] || { ...newAccount(e, ''), firstName: 'Bạn', lastName: 'Đọc' }
        acc.connected = { ...acc.connected, [provider]: true }
        set((s) => ({ accounts: { ...s.accounts, [e]: acc }, current: e }))
        return acc
      },
      /** Đăng nhập bằng mã một lần (demo): không cần mật khẩu. */
      loginDirect: (email) => {
        const e = email.trim().toLowerCase()
        if (!get().accounts[e]) return false
        set({ current: e })
        return true
      },
      changePassword: (oldPw, newPw) => {
        const u = get().user()
        if (!u) return { ok: false, error: 'Bạn chưa đăng nhập.' }
        if (u.password && u.password !== oldPw) return { ok: false, error: 'Mật khẩu hiện tại chưa đúng.' }
        get().update({ password: newPw })
        return { ok: true }
      },
      addPlace: (place) => {
        const u = get().user()
        if (!u || u.places.includes(place) || u.places.length >= 25) return false
        get().update({ places: [...u.places, place] })
        return true
      },
      removePlace: (place) => {
        const u = get().user()
        if (u) get().update({ places: u.places.filter((p) => p !== place) })
      },
      setConnected: (provider, value) => {
        const u = get().user()
        if (u) get().update({ connected: { ...u.connected, [provider]: value } })
      },
      logout: () => set({ current: null }),
      resetPassword: (email, password) => {
        const e = email.trim().toLowerCase()
        if (!get().accounts[e]) return false
        set((s) => ({ accounts: { ...s.accounts, [e]: { ...s.accounts[e], password } }, current: e }))
        return true
      },

      update: (patch) => {
        const { current } = get()
        if (!current) return
        set((s) => ({ accounts: { ...s.accounts, [current]: { ...s.accounts[current], ...patch } } }))
      },
      changeEmail: (newEmail, password) => {
        const { current, accounts } = get()
        const acc = accounts[current]
        const e = newEmail.trim().toLowerCase()
        if (!acc) return { ok: false, error: 'Bạn chưa đăng nhập.' }
        if (acc.password && acc.password !== password) return { ok: false, error: 'Mật khẩu chưa đúng.' }
        if (accounts[e]) return { ok: false, error: 'Email này đã được dùng cho tài khoản khác.' }
        const next = { ...accounts }
        delete next[current]
        next[e] = { ...acc, email: e }
        set({ accounts: next, current: e })
        return { ok: true }
      },
      deleteAccount: () => {
        const { current, accounts } = get()
        const next = { ...accounts }
        delete next[current]
        set({ accounts: next, current: null })
      },

      /* Gói đọc */
      subscribe: (planId, method) => {
        const plan = PLANS[planId]
        const t = now()
        get().update({
          subscription: { plan: planId, status: 'trial', startedAt: t, trialEnds: t + 7 * DAY, nextBill: t + 7 * DAY, method },
          billing: [{ id: `HD${String(t).slice(-6)}`, date: t, amount: 0, desc: `${plan.name} — 7 ngày dùng thử`, method }, ...(get().user()?.billing || [])],
        })
      },
      changePlan: (planId) => {
        const u = get().user()
        if (!u?.subscription) return
        get().update({ subscription: { ...u.subscription, plan: planId } })
      },
      cancelSubscription: (reason) => {
        const u = get().user()
        if (!u?.subscription) return
        get().update({ subscription: { ...u.subscription, status: 'canceled', canceledAt: now(), reason } })
      },
      resumeSubscription: () => {
        const u = get().user()
        if (!u?.subscription) return
        get().update({ subscription: { ...u.subscription, status: 'trial', canceledAt: null, reason: null } })
      },

      /* Danh sách đọc, bản tin, địa điểm */
      toggleSaved: (slug) => {
        const u = get().user()
        if (!u) return null
        const has = u.saved.includes(slug)
        get().update({ saved: has ? u.saved.filter((s) => s !== slug) : [slug, ...u.saved] })
        return !has
      },
      toggleNewsletter: (id) => {
        const u = get().user()
        if (!u) return null
        const has = u.newsletters.includes(id)
        get().update({ newsletters: has ? u.newsletters.filter((s) => s !== id) : [...u.newsletters, id] })
        return !has
      },
    }),
    { name: 'tt-user', partialize: (s) => ({ accounts: s.accounts, current: s.current }) },
  ),
)

/** Hook tiện dụng: trả về tài khoản hiện tại (hoặc null) và tự cập nhật khi đổi. */
export const useCurrentUser = () => useUser((s) => (s.current ? s.accounts[s.current] : null))

/* ---------------- Bình luận ---------------- */
export const useComments = create(
  persist(
    (set) => ({
      mine: {}, // { [slug]: Comment[] }
      liked: {}, // { [commentId]: true }
      reported: {}, // { [commentId]: lý do }
      add: (slug, comment) => set((s) => ({ mine: { ...s.mine, [slug]: [comment, ...(s.mine[slug] || [])] } })),
      toggleLike: (id) => set((s) => {
        const liked = { ...s.liked }
        if (liked[id]) delete liked[id]
        else liked[id] = true
        return { liked }
      }),
      report: (id, reason) => set((s) => ({ reported: { ...s.reported, [id]: reason } })),
    }),
    { name: 'tt-comments' },
  ),
)

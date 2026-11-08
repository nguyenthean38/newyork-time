/* Các mục trong trung tâm tài khoản: gói, lịch sử thanh toán, email & cài đặt, trợ giúp */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, Apple, Briefcase, Check } from 'lucide-react'
import { Radio, Toggle, Modal } from '@/components/ui'
import { PLANS, useUser, toast } from '@/store'
import { NEWSLETTER_BY_ID } from '@/data/newsletters'
import { shortDate, numDate } from '@/lib/format'
import { PLAN_FEATURES } from './plans'
import { PlanFaq } from '@/pages/auth/PlansPage'
import { DemoNote, InfoRow, perWeek, perMonth } from './shared'
import { AccountShell, Block } from './AccountShell'
import { SubStatus } from './Overview'
import { cn } from '@/lib/cn'

const INCLUDED = [
  ['Tin tức', 'Phóng sự, phân tích và bình luận từ toà soạn Tân Thời. Truy cập trên web và ứng dụng.', ['news', 'all', 'family']],
  ['Trò chơi', 'Chữ Ẩn, Bộ Tứ, Sudoku và kho đề cũ, kèm thống kê cá nhân.', ['all', 'family']],
  ['Ẩm thực', 'Công thức đã thử nghiệm, danh sách đi chợ và gợi ý bữa tối.', ['all', 'family']],
  ['Nghe & Video', 'Podcast, bài báo có giọng đọc và phim tài liệu ngắn không quảng cáo.', ['all', 'family']],
  ['Gia đình', 'Ba tài khoản thành viên, mỗi người một đăng nhập.', ['family']],
]

/* ---------- Gói của bạn ---------- */
export function SubscriptionSection({ user }) {
  const sub = user.subscription
  const { changePlan, resumeSubscription } = useUser()
  const [open, setOpen] = useState('Tin tức')
  const [next, setNext] = useState(sub?.plan)
  if (!sub) {
    return (
      <AccountShell>
        <h1 className="font-serif text-[28px] font-semibold">Gói của bạn</h1>
        <div className="mt-6 rounded border border-rule p-5 font-sans">
          <div className="text-[15px] font-semibold">Bạn chưa có gói đọc</div>
          <p className="mt-1 text-[14px] text-muted">Dùng thử miễn phí 7 ngày, huỷ bất cứ lúc nào.</p>
          <Link to="/goi-doc" className="btn btn-son mt-4">Xem các gói đọc</Link>
        </div>
      </AccountShell>
    )
  }
  const plan = PLANS[sub.plan]
  const canceled = sub.status === 'canceled'
  return (
    <AccountShell>
      <h1 className="font-serif text-[28px] font-semibold">Gói của bạn</h1>
      <div className="mt-6 rounded border border-rule p-5 font-sans">
        <div className="flex items-center gap-2 text-[16px] font-semibold">{plan.name} <SubStatus sub={sub} /></div>
        <p className="mt-1 text-[14px] text-muted">
          {canceled
            ? `Bạn đã huỷ gói. Vẫn truy cập được đến hết ${shortDate(new Date(sub.trialEnds))}.`
            : `Miễn phí đến ${shortDate(new Date(sub.trialEnds))}, sau đó ${perWeek(plan.intro)} (thanh toán mỗi 4 tuần).`}
        </p>
        {canceled && (
          <button onClick={() => { resumeSubscription(); toast('Gói của bạn đã được khôi phục.') }} className="btn btn-ink btn-sm mt-4">Tiếp tục gói</button>
        )}
      </div>

      <Block title="Gói của bạn bao gồm">
        <div className="mt-2 divide-y divide-rule">
          {INCLUDED.map(([t, d, plans]) => {
            const has = plans.includes(sub.plan)
            const isOpen = open === t
            return (
              <div key={t} className="py-3 font-sans">
                <button onClick={() => setOpen(isOpen ? null : t)} aria-expanded={isOpen} className="flex w-full items-center justify-between text-left">
                  <span className={cn('flex items-center gap-2 text-[14px] font-semibold', !has && 'text-faint')}>
                    {has ? <Check size={16} className="text-pos" /> : <span className="w-4" />} {t}
                    {!has && <span className="text-[12px] font-normal">— chưa có trong gói</span>}
                  </span>
                  <ChevronDown size={17} className={cn('transition-transform', isOpen && 'rotate-180')} />
                </button>
                {isOpen && <p className="mt-2 pl-6 text-[13px] leading-relaxed text-muted">{d}</p>}
              </div>
            )
          })}
        </div>
      </Block>

      {!canceled && (
        <Block title="Đổi gói" className="scroll-mt-20" >
          <div id="doi-goi" className="mt-4 space-y-3">
            {Object.values(PLANS).map((p) => (
              <div key={p.id} className={cn('rounded border p-4', next === p.id ? 'border-ink' : 'border-rule')}>
                <Radio name="plan" checked={next === p.id} onChange={() => setNext(p.id)}>
                  <span className="font-sans">
                    <span className="block text-[14px] font-semibold">{p.name}{p.id === sub.plan && ' (hiện tại)'}</span>
                    <span className="block text-[13px] text-muted">{perWeek(p.intro)} năm đầu · sau đó {perMonth(p.price)}</span>
                    <span className="mt-1 block text-[12px] text-muted">{PLAN_FEATURES[p.id][0]}</span>
                  </span>
                </Radio>
              </div>
            ))}
            <button
              disabled={next === sub.plan}
              onClick={() => { changePlan(next); toast(`Đã chuyển sang gói ${PLANS[next].name}.`) }}
              className="btn btn-ink"
            >
              Xác nhận đổi gói
            </button>
          </div>
        </Block>
      )}

      <Block title="Quản lý gói">
        <InfoRow label="Thanh toán tiếp theo" value={canceled ? 'Không có — gói đã huỷ' : shortDate(new Date(sub.nextBill))} />
        <InfoRow label="Phương thức thanh toán" value={sub.method} action="Lịch sử" to="/tai-khoan/thanh-toan" />
        {!canceled && (
          <Link to="/tai-khoan/huy-goi" className="flex items-center justify-between border-b border-rule py-4 font-sans">
            <span>
              <span className="block text-[13px] font-semibold">Huỷ gói</span>
              <span className="block text-[13px] text-muted">Bạn vẫn dùng được đến hết kỳ đã thanh toán.</span>
            </span>
            <ChevronRight size={18} className="text-muted" />
          </Link>
        )}
      </Block>

      <Block title="Góp ý">
        <p className="mt-2 font-sans text-[13px] text-muted">Bạn có góp ý về nội dung hoặc sản phẩm? Chúng tôi đọc mọi tin nhắn.</p>
        <Link to="/tai-khoan/tro-giup" className="mt-2 inline-block font-sans text-[13px] font-semibold underline">Gửi góp ý</Link>
      </Block>
    </AccountShell>
  )
}

/* ---------- Lịch sử thanh toán ---------- */
export function BillingSection({ user }) {
  const rows = user.billing || []
  return (
    <AccountShell>
      <h1 className="font-serif text-[28px] font-semibold">Lịch sử thanh toán</h1>
      <DemoNote className="mt-4">Mọi hoá đơn bên dưới là dữ liệu mô phỏng, không có giao dịch thật.</DemoNote>
      {rows.length ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[480px] font-sans text-[14px]">
            <thead>
              <tr className="border-b-2 border-ink text-left">
                <th className="py-2.5 pr-3 font-semibold">Ngày</th>
                <th className="py-2.5 pr-3 font-semibold">Mô tả</th>
                <th className="py-2.5 pr-3 font-semibold">Phương thức</th>
                <th className="py-2.5 text-right font-semibold">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-rule">
                  <td className="py-3 pr-3 text-muted">{numDate(new Date(r.date))}</td>
                  <td className="py-3 pr-3">{r.desc}<div className="text-[12px] text-faint">Mã: {r.id}</div></td>
                  <td className="py-3 pr-3 text-muted">{r.method}</td>
                  <td className="py-3 text-right font-medium">{r.amount.toLocaleString('vi-VN')}₫</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 rounded border border-rule p-5 font-sans">
          <div className="text-[15px] font-semibold">Chưa có thanh toán nào</div>
          <p className="mt-1 text-[14px] text-muted">Thông tin về phương thức thanh toán và lịch sử sẽ hiện ở đây khi bạn đăng ký gói.</p>
          <Link to="/goi-doc" className="btn btn-line btn-sm mt-4">Xem các gói đọc</Link>
        </div>
      )}
      {user.subscription && (
        <Block title="Thanh toán sắp tới">
          <InfoRow label="Ngày" value={user.subscription.status === 'canceled' ? 'Không có — gói đã huỷ' : shortDate(new Date(user.subscription.nextBill))} />
          <InfoRow label="Số tiền mỗi 4 tuần" value={`${(PLANS[user.subscription.plan].intro * 4).toLocaleString('vi-VN')}₫`} />
        </Block>
      )}
    </AccountShell>
  )
}

/* ---------- Email & cài đặt ---------- */
const PROVIDERS = [
  ['google', 'Google', () => <span className="flex size-5 items-center justify-center rounded-full border border-current text-[11px] font-bold">G</span>],
  ['apple', 'Apple', () => <Apple size={18} />],
  ['work', 'Tài khoản công ty / trường học', () => <Briefcase size={17} />],
]

export function EmailSection({ user }) {
  const { setConnected, toggleNewsletter, update } = useUser()
  const [confirm, setConfirm] = useState(null)
  const connected = PROVIDERS.filter(([id]) => user.connected?.[id])
  const notConnected = PROVIDERS.filter(([id]) => !user.connected?.[id])
  const doConnect = (id, name) => { setConnected(id, true); toast(`Đã liên kết ${name} (mô phỏng).`) }
  return (
    <AccountShell>
      <h1 className="font-serif text-[28px] font-semibold">Email & cài đặt</h1>

      <Block title="Tài khoản liên kết">
        <p className="mt-2 font-sans text-[13px] text-muted">Liên kết để đăng nhập nhanh. Bản demo chỉ mô phỏng, không kết nối dịch vụ thật.</p>
        {connected.length > 0 && <div className="mt-4 font-sans text-[12px] font-bold uppercase tracking-wider text-muted">Đã liên kết</div>}
        {connected.map(([id, name, I]) => (
          <div key={id} className="flex items-center justify-between gap-3 border-b border-rule py-3 font-sans">
            <span className="flex items-center gap-3 text-[14px]"><I /> {name}</span>
            <button onClick={() => setConfirm([id, name])} className="btn btn-line btn-sm">Huỷ liên kết</button>
          </div>
        ))}
        <div className="mt-4 font-sans text-[12px] font-bold uppercase tracking-wider text-muted">Chưa liên kết</div>
        {notConnected.length === 0 && <p className="py-3 font-sans text-[13px] text-muted">Bạn đã liên kết tất cả.</p>}
        {notConnected.map(([id, name, I]) => (
          <div key={id} className="flex items-center justify-between gap-3 border-b border-rule py-3 font-sans">
            <span className="flex items-center gap-3 text-[14px]"><I /> {name}</span>
            <button onClick={() => doConnect(id, name)} className="btn btn-ink btn-sm">Liên kết</button>
          </div>
        ))}
      </Block>

      <Block title="Bản tin">
        <p className="mt-2 font-sans text-[13px] text-muted">Bạn đang nhận các bản tin sau tại {user.email}.</p>
        {user.newsletters.length === 0 && <p className="py-4 font-sans text-[14px]">Bạn chưa đăng ký bản tin nào.</p>}
        <ul>
          {user.newsletters.map((id) => {
            const n = NEWSLETTER_BY_ID[id]
            if (!n) return null
            return (
              <li key={id} className="flex items-center justify-between gap-3 border-b border-rule py-3 font-sans">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-sm font-serif" style={{ background: n.art[0], color: n.art[1] }} aria-hidden>{n.glyph}</span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold">{n.name}</span>
                    <span className="block text-[12px] text-muted">{n.freq}</span>
                  </span>
                </span>
                <button onClick={() => { toggleNewsletter(id); toast(`Đã huỷ đăng ký bản tin ${n.name}.`) }} className="shrink-0 text-[13px] font-semibold underline">Huỷ đăng ký</button>
              </li>
            )
          })}
        </ul>
        <Link to="/ban-tin" className="btn btn-line btn-sm mt-4">Tìm thêm bản tin</Link>
      </Block>

      <Block title="Thông tin tiếp thị">
        <div className="mt-3 flex items-center justify-between gap-4 font-sans">
          <div>
            <div className="text-[14px] font-semibold">Ưu đãi và cập nhật sản phẩm</div>
            <p className="text-[13px] text-muted">Thỉnh thoảng nhận email về tính năng mới và ưu đãi gói đọc.</p>
          </div>
          <Toggle checked={!!user.marketing} label="Nhận email tiếp thị" onChange={(v) => { update({ marketing: v }); toast(v ? 'Đã bật email tiếp thị.' : 'Đã tắt email tiếp thị.') }} />
        </div>
      </Block>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title={confirm ? `Huỷ liên kết ${confirm[1]}?` : ''}>
        <p className="font-sans text-[14px] text-muted">Bạn sẽ không đăng nhập bằng {confirm?.[1]} được nữa.{!user.password && ' Hãy tạo mật khẩu trước để không mất quyền truy cập.'}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={() => setConfirm(null)} className="btn btn-line btn-sm">Giữ lại</button>
          <button onClick={() => { setConnected(confirm[0], false); toast(`Đã huỷ liên kết ${confirm[1]}.`); setConfirm(null) }} className="btn btn-ink btn-sm">Huỷ liên kết</button>
        </div>
      </Modal>
    </AccountShell>
  )
}

/* ---------- Trợ giúp ---------- */
export function HelpSection() {
  const [msg, setMsg] = useState('')
  return (
    <AccountShell>
      <h1 className="font-serif text-[28px] font-semibold">Trợ giúp</h1>
      <p className="mt-2 font-sans text-[14px] text-muted">Câu trả lời cho những câu hỏi thường gặp về tài khoản và gói đọc.</p>
      <div className="mt-6"><PlanFaq /></div>
      <Block title="Liên hệ chăm sóc bạn đọc">
        <p className="mt-2 font-sans text-[13px] text-muted">Thứ Hai – Thứ Sáu, 8:00 – 20:00. Bản demo không gửi tin nhắn đi.</p>
        <form onSubmit={(e) => { e.preventDefault(); setMsg(''); toast('Đã ghi nhận góp ý của bạn (mô phỏng). Cảm ơn bạn!') }} className="mt-3">
          <textarea value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={500} rows={4} placeholder="Bạn cần hỗ trợ điều gì?" className="field-input h-auto py-2.5" />
          <div className="mt-1 text-right font-sans text-[12px] text-muted">{msg.length}/500</div>
          <button disabled={!msg.trim()} className="btn btn-ink btn-sm">Gửi</button>
        </form>
      </Block>
    </AccountShell>
  )
}

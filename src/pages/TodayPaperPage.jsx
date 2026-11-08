/* Báo hôm nay: mục lục kiểu bản in, chia theo tập A / B / C kèm số trang */
import { Link } from 'react-router-dom'
import { ARTICLES } from '@/data'
import { Img, useTitle } from '@/components/ui'
import { bylineText } from '@/components/story/Story'
import { longDate } from '@/lib/format'
import { lunarLabel } from '@/lib/lunar'

const PARTS = [
  { code: 'A', name: 'Tin chính', sections: ['thoi-su', 'the-gioi', 'y-kien'] },
  { code: 'B', name: 'Kinh doanh & Khoa học', sections: ['kinh-doanh', 'cong-nghe', 'khoa-hoc', 'the-thao'] },
  { code: 'C', name: 'Văn hoá & Đời sống', sections: ['van-hoa', 'doi-song', 'am-thuc'] },
]

export default function TodayPaperPage() {
  useTitle('Báo hôm nay')
  const today = new Date()
  const front = ARTICLES.find((a) => !a.live)
  const issue = Math.floor((today - new Date('2026-01-01')) / 86400000) + 1

  return (
    <div className="wrap max-w-[1000px] py-10">
      <header className="text-center">
        <div className="kicker text-muted">Ấn bản hôm nay</div>
        <h1 className="mt-2 font-serif text-[34px] font-bold sm:text-[40px]">Báo hôm nay</h1>
        <p className="mt-1 font-sans text-[14px] text-muted">{longDate(today)} · {lunarLabel(today)} · Số {issue}</p>
      </header>
      <div className="rule-double mt-6" />

      {front && (
        <Link to={`/bai/${front.slug}`} className="group mt-8 grid items-center gap-6 sm:grid-cols-[1.2fr_1fr]">
          <Img k={front.image} ratio="4/3" alt={front.caption} />
          <div>
            <div className="kicker mb-2">Trang A1</div>
            <h2 className="hl story-link text-[28px] leading-tight">{front.title}</h2>
            <p className="dek mt-2 text-[17px]">{front.dek}</p>
            <div className="mt-2 font-sans text-[12px] text-muted">{bylineText(front)}</div>
          </div>
        </Link>
      )}

      {PARTS.map((p) => {
        const list = ARTICLES.filter((a) => p.sections.includes(a.section) && a !== front)
        let page = 1
        return (
          <section key={p.code} className="mt-12">
            <div className="flex items-baseline gap-3 border-b-2 border-ink pb-2">
              <span className="font-mast text-[32px] font-black leading-none">{p.code}</span>
              <h2 className="font-sans text-[15px] font-bold uppercase tracking-[0.08em]">{p.name}</h2>
              <span className="ml-auto font-sans text-[12px] text-muted">{list.length} bài</span>
            </div>
            <ol className="divide-y divide-rule">
              {list.map((a) => {
                page += 1 + (a.read > 6 ? 1 : 0)
                return (
                  <li key={a.slug}>
                    <Link to={`/bai/${a.slug}`} className="group flex items-baseline gap-4 py-3">
                      <span className="w-12 shrink-0 font-sans text-[12px] font-semibold tabular-nums text-muted">{p.code}{page}</span>
                      <span className="min-w-0 flex-1">
                        <span className="hl story-link text-[17px] leading-snug">{a.title}</span>
                        <span className="mt-0.5 block font-sans text-[12px] text-muted">{bylineText(a)}</span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </section>
        )
      })}
      <p className="mt-10 text-center font-sans text-[12px] text-faint">Tân Thời là trang tin minh hoạ — số trang mang tính trình bày.</p>
    </div>
  )
}

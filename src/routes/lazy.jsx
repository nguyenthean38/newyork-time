import { lazy, Suspense } from 'react'

/** Tải trang theo nhu cầu, có khung chờ nhẹ. */
export const L = (f) => {
  const C = lazy(f)
  return (
    <Suspense fallback={<PageFallback />}>
      <C />
    </Suspense>
  )
}

function PageFallback() {
  return (
    <div className="wrap animate-pulse py-10">
      <div className="mx-auto h-8 w-2/3 max-w-xl rounded bg-paper-3" />
      <div className="mx-auto mt-4 h-4 w-1/2 max-w-md rounded bg-paper-3" />
      <div className="mx-auto mt-10 aspect-[16/9] w-full max-w-3xl rounded bg-paper-3" />
    </div>
  )
}

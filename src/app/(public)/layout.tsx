import TrackVisitor from '@/components/TrackVisitor'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TrackVisitor />
      {children}
    </>
  )
}

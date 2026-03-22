export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏃</span>
          <span className="text-xl font-bold tracking-tight text-white">
            Marunthon
          </span>
        </div>
        <p className="hidden text-sm text-gray-400 sm:block">
          Your one-stop marathon race finder
        </p>
      </div>
    </header>
  )
}

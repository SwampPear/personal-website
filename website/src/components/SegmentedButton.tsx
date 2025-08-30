const SegmentedButton = ({
  active,
  onClick,
  label,
  icon
}: {
  active: boolean
  onClick: () => void
  label: string
  icon?: React.ReactNode
}) => {
  return (
    <button
      onClick={onClick}
      className={[
        'relative rounded-md px-2 sm:px-3 py-1.5 text-xs font-medium transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20',
        active
          ? 'text-black dark:text-white bg-white/60 dark:bg-white/10 shadow-inner'
          : 'text-neutral-800 dark:text-neutral-200 hover:bg-white/20 dark:hover:bg-white/5'
      ].join(' ')}
      aria-pressed={active}
      type='button'
    >
      <span className='inline-flex items-center gap-1.5'>
        {icon}
        {label}
      </span>
    </button>
  )
}

export default SegmentedButton
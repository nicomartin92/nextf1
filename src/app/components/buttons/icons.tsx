import { LucideIcon } from 'lucide-react'
import styles from './Icons.module.css'
import { useState } from 'react'

export default function IconsLucide({
  onClick,
  icon: Icon,
}: {
  onClick: () => void
  icon: LucideIcon
}) {
  const [isActive, setIsActive] = useState(false)

  const handleClick = () => {
    setIsActive(!isActive)
    onClick()
  }

  return (
    <button
      onClick={handleClick}
      className={`${styles.iconsLucide} ${isActive ? styles.active : ''}`}
    >
      <Icon size={20} />
    </button>
  )
}

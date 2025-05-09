import { LucideIcon } from 'lucide-react'
import styles from './Icons.module.css'
import { useState } from 'react'

export default function IconsLucide({
  onClick,
  icon: Icon,
  isSelected,
}: {
  onClick: () => void
  icon: LucideIcon
  isSelected: boolean
}) {
  const [isActive, setIsActive] = useState(false)

  const handleClick = () => {
    setIsActive(!isActive)
    onClick()
  }

  return (
    <button
      onClick={handleClick}
      className={`${styles.iconsLucide} ${isActive || isSelected ? styles.active : ''}`}
    >
      <Icon size={20} />
    </button>
  )
}

import Link from 'next/link'
import styles from './Nav.module.css'

const Nav = () => {
    return (
        <nav className={styles.nav}>
            <ul className="mx-auto w-fit flex gap-4 uppercase">
                <li>
                    <Link href="/">Home</Link>
                    <Link href="/formule">Les courses</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Nav
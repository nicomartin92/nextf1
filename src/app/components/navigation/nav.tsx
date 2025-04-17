import Link from 'next/link'

const Nav = () => {
    return (
        <nav className="flex gap-4 p-4 bg-gray-100">
            <ul>
                <li>
                    <Link href="/">Home</Link>
                    <Link href="/formule">Formule</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Nav
import styles from './Card.module.css'

type Constructor = {
    name: string
    nationality: string
} 

const Card = ({ result, children }: { result: Constructor, children?: React.ReactNode }) => {
    return (
        <div className={styles.card}>
            <div className="constructor">
                <h2>{result.name}</h2>
                <p>{result.nationality}</p>
                {children}
            </div>
        </div>
    )
}

export default Card
interface PageProps {
  params: Promise<{
    circuitId: string;
  }>
}

export default async function CircuitPage({ params }: PageProps) {
    const { circuitId } = await params;
    
    return (
        <div>
            <h1>Circuit {circuitId}</h1>
        </div>
    )
}
interface PageCircuitProps {
  params: {
    circuitId: string;
  };
}

export default function CircuitPage({ params }: PageCircuitProps) {
    const { circuitId } = params;
    
    return (
        <div>
            <h1>Circuit {circuitId}</h1>
        </div>
    )
}
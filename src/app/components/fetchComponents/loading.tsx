// Composant de chargement
const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500">
        <span className="sr-only">Chargement...</span>
      </div>
    </div>
  )

export default LoadingSpinner
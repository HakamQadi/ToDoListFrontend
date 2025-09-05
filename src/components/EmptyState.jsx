const EmptyState = ({ title, description, icon: Icon, className = "" }) => {
  return (
    <div className={`text-center py-8 ${className}`}>
      {Icon && (
        <div className="flex justify-center mb-4">
          <Icon className="w-12 h-12 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500">{description}</p>}
    </div>
  )
}

export default EmptyState

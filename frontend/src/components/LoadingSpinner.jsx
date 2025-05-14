const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`relative ${sizeMap[size]}`}
      >
        <div className={`absolute inset-0 rounded-full border-4 border-t-transparent border-b-transparent border-blue-500 animate-spin`} />
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 blur-sm opacity-30 animate-pulse" />
      </div>
    </div>
  );
};

export default LoadingSpinner;

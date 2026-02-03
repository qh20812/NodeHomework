function Loading() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <span className="loading loading-spinner loading-lg text-primary-600"></span>
        <p className="text-gray-600 font-medium">Đang tải...</p>
      </div>
    </div>
  )
}

export default Loading

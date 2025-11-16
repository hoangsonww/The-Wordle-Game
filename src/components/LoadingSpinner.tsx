/**
 * LoadingSpinner component displays a loading animation
 */
export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
    </div>
  );
}

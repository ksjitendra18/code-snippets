export default function UserManagementLoading() {
  return (
    <div className="flex flex-col md:max-w-1/2 px-4 mt-10 mx-auto">
      <div className="h-9 w-48 bg-gray-200 rounded-md animate-pulse mx-auto my-5" />

      <div className="mt-4">
        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
      </div>

      <div className="mt-4">
        <div className="h-5 w-12 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
      </div>

      <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse my-5" />
    </div>
  );
}
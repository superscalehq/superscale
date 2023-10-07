'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold">Error</h1>
      <p className="text-gray-500">Something went wrong</p>
    </div>
  );
}

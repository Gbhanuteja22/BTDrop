export function DebugStyles() {
  return (
    <div>
      <h2>Tailwind Debug Test</h2>
      <div className="bg-red-500 text-white p-4 m-2">Red Background</div>
      <div className="bg-blue-500 text-white p-4 m-2">Blue Background</div>
      <div className="bg-green-500 text-white p-4 m-2">Green Background</div>
      <div className="text-center text-xl font-bold">Centered Bold Text</div>
      <div className="flex justify-between">
        <span>Left</span>
        <span>Center</span>
        <span>Right</span>
      </div>
    </div>
  );
}

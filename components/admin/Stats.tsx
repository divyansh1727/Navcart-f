export default function Stats() {
  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded shadow">
        <h3>Total Orders</h3>
        <p className="text-2xl font-bold">0</p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3>Total Users</h3>
        <p className="text-2xl font-bold">0</p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3>Revenue</h3>
        <p className="text-2xl font-bold">₹0</p>
      </div>
    </div>
  );
}

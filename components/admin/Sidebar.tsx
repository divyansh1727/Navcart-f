export default function Sidebar() {
  return (
    <div className="w-64 bg-black text-white p-6">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul className="space-y-4">
        <li>Dashboard</li>
        <li>Orders</li>
        <li>Users</li>
      </ul>
    </div>
  );
}

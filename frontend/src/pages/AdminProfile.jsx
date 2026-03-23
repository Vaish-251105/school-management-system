export default function AdminProfile() {

  const user = JSON.parse(localStorage.getItem("currentUser"));

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Admin Profile
      </h1>

      <div className="bg-white p-6 rounded-xl shadow max-w-md">

        <p><b>Name:</b> {user?.name}</p>
        <p><b>Email:</b> {user?.email}</p>
        <p><b>Role:</b> {user?.role}</p>

      </div>

    </div>

  );
}
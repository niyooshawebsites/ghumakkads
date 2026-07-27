import EditPasswordFrom from "./EditPasswordForm";

export default function EditPassword() {
  return (
    <div className="flex flex-col justify-start min-h-screen">
      <h1 className="text-2xl font-bold mb-4 content-end">Update Password</h1>
      <div className="flex justify-center items-center w-4/12 md-w-full border border-gray-300 rounded-lg">
        <div className="w-full bg-gray-50 p-5 rounded-lg space-y-3">
          <h1>Fill out the details to update your password: </h1>
          <EditPasswordFrom />
        </div>
      </div>
    </div>
  );
}

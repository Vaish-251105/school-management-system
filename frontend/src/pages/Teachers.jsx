import { useState, useMemo } from "react"
import { useTeacher } from "../context/TeacherContext"

const Teachers = () => {

  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useTeacher()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
  })

  const [editId, setEditId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const handleSubmit = (e) => {

    e.preventDefault()

    if (!formData.name || !formData.email || !formData.subject) return

    if (editId) {

      updateTeacher(editId, formData)
      setEditId(null)

    } else {

      addTeacher(formData)

    }

    setFormData({
      name: "",
      email: "",
      subject: ""
    })

  }

  const handleEdit = (teacher) => {

    setFormData({
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
    })

    setEditId(teacher.id)

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })

  }

  const handleDelete = (id) => deleteTeacher(id)

  const filteredTeachers = useMemo(() => {

    return teachers.filter((teacher) =>
      teacher.name.toLowerCase().includes(
        searchTerm.toLowerCase()
      )
    )

  }, [teachers, searchTerm])

  return (

    <div className="min-h-screen p-6 space-y-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      <h2 className="text-2xl font-bold dark:text-white">
        Teachers Management
      </h2>

      {/* Teacher Count Card */}

      <div className="backdrop-blur-xl bg-white/70 dark:bg-white/10 shadow-xl rounded-xl p-5 w-fit">

        <h4 className="text-sm text-gray-500 dark:text-gray-300">
          Total Teachers
        </h4>

        <p className="text-2xl font-bold text-indigo-600">
          {teachers.length}
        </p>

      </div>

      {/* Form */}

      <div className="backdrop-blur-xl bg-white/70 dark:bg-white/10 shadow-xl rounded-xl p-6">

        <h3 className="text-lg font-semibold mb-4 dark:text-white">

          {editId ? "Edit Teacher" : "Add Teacher"}

        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-3"
        >

          <input
            type="text"
            name="name"
            placeholder="Teacher Name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="p-2 rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />

          <button
            type="submit"
            className="md:col-span-3 bg-indigo-600 text-white py-2 rounded-lg hover:scale-105 transition"
          >

            {editId ? "Update Teacher" : "Add Teacher"}

          </button>

        </form>

      </div>

      {/* Search */}

      <input
        type="text"
        placeholder="Search teacher..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 rounded border w-full md:w-80 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      />

      {/* Table */}

      <div className="backdrop-blur-xl bg-white/70 dark:bg-white/10 shadow-xl rounded-xl p-4 overflow-x-auto">

        <table className="w-full text-left">

          <thead>

            <tr className="border-b dark:border-gray-700">

              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredTeachers.length > 0 ? (

              filteredTeachers.map((teacher) => (

                <tr
                  key={teacher.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >

                  <td className="p-3">
                    {teacher.name}
                  </td>

                  <td className="p-3">
                    {teacher.email}
                  </td>

                  <td className="p-3">
                    {teacher.subject}
                  </td>

                  <td className="p-3 space-x-3">

                    <button
                      onClick={() => handleEdit(teacher)}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(teacher.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="4"
                  className="text-center p-4"
                >

                  No teachers found

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  )

}

export default Teachers
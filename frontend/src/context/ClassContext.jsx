import { createContext, useContext, useState, useEffect } from "react"

const ClassContext = createContext()

export const ClassProvider = ({ children }) => {

  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem("classes")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(classes))
  }, [classes])

  const addClass = (cls) => {
    setClasses(prev => [
      ...prev,
      {
        ...cls,
        id: Date.now(),
        studentIds: []   // 🔥 IMPORTANT
      }
    ])
  }

  const updateClass = (id, updated) => {
    setClasses(prev =>
      prev.map(c => c.id === id ? { ...c, ...updated } : c)
    )
  }

  const deleteClass = (id) => {
    setClasses(prev => prev.filter(c => c.id !== id))
  }

  return (
    <ClassContext.Provider
      value={{
        classes,
        setClasses,   // 🔥 MUST BE EXPORTED
        addClass,
        updateClass,
        deleteClass
      }}
    >
      {children}
    </ClassContext.Provider>
  )
}

export const useClass = () => useContext(ClassContext)
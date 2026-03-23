import { createContext, useState, useEffect } from "react"

export const FeesContext = createContext()

export const FeesProvider = ({ children }) => {
  const [fees, setFees] = useState(() => {
    const saved = localStorage.getItem("fees")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("fees", JSON.stringify(fees))
  }, [fees])

  const addFee = (fee) => {
    setFees([...fees, fee])
  }

  const deleteFee = (id) => {
    setFees(fees.filter((f) => f.id !== id))
  }

  return (
    <FeesContext.Provider value={{ fees, addFee, deleteFee }}>
      {children}
    </FeesContext.Provider>
  )
}
import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const [user,setUser] = useState(null)

  useEffect(()=>{

    const saved = JSON.parse(localStorage.getItem("currentUser"))

    if(saved){
      setUser(saved)
    }

  },[])

  const login = (email,password) => {

    const users = JSON.parse(localStorage.getItem("users")) || []

    const found = users.find(
      u => u.email === email && u.password === password
    )

    if(!found){
      return false
    }

    setUser(found)

    localStorage.setItem("currentUser",JSON.stringify(found))

    return found
  }

  const logout = ()=>{

    setUser(null)

    localStorage.removeItem("currentUser")

  }

  return (

    <AuthContext.Provider value={{user,login,logout}}>
      {children}
    </AuthContext.Provider>

  )

}

export const useAuth = ()=>useContext(AuthContext)
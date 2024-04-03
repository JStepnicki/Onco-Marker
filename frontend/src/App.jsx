import { useState, useEffect } from 'react'


function App() {
  const [data, setData] = useState([])
  useEffect(() => {
    async function fetchData() {
      console.log(import.meta.env.VITE_API_URL)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}tests/`, { mode: 'cors' })
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        console.log(data)
        setData(data)
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error)
      }
    }
    fetchData()
    
  }, [])


  return (
    <>
      Hello World
    </>
  )
}

export default App

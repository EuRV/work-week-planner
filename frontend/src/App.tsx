import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// Создаем экземпляр axios для запросов к бекенду
const api = axios.create({
  baseURL: 'http://localhost:3000', // URL вашего Fastify сервера
  headers: {
    'Content-Type': 'application/json',
  },
})

function App() {
  const [message, setMessage] = useState('Loading...')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Функция для загрузки данных с бекенда
  const fetchHello = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api')
      setMessage(response.data.message)
      setError('')
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load data from backend')
      setMessage('Error: Could not connect to backend')
    } finally {
      setLoading(false)
    }
  }

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchHello()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-3xl font-bold underline">
          {loading ? 'Loading...' : message}
        </h1>
        
        {error && (
          <div style={{ color: 'red', marginTop: '20px' }}>
            <p>{error}</p>
            <button 
              onClick={fetchHello}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}
        
        <div style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
          <p>Backend: http://localhost:3000/api/hello</p>
          <p>Status: {loading ? 'Loading...' : 'Loaded successfully!'}</p>
        </div>
      </header>
    </div>
  )
}

export default App

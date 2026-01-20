import buildApp from './app.js'

// Запуск сервера
const start = async () => {
  try {
    const app = await buildApp()

    const host = process.env.HOST || '127.0.0.1'
    const port = parseInt(process.env.PORT || '3000', 10)

    await app.listen({ host, port })

    console.log(`🚀 Server running on http://${host}:${port}`)
    console.log(`📝 Environment: ${process.env.NODE_ENV}`)

    if (process.env.NODE_ENV === 'development') {
      console.log('\n📊 Registered routes:')
      app.printRoutes()
    }
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()

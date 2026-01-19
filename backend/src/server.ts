import buildApp from './app.js'

const app = buildApp()

// Запуск сервера
const start = async () => {
  try {
    const app = await buildApp()

    await app.listen({ port: 3000, host: '127.0.0.1' })
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()

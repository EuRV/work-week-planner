import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema.js'

// Получаем строку подключения
const connectionString = process.env.DATABASE_URL!

// Проверяем DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables')
}

// Создаем клиент PostgreSQL
const client = postgres(connectionString)

// Инициализируем Drizzle
export const db = drizzle(client, { schema })

// Реэкспортируем типы и схему
export type { Event, NewEvent } from './schema.js'
export { schema }

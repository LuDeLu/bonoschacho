import { createPool, type Pool } from "mysql2/promise"

let pool: Pool | null = null

export async function getPool(): Promise<Pool> {
  if (!pool) {
    try {
      pool = createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: process.env.VERCEL_ENV === "production" ? { rejectUnauthorized: true } : undefined,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      })

      // Verificar la conexión
      const connection = await pool.getConnection()
      console.log("Conexión a la base de datos establecida correctamente")
      console.log("Host:", process.env.DB_HOST)
      console.log("Usuario:", process.env.DB_USER)
      console.log("Base de datos:", process.env.DB_NAME)
      connection.release()
    } catch (error) {
      console.error("Error al crear el pool de conexiones:", error)
      throw error
    }
  }
  return pool
}


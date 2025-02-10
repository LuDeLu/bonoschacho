import { createPool, type Pool } from "mysql2/promise"

let pool: Pool | null = null

export async function getPool(): Promise<Pool> {
  if (!pool) {
    try {
      pool = createPool({
        host: "marianod.sg-host.com",
        user: "u9tkeoegnj0dq",
        password: "Calpol12345",
        database: "dbrdoe8nedbxfl",
        ssl: process.env.VERCEL_ENV === "production" ? { rejectUnauthorized: true } : undefined,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      })

      // Verificar la conexión
      const connection = await pool.getConnection()
      console.log("Conexión a la base de datos establecida correctamente")
      console.log("Host:", "marianod.sg-host.com")
      console.log("Usuario:", "u9tkeoegnj0dq")
      console.log("Base de datos:", "dbrdoe8nedbxfl")
      connection.release()
    } catch (error) {
      console.error("Error al crear el pool de conexiones:", error)
      throw error
    }
  }
  return pool
}


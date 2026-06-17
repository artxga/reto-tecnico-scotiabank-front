const { Client } = require("pg");
require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: ".env.local" });

const initialData = [
  {
    id: "1",
    title: "Renovación de equipo de cómputo",
    description:
      "Mi laptop actual presenta fallas constantes y lentitud. Necesito un equipo de reemplazo para poder trabajar correctamente.",
    status: "pending",
    priority: "medium",
    category: "Hardware",
    requester: "Juan Pérez",
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    lastChangeDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "2",
    title: "Acceso a base de datos de pruebas",
    description: "Necesito acceso a la base de datos de QA para validar el nuevo módulo de pagos.",
    status: "approved",
    priority: "high",
    category: "Accesos",
    requester: "María García",
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    lastChangeDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: "3",
    title: "Servidor de producción caído",
    description:
      "El servidor principal no responde a las peticiones, error 502 Bad Gateway continuo.",
    status: "in_review",
    priority: "critical",
    category: "Infraestructura",
    requester: "Carlos López",
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    lastChangeDate: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Licencia de software de diseño",
    description:
      "Renovación de la licencia anual para la suite de diseño requerida para el proyecto de marketing.",
    status: "rejected",
    priority: "medium",
    category: "Software",
    requester: "Ana Torres",
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    lastChangeDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: "5",
    title: "Permiso para trabajo remoto extendido",
    description: "Solicito 2 semanas de trabajo remoto por motivos familiares fuera de la ciudad.",
    status: "closed",
    priority: "low",
    category: "Recursos Humanos",
    requester: "Luis Martínez",
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    lastChangeDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
];

async function setup() {
  let connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

  if (!connectionString) {
    console.error("Error: POSTGRES_URL environment variable is missing.");
    process.exit(1);
  }

  // Remove sslmode from query string to let pg config take over
  connectionString = connectionString.split("?")[0];

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Connected to Supabase Postgres.");

    // Create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS requests (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL,
        priority TEXT NOT NULL,
        category TEXT NOT NULL,
        requester TEXT NOT NULL,
        "creationDate" TIMESTAMP WITH TIME ZONE NOT NULL,
        "lastChangeDate" TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `);
    console.log("Table 'requests' created or already exists.");

    // Check if empty
    const res = await client.query("SELECT COUNT(*) FROM requests");
    if (parseInt(res.rows[0].count) === 0) {
      console.log("Table is empty. Inserting initial data...");

      const insertQuery = `
        INSERT INTO requests (id, title, description, status, priority, category, requester, "creationDate", "lastChangeDate")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;

      for (const req of initialData) {
        await client.query(insertQuery, [
          req.id,
          req.title,
          req.description,
          req.status,
          req.priority,
          req.category,
          req.requester,
          req.creationDate,
          req.lastChangeDate,
        ]);
      }
      console.log("Initial data inserted successfully.");
    } else {
      console.log("Table already contains data. Skipping insertion.");
    }
  } catch (err) {
    console.error("Error during database setup:", err);
  } finally {
    await client.end();
  }
}

setup();

export {};

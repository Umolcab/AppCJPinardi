import postgres from 'postgres';

// Conexión segura usando la variable que Netlify creó por ti
const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require'
});

export default async (request) => {
  // Solo permitimos enviar datos (POST)
  if (request.method !== 'POST') {
    return new Response("Método no permitido", { status: 405 });
  }

  try {
    // Leemos los datos que envía el HTML
    const body = await request.json();
    const { medallaId, razon, imagen } = body;

    // Guardamos en Neon
    await sql`
      INSERT INTO registros (medalla_id, razon, imagen)
      VALUES (${medallaId}, ${razon}, ${imagen})
    `;

    return new Response(JSON.stringify({ message: "Guardado con éxito" }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error al guardar en base de datos" }), {
      status: 500
    });
  }
};
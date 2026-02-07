import postgres from 'postgres';

const sql = postgres(process.env.NETLIFY_DATABASE_URL, {
  ssl: 'require'
});

export default async (request) => {
  // Configuración para que el navegador no se queje
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    // Pedimos las últimas 50 fotos (para no cargar mil de golpe)
    const registros = await sql`
      SELECT * FROM registros 
      ORDER BY id DESC 
      LIMIT 50
    `;

    return new Response(JSON.stringify(registros), {
      status: 200,
      headers
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error al leer datos" }), {
      status: 500,
      headers
    });
  }
};
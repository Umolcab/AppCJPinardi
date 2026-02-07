import postgres from 'postgres';

// 1. Verificamos si la variable existe
if (!process.env.DATABASE_URL) {
  console.error("❌ ERROR CRÍTICO: No existe la variable DATABASE_URL");
}

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require'
});

export default async (request) => {
  // Configuración de cabeceras para evitar problemas de CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (request.method === 'OPTIONS') {
    return new Response("OK", { headers });
  }

  if (request.method !== 'POST') {
    return new Response("Método no permitido", { status: 405, headers });
  }

  try {
    const body = await request.json();
    const { medallaId, razon, imagen } = body;

    // Intentamos guardar
    await sql`
      INSERT INTO registros (medalla_id, razon, imagen)
      VALUES (${medallaId}, ${razon}, ${imagen})
    `;

    return new Response(JSON.stringify({ message: "Guardado con éxito" }), {
      status: 200,
      headers
    });

  } catch (error) {
    // AQUI ESTÁ EL CAMBIO: Devolvemos el error real al navegador
    console.error("Error SQL:", error);
    return new Response(JSON.stringify({ 
      error: "Error en base de datos", 
      detalles: error.message, // Nos dirá qué pasó
      codigo: error.code // Nos dará el código técnico
    }), {
      status: 500,
      headers
    });
  }
};
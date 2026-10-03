export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/messages" && request.method === "GET") {
      const { results } = await env.DB
        .prepare("SELECT * FROM messages ORDER BY created_at DESC")
        .all();

      return Response.json(results);
    }

    if (url.pathname === "/api/messages" && request.method === "POST") {
      const { name, message } = await request.json();

      await env.DB
        .prepare("INSERT INTO messages (name, message) VALUES (?, ?)")
        .bind(name, message)
        .run();

      return Response.json({ success: true });
    }

    return new Response("Not found", { status: 404 });
  },
};
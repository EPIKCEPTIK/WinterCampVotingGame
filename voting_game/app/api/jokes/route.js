
import { connectDB } from "../../lib/database.js";
import { Joke } from "../../lib/models.js";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("Received data:", body);

    const { id, question, answer, votes, availableVotes } = body;

    if (!id || !question || !answer) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Переконаємося, що votes є об'єктом, а не масивом
    const formattedVotes = votes && typeof votes === "object" ? votes : {};

    const joke = new Joke({
      id,
      question,
      answer,
      votes: formattedVotes, // Виправлено
      availableVotes: availableVotes || ["😂", "👍", "❤️"] // Виправлено
    });

    await joke.save();
    console.log("New joke saved:", joke);

    return new Response(JSON.stringify({ message: "Joke saved", joke }), { status: 201 });
  } catch (error) {
    console.error("Error saving joke:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

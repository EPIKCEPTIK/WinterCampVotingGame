import { connectToDatabase } from "/config/database";
import Joke from "/models/Jok";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    const { jokeId, vote } = req.body;

    try {
      const joke = await Joke.findOne({ id: jokeId });
      if (!joke) return res.status(404).json({ message: "Жарт не знайдено" });

      joke.votes.push(vote);
      await joke.save();

      return res.status(200).json({ message: "Реакція збережена" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.status(405).json({ message: "Метод не дозволений" });
}
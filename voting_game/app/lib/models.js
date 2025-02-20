import mongoose from "mongoose";

// Define the schema for a joke
const jokeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    votes: { type: Map, of: Number, default: new Map() }, // Store votes as a map of emoji -> count
    availableVotes: { type: [String], default: [] }, // List of available emoji reactions
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Use existing model if available, otherwise create a new one
export const Joke = mongoose.models.Joke || mongoose.model("Joke", jokeSchema);

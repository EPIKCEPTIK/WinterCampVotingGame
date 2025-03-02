"use client";

import { useEffect, useState } from "react";
import { fetchJoke } from "./lib/data.js";
import { Button, Card, Text, Title, Center, Stack, Group } from "@mantine/core";

// Define the joke structure
interface Joke {
  id: string;
  question: string;
  answer: string;
  votes: Record<string, number>;
  availableVotes: string[];
}

// List of available reaction emojis
const availableReactions = ["😂", "👍", "❤️"];

export default function HomePage() {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState<Record<string, number>>({});

  // Fetch a new joke from the API
  const getNewJoke = async () => {
    setLoading(true);

    try {
      const newJoke = await fetchJoke();
      if (newJoke) {
        setJoke({ ...newJoke, votes: {}, availableVotes: availableReactions });
        setVotes({});
      }
    } catch (error) {
      console.error("Error fetching joke:", error);
    }

    setLoading(false);
  };

  // Save the joke along with the votes to the database
  const saveJokeToDB = async () => {
    if (!joke) return;

    try {
      const res = await fetch("/api/jokes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...joke, votes }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error saving joke:", errorData);
        return;
      }

      console.log("Joke saved successfully!");
      getNewJoke(); // Load a new joke after saving
    } catch (error) {
      console.error("API connection error:", error);
    }
  };

  // Handle emoji-based voting
  const voteJoke = (emoji: string) => {
    if (!joke) return;

    setVotes((prevVotes) => {
      const updatedVotes = { ...prevVotes, [emoji]: (prevVotes[emoji] || 0) + 1 };
      setJoke((prev) => (prev ? { ...prev, votes: updatedVotes } : prev));
      return updatedVotes;
    });
  };


  const resetVotes = () => {
    setVotes({});
    setJoke((prev) => (prev ? { ...prev, votes: {} } : prev));
  };

  // Fetch a joke on initial render
  useEffect(() => {
    getNewJoke();
  }, []);

  return (
    <Center style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <Stack align="center" gap={20}>
        <Title order={2}>Random Joke</Title>
        {loading ? (
          <Text>Loading...</Text>
        ) : joke ? (
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ width: 400, textAlign: "center" }}
          >

            <Text fw={500} size="lg">{joke.question}</Text>
            <Text size="md" mt="sm">{joke.answer}</Text>


            <Group justify="flex-end" mt="md">
              {availableReactions.map((emoji) => (
                <Button key={emoji} onClick={() => voteJoke(emoji)}>
                  {emoji} {votes[emoji] || 0}
                </Button>
              ))}
            </Group>


            <Group mt="md">
              <Button color="gray" onClick={saveJokeToDB} fullWidth>
                Another Joke
              </Button>
              <Button color="red" onClick={resetVotes} fullWidth>
                Reset Reactions
              </Button>
            </Group>
          </Card>
        ) : (
          <Text>No joke found 😢</Text>
        )}
      </Stack>
    </Center>
  );
}

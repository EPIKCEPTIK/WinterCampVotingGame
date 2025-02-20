
export const fetchJoke = async () => {
    try {
      const res = await fetch("https://teehee.dev/api/joke");
      if (!res.ok) throw new Error("Error of getting joke");
      return await res.json();
    } catch (error) {
      console.error("Error loading:", error);
      return null;
    }
  };
  
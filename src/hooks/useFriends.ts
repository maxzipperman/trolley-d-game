import { useLocalStorage } from "./useLocalStorage";
import { computeBaseCounts, Choice } from "@/utils/scoring";
import { useScores } from "./useScores";

export interface FriendData {
  name: string;
  answers: Record<string, Choice>;
}

const FRIENDS_KEY = "trolleyd-friends";

export function useFriends() {
  const [friends, setFriends] = useLocalStorage<FriendData[]>(FRIENDS_KEY, []);
  const [scores, setScores] = useScores();

  function importFriend(json: string) {
    try {
      const parsed = JSON.parse(json) as FriendData | FriendData[];
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const valid = arr.filter(
        (f): f is FriendData =>
          f && typeof f.name === "string" && typeof f.answers === "object"
      );
      if (valid.length === 0) return;

      const newFriends = [...friends, ...valid];
      setFriends(newFriends);

      const newScores = { ...scores };
      valid.forEach((f) => {
        const { scoreA, scoreB } = computeBaseCounts(f.answers);
        newScores[f.name] = { scoreA, scoreB };
      });
      setScores(newScores);
    } catch {
      // invalid json; ignore
    }
  }

  return { friends, importFriend };
}

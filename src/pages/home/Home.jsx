
import RecipeList from '../../components/RecipeList'
import { recipeStore } from '../../firebase/config'
import {useState, useEffect} from "react";
import './Home.css'


export default function Home() {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsPending(true);
    const unsub = recipeStore.collection("rezepte").onSnapshot(
      (snapshot) => {
        if (snapshot.empty) {
          setError("No recipes to load");
          setIsPending(false);
        } else {
          let result = [];
          snapshot.docs.forEach((doc) => {
            result.push({ id: doc.id, ...doc.data() });
          });
          setData(result);
          setIsPending(false);
        }
      },
      (err) => {
        setError(err.message);
        setIsPending(false);
      }
    );
    return () => unsub();
  }, []);

  return (
    <div className="home">
      {error && <p className="error">{error}</p>}
      {isPending && <p className="loading">Loading...</p>}
      {data && <RecipeList recipes={data} />}
    </div>
  );
}

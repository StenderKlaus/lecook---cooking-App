import {useState, useEffect} from 'react';
import { useParams } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { recipeStore } from '../../firebase/config'
// styles
import "./Recipe.css";

export default function Recipe() {
  const { id } = useParams();
  const { mode } = useTheme();
  const [recipe, setRecipe] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);
  const handleUpdate = () => {

    recipeStore.collection("rezepte").doc(id).update({
      title: "Something else",
    });
  };
  useEffect(() => {
    setIsPending(true);
  
    const unsub = recipeStore
      .collection("rezepte")
      .doc(id)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setIsPending(false);
          setRecipe(doc.data());
        } else {
          setIsPending(false);
          setError("Could not find");
        }
      });
  
    return () => unsub();
  }, [id]);

  return (
    <div className={`recipe ${mode}`}>
      {error && <p className="error">{error}</p>}
      {isPending && <p className="loading">Loading...</p>}
      {recipe && (
        <>
          <h2 className="page-title">{recipe.title}</h2>
          <p>Takes {recipe.cookingTime} to cook.</p>
          <ul>
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
          <p className="method">{recipe.method}</p>
        </>
      )}
      <button onClick={() => handleUpdate()}>Update Recipe</button>
    </div>
  );
}

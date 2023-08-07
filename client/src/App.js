import "./App.css";
import { gql, useQuery } from "@apollo/client";
//Create query
const query = gql`
  query GetTodosWithUser {
    getTodos {
      id
      title
      userId
      user {
        id
        name
      }
    }
  }
`;
function App() {
  //Execute query using useQuery
  const { data, isLoading } = useQuery(query);
  if (isLoading) return <h1>Loading....</h1>;
  return <div className="App">{JSON.stringify(data)}</div>;
}

export default App;

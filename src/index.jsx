/*** APP ***/
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  useQuery,
  useMutation,
} from "@apollo/client";

import { link } from "./link.js";
import "./index.css";

const ALL_PEOPLE = gql`
  query AllPeople {
    people {
      id
      name
    }
  }
`;

function Title() {
  const people = usePeople();

  return <h1>{people[0].name}</h1>;
}

function AddToCart() {
  const people = usePeople();

  return <button>{people[0].name}</button>;
}

function Hidden() {
  const people = usePeople();
  return null;
}

function ItemCard() {
  const people = usePeople();

  return (
    <div>
      <Title />
      {Array.from({ length: 30 }).map(() => (
        <Hidden />
      ))}
      <AddToCart />
    </div>
  );
}

function Row() {
  const people = usePeople();
  return (
    <div style={{ display: "flex" }}>
      {people.map((person) => (
        <>
          <ItemCard />
          <ItemCard />
          <ItemCard />
          <ItemCard />
          <ItemCard />
        </>
      ))}
    </div>
  );
}

function Grid() {
  const people = usePeople();
  if (!people) return <div>Loading...</div>;
  return people.map((person) => (
    <>
      <Row />
      <Row />
      <Row />
    </>
  ));
}

/**
 *
 * Comment out the first two lines and uncomment the rest to see how much faster
 * the app runs without using useQuery
 */
function usePeople() {
  const query = useQuery(ALL_PEOPLE);
  return query.data?.people;

  // const peopleData = [
  //   { id: 1, name: "John Smith" },
  //   { id: 2, name: "Sara Smith" },
  //   { id: 3, name: "Budd Deey" },
  // ];

  // return peopleData;
}

function App() {
  const query = useQuery(ALL_PEOPLE);
  const [show, setShow] = useState(false);
  const flip = () => {
    query.refetch();
    setShow(!show);
  };

  return (
    <div>
      <button onClick={flip}>Click Me</button>
      {show && <Grid />}
    </div>
  );
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

import React, { useState } from "react";
import Head from 'next/head';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from "next/router";

const ToDoQuery = gql`
  query ToDoQuery($id: ID!) {
    todo(id: $id) {
          id
          index
          title
          description
          done
          project
          dueDate
    }
  }
`;

function ToDo() {
    const router = useRouter();
    const { id } = router.query;
    // TODO add types to useQuery, or use a codegen to make query/mutation hooks
    const { data, loading, error, fetchMore } = useQuery(ToDoQuery, {
        variables: { id },
      });

      if (loading) return <p>Loading...</p>;
      if (error) return <p>Oh no... {error.message}</p>;

      const { title, description, dueDate, completed } = data.todo;
    
  return (
    <div>
      <Head>
        <title>ToDo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick={() => router.back()} className="rounded-sm bg-slate-300 p-3">Back</button>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
  );
}

export default ToDo;


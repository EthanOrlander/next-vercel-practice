import React, { useState } from "react";
import Head from 'next/head';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { ToDoItem } from '../../components/ToDoItem';
import { CreateToDoModal } from "../../components/CreateToDoModal";

const AllToDosQuery = gql`
  query allToDosQuery($first: Int, $after: String) {
    todos(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          index
          title
          description
          done
          project
          dueDate
        }
      }
    }
  }
`;

function ToDo() {
  const { data, loading, error, fetchMore } = useQuery(AllToDosQuery, {
    variables: { first: 3 },
  });
  const [createToDoOpen, setCreateToDoOpen] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  const { endCursor, hasNextPage } = data?.todos.pageInfo;

  // Pagination not working
  return (
    <div>
      <Head>
        <title>ToDo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CreateToDoModal isOpen={createToDoOpen} setIsOpen={setCreateToDoOpen}/>
      <div className="container mx-auto max-w-5xl my-20 px-5">
      <button onClick={() => setCreateToDoOpen(true)} className="rounded-sm bg-slate-300 p-3">Create ToDo</button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.todos.edges.map(({ node }, i) => (
            <Link href={`/todo/${node.id}`} key={i}>
              <a>
                <ToDoItem
                  title={node.title}
                  project={node.project}
                  id={node.id}
                  description={node.description}
                  done={node.done}
                  dueDate={node.dueDate}
                />
              </a>
            </Link>
          ))}
        </div>
        {hasNextPage ? (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded my-10"
            onClick={() => {
              fetchMore({
                variables: { after: endCursor },
              });
            }}
          >
            more
          </button>
        ) : (
          <p className="my-10 text-center font-medium">
            You&apos;ve reached the end!
          </p>
        )}
      </div>
    </div>
  );
}

export default ToDo;


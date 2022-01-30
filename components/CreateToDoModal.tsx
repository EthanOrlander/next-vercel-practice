import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import {gql, useMutation} from "@apollo/client";

interface CreateToDoModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const CreateToDoMutation = gql`
  mutation createToDoMutation($title: String!, $description: String!, $dueDate: String!) {
    createToDo(title: $title, description: $description, dueDate: $dueDate) {
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

// New TODOs do not appear without reload because the query used on the todos page uses edge and node, whereas this just returns a TODO
// console.log _APOLLO_CLIENT_.cache.data to see what I mean
export const CreateToDoModal = ({ isOpen, setIsOpen }: CreateToDoModalProps) => {
    const [createToDo, { data, loading, error }] = useMutation(CreateToDoMutation);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
   return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white rounded max-w-sm mx-auto p-8">
          <Dialog.Title className="text-xl">New ToDo</Dialog.Title>
          <form onSubmit={e => {
              e.preventDefault();
              createToDo({ variables: { title, description, dueDate } }).then(() => setIsOpen(false));
          }}>
          <Dialog.Description className="mt-2">
            <label htmlFor="title" style={{width: "100%"}}>Title</label><input type="text" name="title" style={{width: "100%"}} value={title} onChange={e => setTitle(e.target.value)}/>
            <label htmlFor="description" style={{width: "100%"}}>Description</label><input type="text" name="description" style={{width: "100%"}} value={description} onChange={e => setDescription(e.target.value)}/>
            <label htmlFor="due_date" style={{width: "100%"}}>Due Date</label><input type="date" name="due_date" style={{width: "100%"}} value={dueDate} onChange={e => setDueDate(e.target.value)}/>
            {/* <label htmlFor="project">Project</label><input type="text" name="project"/> */}
          </Dialog.Description>
          <button
            className="border-black border-solid border rounded-sm mx-2 mt-8 py-1 px-2"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className="bg-slate-300 rounded-sm mx-2 mt-8 py-1 px-2"
            type="submit"
          >
            Confirm
          </button>
          </form>
        </div>
    </Dialog>
   )
    }
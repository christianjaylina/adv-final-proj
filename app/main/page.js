"use client";

import React, { useState, useEffect } from "react";
import TaskCard from "../components/TaskCard";
import { db, addDoc, collection, getDocs, deleteDoc, doc, updateDoc, getDoc, setDoc} from "../lib/firebase";
import { auth } from "../lib/firebase"; 
import { signOut } from "firebase/auth"; 
import { useRouter } from "next/navigation"; 

export default function Page() {
const [tasks, setTasks] = useState([]);
const [task, setTask] = useState("");
const [priority, setPriority] = useState("low");
const [search, setSearch] = useState("");
const [filteredTasks, setFilteredTasks] = useState(tasks);
const [isModalOpen, setIsModalOpen] = useState(false);
const [isEditing, setIsEditing] = useState(false);  
const [currentTask, setCurrentTask] = useState(null);  
const [userEmail, setUserEmail] = useState("");


const router = useRouter(); 
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userId = auth.currentUser ? auth.currentUser.uid : "defaultUserId";  
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const tasksList = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((task) => task.userId === userId); 
        setTasks(tasksList);
        setFilteredTasks(tasksList);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };

    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);  
    }

    fetchTasks();
  }, []);
  

  const handleAddTask = async () => {
    if (!task) return;
  
    const userId = auth.currentUser ? auth.currentUser.uid : "defaultUserId"; 
  
    const newTask = { task, priority, status: "in-progress", userId };
  
    try {
      const docRef = await addDoc(collection(db, "tasks"), newTask);
      setTasks([...tasks, { ...newTask, id: docRef.id }]);
      setFilteredTasks([...tasks, { ...newTask, id: docRef.id }]);
      setTask("");
      setPriority("low");
      setIsModalOpen(false);
    } catch (e) {
      console.error("Error adding task: ", e);
    }
  };
  
  const handleUpdateTask = async () => {
    if (!task || !currentTask) return;
  
    const updatedTask = {
      task,
      priority,
      status: currentTask.status || "in-progress",
      userId: currentTask.userId || "defaultUserId",
    };
  
    try {
      const taskRef = doc(db, "tasks", currentTask.id);
      await updateDoc(taskRef, updatedTask);
  
      const updatedTasks = tasks.map((task) =>
        task.id === currentTask.id ? { ...task, ...updatedTask } : task
      );
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      setTask("");
      setPriority("low");
      setIsModalOpen(false);
      setIsEditing(false);
      setCurrentTask(null);
    } catch (e) {
      console.error("Error updating task: ", e);
    }
  };
  

  const handleDoneTask = async (taskToMarkDone) => {

    const userId = auth.currentUser ? auth.currentUser.uid : "defaultUserId";
    if (taskToMarkDone.userId !== userId) {
      console.log("Cannot modify task, it doesn't belong to the current user.");
      return;
    }
    
    try {
      const newStatus = taskToMarkDone.status === "DONE" ? "in-progress" : "DONE"; 
      const updatedTask = { ...taskToMarkDone, status: newStatus };
      
      const taskRef = doc(db, "tasks", taskToMarkDone.id);
      const doneTaskRef = doc(db, "doneTasks", taskToMarkDone.id);
      
      if (newStatus === "DONE") {
        await setDoc(doneTaskRef, updatedTask);  
        await deleteDoc(taskRef); 
      } else {
        const doneTaskSnap = await getDoc(doneTaskRef);
        
        if (doneTaskSnap.exists()) {
          await deleteDoc(doneTaskRef);
          await setDoc(taskRef, updatedTask); 
        } else {
          const taskSnap = await getDoc(taskRef);
          if (taskSnap.exists()) {
            console.error(`Task ${taskToMarkDone.id} is not in "doneTasks" collection, but exists in "tasks". No action needed.`);
          } else {
            console.error(`Task ${taskToMarkDone.id} not found in either "doneTasks" or "tasks" collection.`);
          }
        }
      }
      
      const updatedTasks = tasks.map((task) =>
        task.id === taskToMarkDone.id ? updatedTask : task
      );
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
  
    } catch (error) {
      console.error("Error updating task status: ", error);
    }
  };
  
  
  const handleDeleteTask = async (taskToDelete) => {
    try {
      const deletedTask = { ...taskToDelete, status: "deleted" };
  
      await addDoc(collection(db, "deleteTasks"), deletedTask);
  
      const taskRef = doc(db, "tasks", taskToDelete.id);
      await deleteDoc(taskRef);
  
      const updatedTasks = tasks.filter((t) => t.id !== taskToDelete.id);
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };


  const handleFilter = (priorityLevel) => {
    const filtered = tasks.filter((t) => t.priority === priorityLevel);
    setFilteredTasks(filtered);
  };

  const handleSearch = () => {
    const filtered = tasks.filter((task) =>
      task.task.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth); 
      router.push("/"); 
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const openEditModal = (task) => {
    setIsEditing(true);
    setCurrentTask(task);
    setTask(task.task);
    setPriority(task.priority);
    toggleModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentTask(null);
    setTask("");
    setPriority("low");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <header className="w-full px-6 lg:px-8 h-16 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">TodoList</h1>
        

        <div className="flex items-center space-x-4">
          {userEmail && (
            <span className="text-sm text-gray-700 dark:text-gray-300">{userEmail}</span>
          )}
          <button
            className="px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 w-full border rounded-lg text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600"
            >
              Search
            </button>
          </div>

          <div className="flex gap-4 mb-6">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="p-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <button
              onClick={() => handleFilter(priority)}
              className="px-6 py-3 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600"
            >
              Filter
            </button>
            <button
              onClick={() => setFilteredTasks(tasks)}
              className="px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600"
            >
              All Tasks
            </button>
          </div>

          <div className="space-y-4 mt-6">
            {filteredTasks.map((taskItem) => (
              <TaskCard
                key={taskItem.id}
                task={taskItem}
                priority={taskItem.priority}
                status={taskItem.status}
                onDelete={() => handleDeleteTask(taskItem)}
                onUpdate={() => openEditModal(taskItem)}
                onDone={handleDoneTask} 
                />
            ))}
          </div>
        </div>
      </main>

      <button
        onClick={toggleModal}
        className="fixed bottom-10 right-10 p-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        <span className="text-2xl">+</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {isEditing ? "Edit Task" : "Add New Task"}
              </h2>
              <button
                onClick={closeModal}
                className="text-red-500 font-semibold text-xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task description"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="p-2 w-full border rounded-lg text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="p-2 w-full border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={isEditing ? handleUpdateTask : handleAddTask}
                className="px-6 py-3 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600"
              >
                {isEditing ? "Update Task" : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

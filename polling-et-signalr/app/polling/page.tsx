"use client";

import React, { useEffect } from "react";
import axios from "axios";
import TaskView from "../_components/tasks-view";
import { UselessTask } from "../models/UselessTask";

export default function Home() {
  const domain = "http://localhost:5042/api/"

  const [tasks, setTasks] = React.useState<UselessTask[]>([]);

  useEffect(() => {
    updateTasks();
  }, []);

  async function handleTaskAdd(taskName: string) {
    // TODO On invoke la méthode pour ajouter une tâche sur le serveur (Contrôleur d'API)
    try{
      const response = await axios.post(`${domain}UselessTasks/Add`, null, {params : {"taskText": taskName}})
      let tasksCopy = [...tasks]
      tasksCopy.push(response.data)
      setTasks(tasksCopy)
      console.log(`Task \"${response.data.text}\" ajouté`)
    }catch (e: any){
      console.log(e.response.data)
      alert("error")
    }
    
  }

  async function onTaskToggle(id: number) {
    // TODO On invoke la méthode pour compléter une tâche sur le serveur (Contrôleur d'API)
    const response = await axios.get(`${domain}UselessTasks/Complete/${id}`)

    let tasksCopy : UselessTask[] = [...tasks];    
    tasksCopy.find(task => task.id === id)!.completed = true;
    setTasks(tasksCopy);

  }

  async function updateTasks() {
    // Ancien code avec Tasks codées en dur
    /* let testTasks = new Array<UselessTask>(
      { id: 1, text: "Test Task 1", completed: false },
      { id: 2, text: "Test Task 2", completed: true });
    setTasks(testTasks); */

    // TODO: Faire une première implémentation simple avec un appel au serveur pour obtenir la liste des tâches
    const response = await axios.get(`${domain}UselessTasks/GetAll`)
    let list : UselessTask[] = [];
    for (let t of response.data){
      list.push(t)
    }
    setTasks(list);
    // TODO: UNE FOIS QUE VOUS AVEZ TESTER AVEC DEUX CLIENTS: Utiliser le polling pour mettre la liste de tasks à jour chaque seconde
    setTimeout(() => {updateTasks()}, 1000)
  }

  return (
    <div className="p-4">
        <h1>Polling!</h1>
        <TaskView 
          tasks={tasks} 
          onTaskAdd={handleTaskAdd}
          onTaskToggle={onTaskToggle}
        />
    </div>

  );
}
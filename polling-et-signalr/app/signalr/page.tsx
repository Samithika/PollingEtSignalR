"use client";

import React from "react";
import { useEffect } from "react";
import { UselessTask } from "../models/UselessTask";
import TaskView from "../_components/tasks-view";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

export default function Home() {

  const [hubConnection, setHubConnection] = React.useState<HubConnection>();
  const [tasks, setTasks] = React.useState<UselessTask[]>([]);

  const hubUrl = "http://localhost:5042/tasks"

  useEffect(() => {
      connecttohub();
    }, []);

  function connecttohub() {
    // Ancien code avec tasks hardcodées
    /* let testTasks = new Array<UselessTask>(
          { id: 1, text: "Test Task 1", completed: false },
          { id: 2, text: "Test Task 2", completed: true });
        setTasks(testTasks); */
    // TODO On doit commencer par créer la connexion vers le Hub
    let newHubConnection = new HubConnectionBuilder().withUrl(hubUrl).build()

    // TODO On peut commencer à écouter pour les évènements qui vont déclencher des callbacks
      newHubConnection.on('TaskList', (data) => {
        // data a le même type que ce qui a été envoyé par le serveur
        console.log(data);
        setTasks(data)
    });

    // TODO On doit ensuite se connecter
    // On se connecte au Hub  
    newHubConnection
        .start()
        .then(() => {
            console.log('La connexion est active!');
          })
        .catch(err => console.log('Error while starting connection: ' + err));

    setHubConnection(newHubConnection);
  }

  function onTaskToggle(id: number) {
    // TODO On invoke la méthode pour compléter une tâche sur le serveur
    let tasksCopy : UselessTask[] = [...tasks];    
    tasksCopy.find(task => task.id === id)!.completed = true;
    setTasks(tasksCopy);
  }

  function handleTaskAdd() {
    // TODO On invoke la méthode pour ajouter une tâche sur le serveur
  }

  return (
    <div className="p-4">
        <h1>SignalR!</h1>
        <TaskView 
          tasks={tasks} 
          onTaskAdd={handleTaskAdd}
          onTaskToggle={onTaskToggle}
        />
    </div>
  );
}
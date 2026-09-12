"use client";

import React from "react";
import { useEffect } from "react";
import { UselessTask } from "../models/UselessTask";
import TaskView from "../_components/tasks-view";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

export default function Home() {

  const [hubConnection, setHubConnection] = React.useState<HubConnection>();
  const [tasks, setTasks] = React.useState<UselessTask[]>([]);
  const [userCount, setUserCount] = React.useState(0)

  const hubUrl = "http://localhost:5042/tasks"

  useEffect(() => {
    connecttohub();
  }, []);

  function connecttohub() {
    // TODO On doit commencer par créer la connexion vers le Hub
    let newHubConnection = new HubConnectionBuilder().withUrl(hubUrl).build()

    // TODO On peut commencer à écouter (.on) pour les évènements qui vont déclencher des callbacks
    newHubConnection.on("UserCount", (data) => {
      // data a le même type que ce qui a été envoyé par le serveur
      console.log(`${data} users connectés au hub`);
      setUserCount(data)
    })

    newHubConnection.on("TaskList", (data) => {
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
    try {
      // TODO On invoke la méthode pour compléter une tâche sur le serveur
      // appelle le hub (.invoke)
      hubConnection!.invoke("CompleteTaskAsync", id);

      let tasksCopy: UselessTask[] = [...tasks];
      tasksCopy.find(task => task.id === id)!.completed = true;
      setTasks(tasksCopy);
    } catch (error) {
      if (hubConnection === undefined)
        console.log("Une connexion est requise")
      else
        console.log("Une erreur est survenue")
    }
  }

  function handleTaskAdd(taskName: string) {
    try {
      // TODO On invoke la méthode pour ajouter une tâche sur le serveur
      // appelle le hub (.invoke)
      hubConnection!.invoke("AddTaskAsync", taskName)

      // On reçoit du serveur la liste des tâches avec TaskList
      hubConnection!.on("TaskList", (data) => {
        console.log(data);
        setTasks(data)
      })
    }
    catch {
      if (hubConnection === undefined)
        console.log("Une connexion est requise")
      else
        console.log("Une erreur est survenue")
    }

  }

  return (
    <div className="p-4">
      <h1>SignalR!</h1>
      <TaskView
        tasks={tasks}
        onTaskAdd={handleTaskAdd}
        onTaskToggle={onTaskToggle}
      />
      <p>Nombre de clients connectés : {userCount}</p>
    </div>
  );
}
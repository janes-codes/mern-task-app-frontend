import React, { useEffect, useState } from 'react'
import TaskForm from './TaskForm'
import Task from './Task'
import { toast } from 'react-toastify';
import axios from 'axios'
import { URL } from '../App';
import loadingImg from '../assets/loader.gif'

const TaskList = () => {
    const [tasks, setTasks] = useState([])
    const [completedTasks, setCompletedTasks] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        completed: false
    });
    const [isEditing, setIsEditing] = useState(false)
    const [taskId, setTaskId] = useState("")

    const {name} = formData

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData({...formData, [name]: value})
    };

    const getTasks = async () => {
        setIsLoading(true)
        try{
            const response = await axios.get(`${URL}/api/tasks`)
            setTasks(response.data)
            setIsLoading(false)
        }catch(error){
            toast.error(error.message)
            console.log(error)
            setIsLoading(false)
        }
    };

    useEffect(() => {
        getTasks()
    }, [])

    const createTask = async (e) => {
        e.preventDefault();
        if(name === "") {
            return toast.error("Input feild cannot be empty")
        }
        try{
            await axios.post(`${URL}/api/tasks`, formData)
            toast.success("Task added successfully");
            setFormData({...formData, name: ""});
            getTasks();
        } catch(error) {
            toast.error(error.message)
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`${URL}/api/tasks/${id}`)
            getTasks()
        } catch(error) {
            toast.error(error.message)
        }
    };

    useEffect(() => {
        const cTask = tasks.filter((task) => {
            return task.completed === true
        })
        setCompletedTasks(cTask)
    }, [tasks])

    const getSingleTask = async (task) => {
        setFormData({name: task.name, completed: false});
        setTaskId(task._id);
        setIsEditing(true);
    };

    const updateTask = async (e) => {
        e.preventDefault()
        if(name === "") {
            return toast.error("Input feild cannot be empty");
        }
        try{
            await axios.put(`${URL}/api/tasks/${taskId}`, formData);
            setFormData({...formData, name: ""});
            setIsEditing(false);
            getTasks();
        } catch(error){
            toast.error(error.message)
        }
    };

    const setToComplete = async (task) => {
        const newFormData = {
            name: task.name,
            completed: true,
        }
        try{
            await axios.put(`${URL}/api/tasks/${task._id}`, newFormData);
            getTasks();
        } catch(error) {
            toast.error(error.message)
        }
    };

  return (
    <div>
        <h2>Task Manager</h2>
        <TaskForm 
            name={name}
            handleInputChange={handleInputChange}
            createTask={createTask}
            isEditing={isEditing}
            updateTask={updateTask}
        />
        {tasks.length > 0 && (
            <div className="--flex-between --pb">
                <p>
                    <b>Total Task:</b> {tasks.length}
                </p>
                <p>
                    <b>completed Task:</b> {completedTasks.length}
                </p>
            </div>
        )}
        <hr/>
        {
            isLoading && (
                <div className="--flex-center">
                    <image src={loadingImg} alt="LOADING"/>
                </div>
            )
        }
        {
            !isLoading && tasks.length === 0 ? (
                <p className="--py">No task added. Add a task</p>
            ): (
                <>
                    {
                        tasks.map((task, index) => {
                            return (
                                <Task 
                                    key = {task._id}
                                    task = {task}
                                    index = {index}
                                    deleteTask = {deleteTask}
                                    getSingleTask = {getSingleTask}
                                    setToComplete={setToComplete}
                                />
                            )
                        })
                    }
                </>
            )
        }
    </div>
  )
}

export default TaskList

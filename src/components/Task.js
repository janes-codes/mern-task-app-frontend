import React from 'react';
import { FaEdit, FaCheck } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";

const Task = ({task, index, deleteTask, getSingleTask, setToComplete}) => {
  return (
    <div className={task.completed? "task completed": "task"}>
        <p><b>{index +1}. </b>{task.name}</p>
        <div className="task-icons">
            <FaCheck color="green" onClick={() => setToComplete(task)}/>
            <FaEdit color="purple" onClick={() => getSingleTask(task)}/>
            <FaRegTrashCan color="red" onClick={() => deleteTask(task._id)}/>
        </div>
    </div>
  )
}

export default Task

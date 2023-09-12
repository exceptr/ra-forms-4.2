import { nanoid } from 'nanoid';
import React, { useState } from 'react';

interface Workout {
    id: string;
    data: string;
    distance: number;
}

const workoutList: Workout[] = []

function dateSorter(a: Workout, b: Workout) {
    const dateA = new Date(a.data.split('.').reverse().join('-'));
    const dateB = new Date(b.data.split('.').reverse().join('-'));
    return dateB.getTime() - dateA.getTime()
}

export default function Workout() {
    const [workouts, setWorkouts] = useState(workoutList);
    const [form, setForm] = useState({
        id: '',
        data: '',
        distance: 0,
    });

    const handlerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {id, value} = event.target
        setForm((prevForm) => ({
            ...prevForm,
            [id]: value,
        }));
    }

    const removeItem = (id: string) => {
        setWorkouts(prevWorkouts => prevWorkouts.filter(b => b.id != id))
    }

    const handlerAddWorkout = (event: React.FormEvent) => {
        event.preventDefault();
        if(!form.data) return
        if(!form.distance) return

        const formData = new Date(form.data).toLocaleDateString();

        const index = workouts.findIndex((item) => item.data === formData);


        const newWorkout = {
            id: nanoid(),
            data: formData,
            distance: form.distance,
        }
        
        
        if (index !== -1) {
            setWorkouts(prevWorkouts => {
                const updatedWorkouts = [...prevWorkouts];
                const oldDistance = parseFloat(prevWorkouts[index].distance.toString());
                const newDistance = oldDistance + parseFloat(form.distance.toString());
                updatedWorkouts[index] = { ...prevWorkouts[index], distance: newDistance };
                return updatedWorkouts.sort(dateSorter);
            });
        } else {
            setWorkouts((prevWorkouts) => {
                const newWorkouts = [...prevWorkouts, newWorkout];
                return newWorkouts.sort(dateSorter);
                
            });
        }
}
    return (
        <>
        <div className='workout-conteiner'>
            <form onSubmit={handlerAddWorkout}>
                <div className="form-data">
                    <label className='form-data-data' htmlFor="">Дата (ДД.ММ.ГГ)</label><br />
                    <input type="date" id="data" onChange={handlerChange}/>
                </div>
                <div className="form-distance">
                    <label className='form-distance-distance' htmlFor="">Пройдено км</label><br />
                    <input type="number" step="0.1" id="distance" onChange={handlerChange}/>
                </div>
                <button className='button-ok' type='submit'>OK</button>
            </form>
            <div className='workout-title'>
                <label className='workout-title-item' htmlFor="">Дата (ДД.ММ.ГГ)</label>
                <label className='workout-title-item' htmlFor="">Пройдено км</label>
                <label className='workout-title-item' htmlFor="">Действия</label>
            </div>
            <ul className="workout-list">
                {workouts.map((item) => (
                    <li className='workout-list-item' key={item.id}>
                        <span>{item.data}</span> 
                        <span>{item.distance}</span>
                        <div className='button-dell' onClick={() => removeItem(item.id)}></div>
                    </li>
                ))}
            </ul>
        </div>
        </>
    )
}
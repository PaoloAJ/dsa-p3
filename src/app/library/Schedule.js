import {greedySchedule} from './greedy.js'

//function to make sure no tasks are overlapping
export function NoOverlapping(hashMap,date){
    //needs a change
    const FinalResult=new Map();
    //all dates
    const dates= hashMap.GetDates();

    for(let i=0;i<dates.length;i++) {
        const date=dates[i];
        const tasks = hashMap.getTask(date);
        const greedy=greedySchedule(tasks);
        //adding the results to the map-needs a change
        FinalResult.set(date,greedy);
    }
    return FinalResult;
}
import fs from 'fs';

//function to create random numbers
function RandomNum(min, max){
    //returns an integer between the min and the max inclusive
    return Math.floor(Math.random()*(max-min+1))+min;
}

//function to create random dates
function RandomDate(n=30){
    //creates a new date object with  the current date and time
   const present =new Date();
    //creates a new date object with a random milliseconds
   const future=new Date(present.getTime()+RandomNum(0,n*24*60*60*1000));
   //set a random hour and minute
   future.setHours(RandomNum(0,23),RandomNum(0,59),0,0);
   //extracts the year
   const year=future.getFullYear();
   //extracts the month
   const month=String(future.getMonth()+1).padStart(2,'0');
   //extracts the day
   const day=String(future.getDate()).padStart(2,'0');

   return `${year}-${month}-${day}`;
}

export function Generator(name='tasks.csv',count=100000){
    let csv='';
    //loop to generate the data
    for(let i=0;i<count;i++){
        const id=i;
        const name=`Task${i}`;
        const priority=RandomNum(0,10);
        const deadline=RandomDate(30);
        const duration=RandomNum(10,180);

           csv+=`${priority},${deadline},${name},${duration},${id}\n`;
    }
    //writes to the csv file
    fs.writeFileSync(name,csv);

}

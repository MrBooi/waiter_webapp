module.exports = Waiter = (pool) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; 
   
    const week_days = async () => {
        for (const day of days) {
            await pool.query('INSERT INTO weekdays (dayName) VALUES ($1)', [day]);
        }
    }  

    const getWeekdays = async()=>{
        let storedDays = await pool.query('SELECT dayName FROM weekdays');
        return storedDays.rows;
    }

    const addWaiter = async (username, full_name, position) => {
        if (username !== "" && full_name !== "" && position !== "") {
            await pool.query('INSERT INTO waiterDB (username,full_name,position) VALUES ($1,$2,$3)', [username, full_name, position]);
            return true;
        } else {
            false;
        }
    } 

    const getWaiters= async()=>{
        let storedWaiters = await pool.query('SELECT * FROM waiterDB WHERE position=$1',['waiter']);
        return storedWaiters.rows;
    }

    const selectShift = async (shift) => { 
            const weekdays = shift.days;
            const findUsernameID = await pool.query('SELECT id From waiterDB WHERE username=$1', [shift.username]);
            if (findUsernameID.rowCount >0) {
                let userID =findUsernameID.rows[0].id;
                for (let day of weekdays) {
                    let findDayID = await pool.query('SELECT id From weekdays WHERE dayName=$1', [day]);
                    await pool.query('INSERT INTO dayShifts (waiter_id,weekday_id) VALUES($1,$2)'
                    ,[userID, findDayID.rows[0].id]); 
                } 
                return true;
            } else{
                return false;
            }

    }
    
    const getShifts = async()=>{
        let shifts  = await pool.query('SELECT * FROM dayShifts');
        return shifts.rows;
    }
   
    const shiftTest= async() =>{
        let username ='MrAndre';
        let day = 'Monday';

        let check = await pool.query(
            `SELECT distinct username, dayName FROM dayShifts 
            JOIN waiterDB ON waiterDB.id = dayShifts.waiter_id 
            JOIN weekdays ON weekdays.id = dayShifts.weekday_id 
            WHERE waiterDB.username ='${username}' AND weekdays.dayName='${day}'`    
         );
        return check.rows;
    }  
    
    

    const allShifts= async() =>{
        let storedShift = await pool.query(
            `SELECT username, dayName FROM dayShifts 
            JOIN waiterDB ON waiterDB.id = dayShifts.waiter_id 
            JOIN weekdays ON weekdays.id = dayShifts.weekday_id`    
         );
        return storedShift.rows;
    }  


    return {
        add_waiter: addWaiter,
        getStoredWaiters :getWaiters,
        weekDays: week_days,
        getdays: getWeekdays,
        dayShift: selectShift,
        getAvailabeShift: getShifts,
        shiftTest,
        allShifts
        
    }

}
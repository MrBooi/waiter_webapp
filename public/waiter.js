module.exports = Waiter = (pool) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const week_days = async () => {
        for (const day of days) {
            await pool.query('INSERT INTO weekdays (dayName) VALUES ($1)', [day]);
        }
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

    const selectShift = async (username, day) => {
        if (username !== '' && day !== '') {
            let findUsernameID = await pool.query('SELECT id From waiterDB WHERE username=$1', [username]);
            let findDayID = await pool.query('SELECT id From weekdays WHERE dayName=$1', [day]);
             await pool.query('INSERT INTO dayShifts (waiter_id,weekday_id) VALUES($1,$2)',[findUsernameID.rows[0].id, findDayID.rows[0].id]);
            return true;
        } else {
            return false;
        }
    }




    return {
        add_waiter: addWaiter,
        weekDays: week_days,
        dayShift: selectShift
    }

}
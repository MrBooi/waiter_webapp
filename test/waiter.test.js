'use strict';
let assert = require('assert');
const pg =require('pg');
const Pool =pg.Pool;

let useSSL =false;
if(process.env.DATABASE_URL){
    useSSL =true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost:5432/waiter_test' ;

const pool = new Pool({
    connectionString,
    ssl:useSSL
})

// calling waiter factrory function 
const Waiter = require('../public/waiter.js');
let  waiter = Waiter(pool);

describe('The weekdays function', () => {
    beforeEach(async  ()=> {
      await pool.query('DELETE FROM waiterDB');
      await pool.query('DELETE FROM weekdays');
      await pool.query('DELETE FROM dayShifts');
    
    });
    it('should add all the weekdays', async ()=> {
     assert.deepEqual(await waiter.weekDays(),[ { dayname: 'Sunday' },
     { dayname: 'Monday' },
     { dayname: 'Tuesday' },
     { dayname: 'Wednesday' },
     { dayname: 'Thursday' },
     { dayname: 'Friday' },
     { dayname: 'Saturday' } ]);
    });
  });

describe('The Add function  add waiters', () => {
     beforeEach(async ()=> {
    await pool.query('DELETE FROM dayShifts');
    await pool.query('DELETE FROM waiterDB');
    await pool.query('DELETE FROM weekdays');
    await pool.query(' waiterdb.sql');
    });
    it('should return true if waiter is add sucessfuly', async ()=> {
      let storedWaiter =await  waiter.add_waiter("MrAndre","Andre","waiter");
     assert.equal(storedWaiter,true);
    });
  });
  
 
  describe('waiter should Select a shift', () =>{
    beforeEach(async ()=> {
    await pool.query('DELETE FROM dayShifts');
    });
    it('should allow user to add shift', async ()=> {
        let select_shift = await waiter.dayShift('MrAndre','Monday');
         assert.deepEqual(select_shift,true);
    })
  




    after(async  ()=> {
        await pool.end();
      });
  });

   

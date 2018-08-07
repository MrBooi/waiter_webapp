'use strict';
let assert = require('assert');
const pg = require('pg');
const Pool = pg.Pool;

let useSSL = false;
if (process.env.DATABASE_URL) {
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost:5432/waiter_test';

const pool = new Pool({
  connectionString,
  ssl: useSSL
})

// calling waiter factrory function 
const Waiter = require('../waiter.js');
let waiter = Waiter(pool);

describe('The weekdays function', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM dayShifts');
    await pool.query('DELETE FROM waiterDB');
    await pool.query('DELETE FROM weekdays');
  });
  it('should add all the weekdays', async () => {
    await waiter.weekDays();
    assert.deepEqual(await waiter.getdays(), [{
        dayname: 'Sunday'
      },
      {
        dayname: 'Monday'
      },
      {
        dayname: 'Tuesday'
      },
      {
        dayname: 'Wednesday'
      },
      {
        dayname: 'Thursday'
      },
      {
        dayname: 'Friday'
      },
      {
        dayname: 'Saturday'
      }
    ]);
  });
});

describe('The Add function  add waiters', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM dayShifts');
    await pool.query('DELETE FROM waiterDB');
    await pool.query('DELETE FROM weekdays');
  });
  it('should return true if waiter is add sucessfuly', async () => {
    await waiter.weekDays();
    let storedWaiter = await waiter.add_waiter("MrAndre", "Andre", "waiter");
    assert.equal(storedWaiter, true);
  });
});


describe('waiter should Select a shift', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM dayShifts');
    await pool.query('DELETE FROM waiterDB');
    await pool.query('DELETE FROM weekdays');
  });
  it('should allow user to add shift', async () => {
    await waiter.weekDays();
    await waiter.add_waiter("MrAndre", "Andre", "waiter");
    await waiter.add_waiter("MrSono", "Luvuyo", "waiter");
    let shift = {
      username: 'MrAndre',
      days: ["Monday", "Thursday", "Wednesday"]
    }
    let select_shift = await waiter.dayShift(shift);
    assert.deepEqual(select_shift, true);
  })
});


describe('Select a shift', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM dayShifts');
  });
  it('should a shift based on  username and dayName', async () => {
    let shift = {
      username: 'MrAndre',
      days: ["Monday", "Thursday", "Wednesday"]
    }
    await waiter.dayShift(shift);
    assert.deepEqual(await waiter.shiftTest(), [{
      username: 'MrAndre',
      dayname: 'Monday'
    }]);
  })
});
describe('Get all stored shifts', () => {
  it('should return a list of stored shifts', async () => {
    assert.deepEqual(await waiter.allShifts(), [{
      dayname: 'Monday',
      "full_name": "Andre"
    }, {
      dayname: 'Thursday',
      "full_name": "Andre"
    }, {
      dayname: 'Wednesday',
      "full_name": "Andre"
      
    }]);
  })
});


after(async () => {
  await pool.end();
});
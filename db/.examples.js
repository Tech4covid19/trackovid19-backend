/**
 * DB example code
 * 
 * DO NOT REQUIRE THIS FILE ANYWHERE!
 */

// The base connection object
// For almost all purposes, this is what you want.
const db = require('./connection')

// A "virtual" table. Provides common CRUD queries for a single db table.
// The constructor argument is the table's name
const table = require('./table')('table')

// Perform a single query
db.query('SELECT (NOW() + $1) as "timestamp"', [10]).then(result => {
	console.log(result.rows)
}).catch(err => {
	console.error(err)
})

// Obtain a single column value
db.values('timestamp', 'SELECT timestamp FROM table').then(values => {
	console.log(values)
}).catch(err => {
	console.error(err)
})

// Obtain a single row
db.row('SELECT NOW() as "timestamp"').then(result => {
	console.log(result)
}).catch(err => {
	console.error(err)
})

// Obtain a single column value
db.value('timestamp', 'SELECT NOW() as "timestamp"').then(value => {
	console.log(value)
}).catch(err => {
	console.error(err)
})

// Perform a transaction
db.connect().then(async client => {

	try {

		await db.begin(client)

		await db.query('MY UPDATE SQL')

		await db.query('MY INSERT SQL')

		await db.commit()

	} catch (err) {

		await db.rollback()

	} finally {

		// VERY IMPORTANT! release the client when you're done
		await client.release()
	}

}).catch(err => console.error(err))

// Queries for table: "table"
table.select('age > $1 AND birthdate <= $2', [10, new Date()]).then(result => {
	console.log(result.rows)
}).catch(err => {
	console.error(err)
})

table.insert({
	name: 'Table user',
	age: 25,
	state: 'A.OK'
}).then(result => {
	console.log(result.rows)
}).catch(err => {
	console.error(err)
})

table.update(1, {
	name: 'Table user (updated)',
	state: 'A.NOT.OK'
}).then(result => {
	console.log(result.rows)
}).catch(err => {
	console.error(err)
})

table.delete(1).then(result => {
	console.log(result.rows)
}).catch(err => {
	console.error(err)
})
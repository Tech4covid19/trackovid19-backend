const { Pool, Client } = require('pg')

const logger = require('../utils/logger')('trackovid-db')

const pool = new Pool({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	port: process.env.DB_PORT
})

pool.on('error', (err) => {
	logger.error(err.code)
})

// Local functions
/**
 * 
 * @param {Error}	err
 * @param {string}	sql 	The SQL string.
 * @param {array}	values	The arguments to be replaced in the final SQL (link to $<argumentIndex> string in the SQL command).
 */
function logError(err, sql = null, values = []) {

	if (sql) {

		if (values && values.length) {
			logger.error(`${err.message} (command: ${sql} , values: ${JSON.stringify(values)})`)
		} else {
			logger.error(`${err.message} (command: ${sql})`)
		}

	} else {

		logger.error(err.message)
	}
}

const connection = {

	/**
	 * Performs an SQL query.
	 * The arguments are replaced in order by replacing the keyword: $<argumentIndex>
	 * 
	 * @param {string}	sql 	The SQL string.
	 * @param {array}	values	The arguments to be replaced in the final SQL (links to $<argumentIndex> keyword in the SQL command).
	 * @param {Client}	client	If provided, will use this client connection instead of creating a new one. Useful for transactions.
	 */
	query: async function (sql, values = [], client = null) {

		if (values == null) {
			values = []
		}

		try {

			sql = sql.trim()

			if (!sql.endsWith(';')) {
				sql += ';'
			}

			const result = await (client ? client.query(sql, values) : pool.query(sql, values))

			return result

		} catch (err) {

			logError(err, sql, values)

			if (client) {
				client.release()
			}

			throw err
		}
	},

	/**
	 * Obtains a single record from the database.
	 * 
	 * @param {string}	sql 	The SQL string.
	 * @param {array}	values 	The values array.
	 * @param {Client}	client 	The current client connection, if any.
	 */
	row: function (sql, values = [], client = null) {

		sql = sql.trim()

		if (sql.endsWith(';')) {
			sql = sql.substring(0, sql.length - 1)
		}

		sql += ' LIMIT 1'

		return this.query(sql, values, client).then(result => result.rows.length ? result.rows[0] : null)
	},

	/**
	 * Obtains a single column value from the resulting array.
	 * 
	 * @param {string}	name	The name of the column/field
	 * @param {string}	sql 	The SQL string.
	 * @param {array}	values 	The values array.
	 * @param {Client}	client 	The current client connection, if any.
	 */
	values: function (name, sql, values = [], client = null) {

		return this.query(sql, values, client).then(result => result.rows.map(entry => entry[name]))
	},

	/**
	 * Obtains a single column value from a single record from the database.
	 * 
	 * @param {string}	name	The name of the column/field
	 * @param {string}	sql 	The SQL string.
	 * @param {array}	values 	The values array.
	 * @param {Client}	client 	The current client connection, if any.
	 */
	value: function (name, sql, values = [], client = null) {

		return this.row(sql, values, client).then(result => result ? result[name] : null)
	},

	/**
	 * Obtains a client connection.
	 * With a single connection, transaction can be executed, for example.
	 * This module also contains methods for transactions:
	 *  - begin(client)
	 *  - commit(client)
	 *  - rollback(client)
	 * 
	 */
	connect: function () {
		return pool.connect()
	},

	/**
	 * Begins a transaction.
	 * Equivalent to calling query('BEGIN', null, client).
	 * 
	 * @param {Client}	client	The current client connection, obtained through the connect() method.
	 */
	begin: function (client) {
		return this.query('BEGIN', null, client)
	},

	/**
	 * Commits a transaction.
	 * Equivalent to calling query('COMMIT', null, client).
	 * 
	 * @param {Client}	client	The current client connection, obtained through the connect() method.
	 */
	commit: function (client) {
		return this.query('COMMIT', null, client)
	},

	/**
	 * Performs a transaction rollback.
	 * Equivalent to calling query('ROLLBACK', null, client).
	 * 
	 * @param {Client}	client	The current client connection, obtained through the connect() method.
	 */
	rollback: function (client) {
		// By catching any error here, we prevent that a rollback in a catch() statement become a bubbled problem
		return this.query('ROLLBACK', null, client).catch(() => null)
	},

	tables: function () {

		const tables = this.query('SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES')

	}
}

module.exports = connection
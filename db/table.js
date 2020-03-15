const db = require('./connection')

/**
 * Provides methods which abstract common CRUD queries for a single table.
 *
 * @param {string}	table	The name of the database table
 */
module.exports = (table) => ({

	/**
	 * Alias to the connection object.
	 */
	db: function () {
		return db
	},

	/**
	 * Performs the query: SELECT * FROM <table> WHERE <restrictions>
	 *
	 * @param {string}	restrictions	A set of restrictions to apply. This is a SQL string (ex: <restr1> AND <restr2> AND ...).
	 * @param {array}	values			The arguments to be replaced in the final SQL (link to $<argumentIndex> string in the SQL command).
	 * @param {Client}	client			If provided, will use this client connection instead of creating a new one. Useful for transactions.
	 */
	select: function (restrictions = '', values = [], client = null) {

		if (restrictions == null) {
			restrictions = ''
		}

		if (restrictions.length > 0) {
			restrictions = ` WHERE ${restrictions} `
		}

		return db.query(`SELECT * FROM ${table} ${restrictions}`, values, client)
	},

	/**
	 * Selects a single row from this table.
	 *
	 * @param {number}	id		The row's id.
	 * @param {Client}	client	The current client connection, if any.
	 */
	row: function (id, client = null) {
		return db.row(`SELECT * FROM ${table} WHERE id = $1`, [id], client)
	},

	/**
	 * Performs the query: UPDATE <table> SET (<fieldA> = <valueA>, <fieldB> = <valueB>...) WHERE id = <id>
	 *
	 * @param {number}					id		The row's ID value.
	 * @param {Object<string, object>}	fields	A key-value map, where each key refers to a column name, and the value to the value to insert (duh).
	 * @param {Client}					client	If provided, will use this client connection instead of creating a new one. Useful for transactions.
	 */
	update: function (id, fields, client = null) {

		const operation = Object.keys(fields).map((key, i) => `${key} = $${(i + 1)}`).join(', ')
		const values = Object.values(fields).concat([id])

		if (values.length <= 1) {
			return false
		}

		return db.query(`UPDATE ${table} SET ${operation} WHERE id = $${(values.length)}`, values, client)
	},

	/**
	 * Performs the query: INSERT INTO <table> VALUES (<fieldA> = <valueA>, <fieldB> = <valueB>...)
	 *
	 * @param {string}					table	The table name
	 * @param {Object<string, object>}	fields	A key-value map, where each key refers to a column name, and the value to the value to insert (duh).
	 * @param {Client}					client	If provided, will use this client connection instead of creating a new one. Useful for transactions.
	 */
	insert: async function (fields, client = null) {

		const keys = Object.keys(fields)
		const indexes = keys.map((_, i) => `$${(i + 1)}`).join(', ')
		const values = Object.values(fields)

		if (values.length <= 1) {
			return null
		}

		return db.query(`INSERT INTO ${table} (${keys}) VALUES (${indexes}) RETURNING *`, values, client)
	},

	/**
	 * Performs the query: DELETE FROM <table> WHERE id = <id>
	 *
	 * @param {string}	table	The table name
	 * @param {number}	id		The row's id.
	 * @param {Client}	client	If provided, will use this client connection instead of creating a new one. Useful for transactions.
	 */
	delete: function (id, client = null) {

		return db.query(`DELETE FROM ${table} WHERE id = $1`, [id], client)
	},

	/**
	 * Obtains the values as an array for a given column.
	 *
	 * @param {number}	id		The row's id.
	 * @param {number}	name	The column name.
	 * @param {Client}	client	The current client connection, if any.
	 */
	values: function (name, restrictions = '', values = [], client = null) {
		return this.select(restrictions, values, client).then(result => result.rows.map(row => row[name]))
	},

	/**
	 * Obtains the value of a single row column.
	 *
	 * @param {number}	id		The row's id.
	 * @param {number}	name	The column name.
	 * @param {Client}	client	The current client connection, if any.
	 */
	value: function (id, name, client = null) {
		return this.row(id, client).then(row => row ? row[name] : null)
	}
})

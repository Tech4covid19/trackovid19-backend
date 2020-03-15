const logger = require('../../utils/logger')('case-repository');

class CaseRepository {
    constructor (table) {
        this.table = table;
    }

    async getCaseById(id) {
        try {
            const { rows } = await this.table.select('id = $1', [id]);
            return rows.shift();
        } catch (err) {
            logger.error(`Error while retrieving case from database: ${err.message}`);
            throw err;
        }
    }

    async createCase({ userId, condition, symptoms } = {}) {
        try {
            const { rows } = await this.table.insert({
                user_id: userId,
                status: condition,
                symptoms
            });
            return rows.shift();
        } catch (err) {
            logger.error(`Error while creating case on database: ${err.message}`);
            throw err;
        }
    }
}

module.exports = CaseRepository;

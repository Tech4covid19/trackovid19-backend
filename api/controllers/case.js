const CONDITIONS = require('../../enums/conditions');

class CaseController {
    constructor (repository) {
        this.repository = repository;
    }

    async get(id) {
        return await this.repository.getCaseById(id);
    }

    async create(data = {}) {
        return await this.repository.createCase({
            ...data,
            symptoms: hasSymptoms(data.condition)
        });
    }
}

function hasSymptoms (condition) {
    return [
        CONDITIONS.INFECTED,
        CONDITIONS.QUARANTINE,
        CONDITIONS.SYMPTOMATIC,
    ].includes(condition)
}

module.exports = CaseController;

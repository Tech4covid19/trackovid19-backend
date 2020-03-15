const { Router } = require('express');

const CasesController = require('./controllers/case');
const CasesRepository = require('./repositories/case');
const HTTP_STATUS_CODE = require('../enums/http-status-code');
const SchemaValidator = require('../utils/schema-validator');
const dbTable = require('../db/table');
const caseSchema = require('../utils/schemas/case');

const caseSchemaValidator = new SchemaValidator(caseSchema);
const caseTable = dbTable('history');

const router = Router();

router.get('/:id', async (req, res, next) => {
    try {
        const casesRepository = new CasesRepository(caseTable);
        const casesController = new CasesController(casesRepository, caseSchemaValidator);

        const entry = await casesController.get(req.params.id);

        res
            .status(HTTP_STATUS_CODE.SUCCESS.OK)
            .json({
                id: entry.id,
                userId: entry.user_id,
                condition: entry.status,
                timestamp: entry.timestamp
            });
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        await caseSchemaValidator.validate(req.body);

        const casesRepository = new CasesRepository(caseTable);
        const casesController = new CasesController(casesRepository);

        const data = {
            ...req.body,
            userId: 1 // TODO get logged user id from request
        };

        const entry = await casesController.create(data);

        res
            .status(HTTP_STATUS_CODE.SUCCESS.CREATED)
            .set('Location', `/cases/${entry.id}`)
            .json({
                id: entry.id,
                    userId: entry.user_id,
                condition: entry.status,
                timestamp: entry.timestamp
            });
    } catch (err) {
        next(err);
    }
});

module.exports = router;

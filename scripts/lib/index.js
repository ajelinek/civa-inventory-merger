"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const string_similarity_js_1 = require("string-similarity-js");
const xlsx = require("xlsx");
/** Const Objects */
const OfficeMap = new Map([['C', 'CIVA'], ['E', 'EC'], ['B', 'BH'], ['L', 'LS'], ['M', 'MC'], ['W', 'WV'], ['V', 'VC']]);
const officeData = new Map();
const allData = [];
const header = [
    'officeId',
    'classificationId',
    'classificationName',
    'subClassificationId',
    'subClassificationName',
    'itemId',
    'itemDescription',
    // 'definition', 
    'itemType',
    // 'itemTypeDescription', 
    'unitOfMeasure',
    'unitPrice',
    'dispensingFee',
    'minimumPrice',
    'markUpPercentage',
    // 'lastUpdateTimestamp', 
    // 'processed', 
    // 'classificationMappedTimestamp', 
    'status',
    'idChanged',
    'descriptionChanged',
    'descriptionDifference',
    'allCaps',
    'linkedItems',
    'itemLinkedTo',
    'recordId',
];
function main(fileName) {
    if (!fileName) {
        console.error('Please provide a file name');
        return;
    }
    const workbook = xlsx.readFile(fileName);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { blankrows: true });
    processWorksheetData(data, workbook.SheetNames[0]);
    const outSheet = xlsx.utils.json_to_sheet(allData.map(d => (Object.assign(Object.assign({}, d), { linkedItems: JSON.stringify(d.linkedItems), itemLinkedTo: JSON.stringify(d.itemLinkedTo) }))), { header });
    const outWorkbook = xlsx.utils.book_new(outSheet, 'All Data');
    xlsx.writeFileXLSX(outWorkbook, 'Output.xlsx');
}
function processWorksheetData(data, sheetName) {
    var _a, _b;
    const classifications = {
        classificationName: data[0]['Classification Name'],
        classificationId: data[0]['Classification ID'],
        subClassificationName: data[1]['Classification Name'],
        subClassificationId: data[1][`Classification ID`]
    };
    if (!classifications.classificationName || !classifications.classificationId) {
        throw new Error(`Classification name and id are required - Sheet: ${sheetName}`);
    }
    if (!classifications.subClassificationId || !classifications.subClassificationName) {
        throw new Error(`Subclassification name and id are required - Sheet: ${sheetName}`);
    }
    let groupType = 'none';
    let masterRecord = {};
    for (let rowNum = 2; rowNum < data.length; rowNum++) {
        const record = data[rowNum];
        if (Object.keys(record).length === 0) {
            if (groupType === 'master') {
                masterRecord = updateMasterRecord(masterRecord, allData);
                pushData(masterRecord);
            }
            groupType = 'none';
            masterRecord = {};
            continue;
        }
        const office = record['Office'].toLocaleUpperCase();
        const status = (_a = record['Status']) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase();
        if (office === 'C' && status !== 'DELETE' && groupType === 'none') {
            if (!record['Master Item ID'] || !record['Master Description']) {
                throw new RowError('Master Item ID and Master Description are required for master record', rowNum, sheetName, record);
            }
            groupType = 'master';
            masterRecord.classificationId = classifications.classificationId;
            masterRecord.classificationName = classifications.classificationName;
            masterRecord.subClassificationId = classifications.subClassificationId;
            masterRecord.subClassificationName = classifications.subClassificationName;
            masterRecord.recordId = itemRecordId('CIVA', record['Master Item ID'] + '');
            masterRecord.officeId = 'CIVA';
            masterRecord.itemId = record['Master Item ID'] + '';
            masterRecord.itemDescription = record['Master Description'];
            masterRecord.linkedItems = [];
            continue;
        }
        if (office === 'C' && status === 'DELETE' && groupType === 'none') {
            groupType = 'inactivate';
            continue;
        }
        if (groupType === 'none') {
            throw new RowError('Format error in the document', rowNum, sheetName, record);
        }
        const itemRecord = createItemRecord(office, status, record, classifications, rowNum, sheetName);
        if (groupType === 'master') {
            itemRecord.itemLinkedTo = { recordId: masterRecord.recordId, officeId: masterRecord.officeId };
            itemRecord.idChanged = itemRecord.itemId !== masterRecord.itemId;
            itemRecord.descriptionChanged = itemRecord.itemDescription !== masterRecord.itemDescription;
            itemRecord.descriptionDifference = (0, string_similarity_js_1.stringSimilarity)(itemRecord.itemDescription, masterRecord.itemDescription) * 100;
            (_b = masterRecord.linkedItems) === null || _b === void 0 ? void 0 : _b.push({ recordId: itemRecord.recordId, officeId: itemRecord.officeId });
        }
        if (groupType === 'inactivate') {
            itemRecord.status = 'inactive';
        }
        pushData(itemRecord);
    }
    function pushData(itemRecord) {
        allData.push(itemRecord);
        officeData.set(itemRecord.officeId, itemRecord);
    }
}
class RowError extends Error {
    constructor(message, rowNumber, sheet, row = undefined) {
        super(message);
        this.rowNumber = rowNumber;
        this.sheet = sheet;
        this.row = row;
        this.name = 'RowError';
        this.rowNumber = rowNumber + 2;
        this.sheet = sheet;
        this.row = row;
    }
}
function createItemRecord(office, status, record, classifications, rowNum, sheet) {
    const itemId = record['Item Id'] + '';
    const officeId = OfficeMap.get(office);
    if (!officeId)
        throw new RowError(`Office ID is not valid - RowOffice: ${record['Office']} officeId: ${officeId}`, rowNum, sheet, record);
    if (!itemId)
        throw new RowError('Item ID is required', rowNum, sheet, record);
    return {
        recordId: itemRecordId(officeId, itemId),
        officeId,
        classificationId: classifications.classificationId,
        classificationName: classifications.classificationName,
        subClassificationId: classifications.subClassificationId,
        subClassificationName: classifications.subClassificationName,
        itemId,
        itemDescription: record['Invoice Item Description'],
        definition: '',
        itemType: record['Service/Inventory'],
        itemTypeDescription: '',
        unitOfMeasure: record['Unit of Measure'],
        unitPrice: record['Unit Price'],
        dispensingFee: record['Dispensing Fee'],
        minimumPrice: record['Minimum Price'],
        markUpPercentage: record['Mark Up %'],
        status: status === 'DELETE' ? 'inactive' : 'active'
    };
}
function updateMasterRecord(masterRecord, allData) {
    const allDataCopy = [...allData].reverse();
    let bestRecord = allDataCopy.reverse().find(d => { var _a; return ((_a = d.itemLinkedTo) === null || _a === void 0 ? void 0 : _a.recordId) === masterRecord.recordId && d.officeId === 'EC'; });
    if (!bestRecord)
        bestRecord = allDataCopy.find(d => { var _a; return ((_a = d.itemLinkedTo) === null || _a === void 0 ? void 0 : _a.recordId) === masterRecord.recordId && d.officeId === 'BH'; });
    if (!bestRecord)
        bestRecord = allDataCopy.find(d => { var _a; return ((_a = d.itemLinkedTo) === null || _a === void 0 ? void 0 : _a.recordId) === masterRecord.recordId; });
    return Object.assign(Object.assign({}, bestRecord), { linkedItems: masterRecord.linkedItems, itemLinkedTo: undefined, status: 'active', recordId: masterRecord.recordId, officeId: masterRecord.officeId, itemId: masterRecord.itemId, itemDescription: masterRecord.itemDescription, allCaps: masterRecord.itemDescription === masterRecord.itemDescription.toUpperCase() });
}
const itemRecordId = (officeId, itemId) => `${officeId}-${itemId.replace(/[.#$\/\[\]]/g, '_')}`;
const fileName = process.argv[2];
main(fileName);
//# sourceMappingURL=index.js.map
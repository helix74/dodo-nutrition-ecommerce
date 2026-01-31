
import * as ai from 'ai';
const exports = Object.keys(ai);
const hasConvertToCore = exports.includes('convertToCoreMessages');
const hasConvertToModel = exports.includes('convertToModelMessages');
console.log('Has convertToCoreMessages:', hasConvertToCore);
console.log('Has convertToModelMessages:', hasConvertToModel);
console.log('All exports starting with convert:', exports.filter(k => k.startsWith('convert')));

// window.onerror = function (msg, url, lineNo, columnNo, error) {
//     console.error('random error');
//     return true;
// };
//
// function KError(message) {
//     this.name = 'Knockoff error';
//     this.message = message || 'Default Message';
//     this.stack = (new Error()).stack;
// }
// KError.prototype = Object.create(Error.prototype);
// KError.prototype.constructor = KError;

import knockoff from './providers.knockoff'
import providers from './providers.knockoff'

import transforms from './providers/transforms'
import transforms from './providers/abilities'


export default knockoff;
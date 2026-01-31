const ai = require('ai');
console.log('AI Exports:', Object.keys(ai));
try {
  const { streamText } = ai;
  console.log('streamText is:', typeof streamText);
} catch (e) {
  console.error(e);
}

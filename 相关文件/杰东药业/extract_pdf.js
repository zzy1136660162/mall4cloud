const fs = require('fs');
const { PDF } = require('./node_modules/pdf-parse/dist/node/cjs/index.cjs');

const pdfPath = 'h:\\杰东药业\\杰东药业 2(1).pdf';

const dataBuffer = fs.readFileSync(pdfPath);

const pdf = new PDF();
pdf.load(dataBuffer).then(function() {
    return pdf.parse();
}).then(function(data) {
    console.log('PDF总页数:', data.pages.length);
    console.log('====================================');
    data.pages.forEach((page, index) => {
        console.log(`\n--- 第 ${index + 1} 页 ---`);
        console.log(page.text);
    });
}).catch(function(error) {
    console.error('错误:', error);
});

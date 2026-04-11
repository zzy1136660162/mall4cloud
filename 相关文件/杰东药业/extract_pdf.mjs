import fs from 'fs';
import { PDFParse } from './node_modules/pdf-parse/dist/pdf-parse/esm/index.js';

const pdfPath = 'h:\\杰东药业\\杰东药业 2(1).pdf';

const dataBuffer = fs.readFileSync(pdfPath);

// 直接在构造函数中传入数据
const parser = new PDFParse({ data: dataBuffer });
const result = await parser.getText();

// 保存到文件
fs.writeFileSync('h:\\杰东药业\\pdf_content.txt', result.text, 'utf-8');
console.log('PDF内容已保存到 pdf_content.txt');

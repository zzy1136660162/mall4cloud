import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfPath = 'h:\\杰东药业\\杰东药业 2(1).pdf';
const outputDir = 'h:\\杰东药业\\pdf_images\\pages';

// 创建输出目录
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 读取PDF文件
const pdfBuffer = fs.readFileSync(pdfPath);
const pdfData = new Uint8Array(pdfBuffer);

// 使用pdf-parse获取PDF信息
import pdfParse from 'pdf-parse';

async function extractPDFInfo() {
    try {
        const data = await pdfParse(pdfBuffer);
        console.log('PDF信息:');
        console.log(`  页数: ${data.numpages}`);
        console.log(`  文本长度: ${data.text.length} 字符`);
        
        // 由于无法直接提取图片，我们创建一个占位符说明
        console.log('\n注意: PDF中的图片是嵌入式的，需要专门的图像提取工具。');
        console.log('建议方案:');
        console.log('1. 使用在线工具: https://www.ilovepdf.com/pdf_to_image');
        console.log('2. 使用Adobe Acrobat导出图片');
        console.log('3. 使用截图工具手动保存关键页面');
        
        return data.numpages;
    } catch (error) {
        console.error('读取PDF失败:', error);
        return 0;
    }
}

extractPDFInfo();

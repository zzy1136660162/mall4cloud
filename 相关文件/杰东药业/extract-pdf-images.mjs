import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

const pdfPath = 'h:\\杰东药业\\杰东药业 2(1).pdf';
const outputDir = 'h:\\杰东药业\\pdf_images\\extracted';

// 创建输出目录
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function extractImages() {
    try {
        console.log('开始提取PDF中的图片...');
        
        // 读取PDF文件
        const pdfBytes = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        console.log(`PDF总页数: ${pdfDoc.getPageCount()}`);
        
        let imageCount = 0;
        
        // 遍历每一页
        for (let i = 0; i < pdfDoc.getPageCount(); i++) {
            const page = pdfDoc.getPage(i);
            const resources = page.node.Resources();
            
            if (!resources) continue;
            
            const xObject = resources.lookupMaybe('XObject');
            if (!xObject) continue;
            
            const xObjectKeys = xObject.keys();
            
            for (const key of xObjectKeys) {
                const obj = xObject.lookup(key);
                
                if (obj instanceof PDFStream) {
                    const dict = obj.dict;
                    const subtype = dict.lookupMaybe('Subtype');
                    
                    if (subtype && subtype.name === 'Image') {
                        imageCount++;
                        const width = dict.lookupMaybe('Width');
                        const height = dict.lookupMaybe('Height');
                        const filter = dict.lookupMaybe('Filter');
                        
                        let ext = 'bin';
                        if (filter) {
                            const filterName = filter.name || filter.toString();
                            if (filterName.includes('DCTDecode')) ext = 'jpg';
                            else if (filterName.includes('FlateDecode')) ext = 'png';
                        }
                        
                        const imageData = obj.getContents();
                        const outputPath = path.join(outputDir, `page${i + 1}_img${imageCount}.${ext}`);
                        fs.writeFileSync(outputPath, imageData);
                        
                        console.log(`  提取: page${i + 1}_img${imageCount}.${ext} (${width}x${height})`);
                    }
                }
            }
        }
        
        console.log(`\n✓ 提取完成！共提取 ${imageCount} 张图片`);
        console.log(`图片保存位置: ${outputDir}`);
        
    } catch (error) {
        console.error('提取失败:', error);
    }
}

extractImages();

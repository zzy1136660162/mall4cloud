import fs from 'fs';
import path from 'path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas } from 'canvas';

const pdfPath = 'h:\\杰东药业\\杰东药业 2(1).pdf';
const outputDir = 'h:\\杰东药业\\pdf_images\\pages';

// 创建输出目录
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function renderPage(page, scale = 2) {
    const viewport = page.getViewport({ scale });
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');
    
    await page.render({
        canvasContext: context,
        viewport: viewport
    }).promise;
    
    return canvas;
}

async function convertPDFToImages() {
    try {
        console.log('开始将PDF转换为图片...');
        
        const data = new Uint8Array(fs.readFileSync(pdfPath));
        const loadingTask = getDocument({ data });
        const pdfDocument = await loadingTask.promise;
        
        console.log(`PDF总页数: ${pdfDocument.numPages}`);
        
        for (let i = 1; i <= pdfDocument.numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const canvas = await renderPage(page, 2);
            
            const outputPath = path.join(outputDir, `page_${String(i).padStart(2, '0')}.png`);
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(outputPath, buffer);
            
            console.log(`  第 ${i} 页转换完成`);
            
            page.cleanup();
        }
        
        console.log(`\n✓ 转换完成！共转换 ${pdfDocument.numPages} 页`);
        console.log(`图片保存位置: ${outputDir}`);
        
    } catch (error) {
        console.error('转换失败:', error);
    }
}

convertPDFToImages();

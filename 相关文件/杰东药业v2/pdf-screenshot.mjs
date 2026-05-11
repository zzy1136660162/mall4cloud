import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const pdfPath = 'h:\\杰东药业\\杰东药业 2(1).pdf';
const outputDir = 'h:\\杰东药业\\pdf_images\\pages';

// 创建输出目录
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function capturePDFPages() {
    console.log('开始截取PDF页面...');
    
    // 启动浏览器
    const browser = await chromium.launch();
    const context = await browser.newContext({
        viewport: { width: 1200, height: 1600 }
    });
    const page = await context.newPage();
    
    // 使用PDF.js查看器打开PDF
    const pdfUrl = `file:///${pdfPath.replace(/\\/g, '/')}`;
    
    // 创建一个简单的HTML页面来显示PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>PDF Viewer</title>
    <style>
        body { margin: 0; padding: 20px; background: #f0f0f0; }
        #pdf-container { width: 100%; }
        canvas { display: block; margin: 20px auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div id="pdf-container"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script>
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        const pdfPath = '${pdfUrl}';
        
        async function renderPDF() {
            const pdf = await pdfjsLib.getDocument(pdfPath).promise;
            console.log('PDF loaded, pages:', pdf.numPages);
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const scale = 1.5;
                const viewport = page.getViewport({ scale });
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                canvas.id = 'page-' + i;
                
                document.getElementById('pdf-container').appendChild(canvas);
                
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
                
                console.log('Rendered page ' + i);
            }
        }
        
        renderPDF();
    </script>
</body>
</html>
    `;
    
    const tempHtmlPath = path.join(outputDir, 'temp_viewer.html');
    fs.writeFileSync(tempHtmlPath, htmlContent);
    
    // 打开页面
    await page.goto(`file:///${tempHtmlPath.replace(/\\/g, '/')}`);
    
    // 等待PDF加载完成
    await page.waitForTimeout(5000);
    
    // 获取页面数量
    const pageCount = await page.evaluate(() => {
        return document.querySelectorAll('canvas').length;
    });
    
    console.log(`检测到 ${pageCount} 个页面`);
    
    // 截取每个页面
    for (let i = 1; i <= pageCount; i++) {
        const canvas = await page.locator(`#page-${i}`);
        if (await canvas.isVisible().catch(() => false)) {
            await canvas.screenshot({
                path: path.join(outputDir, `page_${String(i).padStart(2, '0')}.png`)
            });
            console.log(`  第 ${i} 页截图完成`);
        }
    }
    
    await browser.close();
    
    // 删除临时文件
    fs.unlinkSync(tempHtmlPath);
    
    console.log(`\n✓ 截图完成！共 ${pageCount} 页`);
    console.log(`图片保存位置: ${outputDir}`);
}

capturePDFPages().catch(console.error);

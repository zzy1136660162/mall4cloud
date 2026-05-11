import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const pdfPath = 'h:\\杰东药业\\杰东药业 2(1).pdf';
const outputDir = 'h:\\杰东药业\\pdf_images\\pages';

// 创建输出目录
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function simpleExtract() {
    console.log('开始提取PDF...');
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // 使用PDF.js的本地文件
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <style>
        body { margin: 0; background: #333; padding: 20px; }
        #status { color: #0f0; font-family: monospace; margin-bottom: 10px; }
        canvas { 
            display: block; 
            margin: 10px auto; 
            background: white;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
    </style>
</head>
<body>
    <div id="status">正在加载...</div>
    <div id="container"></div>
    <script>
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        async function main() {
            try {
                const url = 'file:///H:/杰东药业/杰东药业%202(1).pdf';
                document.getElementById('status').textContent = '加载PDF...';
                
                const pdf = await pdfjsLib.getDocument(url).promise;
                const numPages = pdf.numPages;
                document.getElementById('status').textContent = '总页数: ' + numPages;
                
                for (let i = 1; i <= numPages; i++) {
                    document.getElementById('status').textContent = '渲染第 ' + i + '/' + numPages + ' 页';
                    
                    const page = await pdf.getPage(i);
                    const scale = 1.5;
                    const viewport = page.getViewport({ scale });
                    
                    const canvas = document.createElement('canvas');
                    canvas.id = 'page' + i;
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    document.getElementById('container').appendChild(canvas);
                    
                    const ctx = canvas.getContext('2d');
                    await page.render({ canvasContext: ctx, viewport: viewport }).promise;
                    
                    page.cleanup();
                }
                
                document.getElementById('status').textContent = '完成!';
                window.done = true;
                window.pageCount = numPages;
                
            } catch (e) {
                document.getElementById('status').textContent = '错误: ' + e.message;
                console.error(e);
            }
        }
        
        main();
    </script>
</body>
</html>`;
    
    const htmlPath = path.join(outputDir, 'render.html');
    fs.writeFileSync(htmlPath, htmlContent);
    
    // 加载页面
    await page.goto('file:///' + htmlPath.replace(/\\/g, '/'));
    
    // 等待完成
    console.log('等待渲染...');
    await page.waitForFunction(() => window.done === true, { timeout: 180000 });
    
    const pageCount = await page.evaluate(() => window.pageCount);
    console.log(`共 ${pageCount} 页，开始截图...`);
    
    // 截图每一页
    for (let i = 1; i <= pageCount; i++) {
        const canvas = page.locator('#page' + i);
        await canvas.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);
        
        await canvas.screenshot({
            path: path.join(outputDir, `page_${String(i).padStart(2, '0')}.png`)
        });
        
        console.log(`  ✓ 第 ${i}/${pageCount} 页`);
    }
    
    await browser.close();
    fs.unlinkSync(htmlPath);
    
    console.log(`\n✅ 完成！共 ${pageCount} 页`);
    
    const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.png'));
    console.log(`文件列表 (${files.length}个):`);
    files.forEach(f => console.log('  - ' + f));
}

simpleExtract().catch(e => {
    console.error('错误:', e);
    process.exit(1);
});

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const pdfPath = 'h:\\杰东药业\\杰东药业 2(1).pdf';
const outputDir = 'h:\\杰东药业\\pdf_images\\pages';

// 创建输出目录
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function extractAllPages() {
    console.log('开始自动提取PDF所有页面...');
    
    // 启动浏览器
    const browser = await chromium.launch();
    const context = await browser.newContext({
        viewport: { width: 1400, height: 1000 }
    });
    const page = await context.newPage();
    
    // 创建一个完整的PDF查看器页面
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>PDF Extractor</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <style>
        body { margin: 0; padding: 20px; background: #333; }
        #container { display: flex; flex-direction: column; align-items: center; }
        canvas { 
            margin: 10px 0; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            background: white;
        }
        #status { 
            position: fixed; 
            top: 10px; 
            right: 10px; 
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-family: Arial;
        }
    </style>
</head>
<body>
    <div id="status">加载中...</div>
    <div id="container"></div>
    <script>
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        const pdfPath = 'file:///${pdfPath.replace(/\\/g, '/')}';
        let pdfDoc = null;
        let renderedPages = 0;
        let totalPages = 0;
        
        async function renderAllPages() {
            try {
                const loadingTask = pdfjsLib.getDocument(pdfPath);
                pdfDoc = await loadingTask.promise;
                totalPages = pdfDoc.numPages;
                
                document.getElementById('status').textContent = '共 ' + totalPages + ' 页，正在渲染...';
                
                for (let i = 1; i <= totalPages; i++) {
                    const page = await pdfDoc.getPage(i);
                    const scale = 2.0;
                    const viewport = page.getViewport({ scale });
                    
                    const canvas = document.createElement('canvas');
                    canvas.id = 'page-' + i;
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    
                    document.getElementById('container').appendChild(canvas);
                    
                    const context = canvas.getContext('2d');
                    await page.render({
                        canvasContext: context,
                        viewport: viewport
                    }).promise;
                    
                    renderedPages++;
                    document.getElementById('status').textContent = '已渲染 ' + renderedPages + ' / ' + totalPages + ' 页';
                    
                    page.cleanup();
                }
                
                document.getElementById('status').textContent = '渲染完成！共 ' + totalPages + ' 页';
                window.allPagesRendered = true;
                
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('status').textContent = '错误: ' + error.message;
            }
        }
        
        renderAllPages();
    </script>
</body>
</html>
    `;
    
    const tempHtmlPath = path.join(outputDir, 'extractor.html');
    fs.writeFileSync(tempHtmlPath, htmlContent);
    
    // 打开页面
    await page.goto(`file:///${tempHtmlPath.replace(/\\/g, '/')}`);
    
    // 等待所有页面渲染完成
    console.log('等待PDF渲染完成...');
    await page.waitForFunction(() => window.allPagesRendered === true, { timeout: 120000 });
    
    // 获取总页数
    const totalPages = await page.evaluate(() => {
        return document.querySelectorAll('canvas').length;
    });
    
    console.log(`检测到 ${totalPages} 个页面，开始截图...`);
    
    // 截取每个页面
    for (let i = 1; i <= totalPages; i++) {
        const canvas = page.locator(`#page-${i}`);
        
        // 滚动到该页面
        await canvas.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);
        
        // 截图
        await canvas.screenshot({
            path: path.join(outputDir, `page_${String(i).padStart(2, '0')}.png`),
            type: 'png'
        });
        
        console.log(`  ✓ 第 ${i}/${totalPages} 页已保存`);
    }
    
    await browser.close();
    
    // 删除临时文件
    fs.unlinkSync(tempHtmlPath);
    
    console.log(`\n✅ 提取完成！共 ${totalPages} 页`);
    console.log(`📁 图片保存位置: ${outputDir}`);
    
    // 列出所有生成的文件
    const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.png'));
    console.log(`\n生成的文件:`);
    files.forEach(f => console.log(`  - ${f}`));
}

extractAllPages().catch(err => {
    console.error('提取失败:', err);
    process.exit(1);
});

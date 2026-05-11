import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const pdfPath = 'h:\\杰东药业\\杰东药业 2(1).pdf';
const outputDir = 'h:\\杰东药业\\pdf_images\\pages';

// 创建输出目录
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function renderPDF() {
    console.log('开始渲染PDF页面...');
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // 创建一个本地HTML文件来渲染PDF
    const htmlPath = path.join(outputDir, 'renderer.html');
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <style>
        body { margin: 0; background: #222; }
        #pages { display: flex; flex-direction: column; align-items: center; padding: 20px; }
        .page-container { 
            margin: 10px 0; 
            background: white; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        canvas { display: block; }
        #info { 
            position: fixed; 
            top: 10px; 
            left: 10px; 
            background: rgba(0,0,0,0.8);
            color: #0f0;
            padding: 10px;
            font-family: monospace;
            z-index: 1000;
        }
    </style>
</head>
<body>
    <div id="info">初始化...</div>
    <div id="pages"></div>
    <script>
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        async function loadPDF() {
            const pdfPath = 'file:///${pdfPath.replace(/\\/g, '/').replace(/ /g, '%20')}';
            document.getElementById('info').textContent = '加载PDF: ' + pdfPath;
            
            try {
                const pdf = await pdfjsLib.getDocument(pdfPath).promise;
                const totalPages = pdf.numPages;
                document.getElementById('info').textContent = '总页数: ' + totalPages;
                
                for (let i = 1; i <= totalPages; i++) {
                    document.getElementById('info').textContent = '渲染第 ' + i + '/' + totalPages + ' 页';
                    
                    const page = await pdf.getPage(i);
                    const scale = 2.0;
                    const viewport = page.getViewport({ scale });
                    
                    const container = document.createElement('div');
                    container.className = 'page-container';
                    container.id = 'page-container-' + i;
                    
                    const canvas = document.createElement('canvas');
                    canvas.id = 'page-' + i;
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    
                    container.appendChild(canvas);
                    document.getElementById('pages').appendChild(container);
                    
                    const ctx = canvas.getContext('2d');
                    await page.render({
                        canvasContext: ctx,
                        viewport: viewport
                    }).promise;
                    
                    page.cleanup();
                }
                
                document.getElementById('info').textContent = '渲染完成! 共' + totalPages + '页';
                window.renderComplete = true;
                window.totalPages = totalPages;
                
            } catch (err) {
                document.getElementById('info').textContent = '错误: ' + err.message;
                console.error(err);
            }
        }
        
        loadPDF();
    </script>
</body>
</html>`;
    
    fs.writeFileSync(htmlPath, htmlContent);
    
    // 打开页面
    await page.goto(`file:///${htmlPath}`);
    
    // 等待渲染完成（最多120秒）
    console.log('等待PDF渲染...');
    await page.waitForFunction(() => window.renderComplete === true, { timeout: 120000 });
    
    // 获取总页数
    const totalPages = await page.evaluate(() => window.totalPages);
    console.log(`PDF共 ${totalPages} 页`);
    
    // 逐页截图
    console.log('开始截图...');
    for (let i = 1; i <= totalPages; i++) {
        const container = await page.locator(`#page-container-${i}`);
        await container.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        
        await container.screenshot({
            path: path.join(outputDir, `page_${String(i).padStart(2, '0')}.png`),
            type: 'png'
        });
        
        console.log(`  ✓ 第 ${i}/${totalPages} 页已保存`);
    }
    
    await browser.close();
    
    // 清理临时文件
    fs.unlinkSync(htmlPath);
    
    console.log(`\n✅ 全部完成！共提取 ${totalPages} 页`);
    console.log(`📁 保存位置: ${outputDir}`);
    
    // 验证文件
    const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.png'));
    console.log(`\n生成的文件 (${files.length}个):`);
    files.forEach(f => {
        const stats = fs.statSync(path.join(outputDir, f));
        console.log(`  - ${f} (${(stats.size / 1024).toFixed(1)} KB)`);
    });
}

renderPDF().catch(err => {
    console.error('❌ 错误:', err);
    process.exit(1);
});

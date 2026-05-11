import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const pdfPath = 'h:\\杰东药业\\杰东药业 2(1).pdf';
const outputDir = 'h:\\杰东药业\\pdf_images\\pages';

// 创建输出目录
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function extractPDFPages() {
    console.log('开始提取PDF页面...');
    console.log(`PDF路径: ${pdfPath}`);
    console.log(`输出目录: ${outputDir}`);
    
    // 启动浏览器
    const browser = await chromium.launch();
    const context = await browser.newContext({
        viewport: { width: 1200, height: 1600 }
    });
    const page = await context.newPage();
    
    // 使用PDF.js在线查看器
    const pdfUrl = `file:///${pdfPath.replace(/\\/g, '/')}`;
    
    // 导航到PDF.js查看器
    await page.goto(`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`);
    
    // 等待PDF加载
    console.log('等待PDF加载...');
    await page.waitForTimeout(5000);
    
    // 获取总页数
    const totalPages = await page.evaluate(() => {
        const pageInput = document.querySelector('#pageNumber');
        const pageCount = document.querySelector('#numPages');
        if (pageCount) {
            return parseInt(pageCount.textContent.replace('/ ', ''));
        }
        return 0;
    });
    
    console.log(`PDF总页数: ${totalPages}`);
    
    if (totalPages === 0) {
        console.log('无法获取页数，尝试直接截图...');
        await page.screenshot({
            path: path.join(outputDir, 'preview.png'),
            fullPage: true
        });
        console.log('已保存预览图');
    } else {
        // 逐页截图
        for (let i = 1; i <= totalPages; i++) {
            // 跳转到指定页面
            await page.evaluate((pageNum) => {
                const pageInput = document.querySelector('#pageNumber');
                if (pageInput) {
                    pageInput.value = pageNum;
                    pageInput.dispatchEvent(new Event('change'));
                }
            }, i);
            
            // 等待页面渲染
            await page.waitForTimeout(1500);
            
            // 截图
            const viewer = await page.$('#viewer');
            if (viewer) {
                await viewer.screenshot({
                    path: path.join(outputDir, `page_${String(i).padStart(2, '0')}.png`)
                });
                console.log(`  ✓ 第 ${i}/${totalPages} 页已保存`);
            }
        }
    }
    
    await browser.close();
    
    console.log(`\n✅ 提取完成！`);
    console.log(`📁 图片保存位置: ${outputDir}`);
    
    // 列出所有生成的文件
    const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.png'));
    console.log(`\n生成的文件 (${files.length}个):`);
    files.forEach(f => console.log(`  - ${f}`));
}

extractPDFPages().catch(err => {
    console.error('❌ 提取失败:', err);
    console.error(err.stack);
    process.exit(1);
});

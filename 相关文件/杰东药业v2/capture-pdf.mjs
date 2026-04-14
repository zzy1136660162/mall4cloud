import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outputDir = 'h:\\杰东药业\\pdf_images\\pages';

async function capturePDF() {
    console.log('开始截图PDF页面...');
    
    const browser = await chromium.launch();
    const page = await browser.newPage({
        viewport: { width: 1600, height: 1200 }
    });
    
    // 访问提取页面
    await page.goto('http://localhost:3001/extract.html');
    
    // 等待渲染完成（最多3分钟）
    console.log('等待PDF渲染完成...');
    await page.waitForFunction(() => window.extractionComplete === true, { timeout: 180000 });
    
    const totalPages = await page.evaluate(() => window.totalPages);
    console.log(`PDF共 ${totalPages} 页，开始截图...`);
    
    // 截图每一页
    for (let i = 1; i <= totalPages; i++) {
        const canvas = page.locator(`#page${i}`);
        
        // 滚动到视野内
        await canvas.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        
        // 截图
        await canvas.screenshot({
            path: path.join(outputDir, `page_${String(i).padStart(2, '0')}.png`),
            type: 'png'
        });
        
        console.log(`  ✓ 第 ${i}/${totalPages} 页已保存`);
    }
    
    await browser.close();
    
    console.log(`\n✅ 提取完成！共 ${totalPages} 页`);
    console.log(`📁 保存位置: ${outputDir}`);
    
    // 验证文件
    const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.png') && f.startsWith('page_'));
    console.log(`\n生成的文件 (${files.length}个):`);
    files.sort().forEach(f => {
        const stats = fs.statSync(path.join(outputDir, f));
        console.log(`  - ${f} (${(stats.size / 1024).toFixed(1)} KB)`);
    });
}

capturePDF().catch(e => {
    console.error('❌ 错误:', e);
    process.exit(1);
});

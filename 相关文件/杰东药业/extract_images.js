const { fromPath } = require('pdf2pic');
const path = require('path');

const pdfPath = 'h:\\杰东药业\\杰东药业 2(1).pdf';
const outputDir = 'h:\\杰东药业\\pdf_images';

// 创建转换器
const convert = fromPath(pdfPath, {
    density: 150,
    saveFilename: 'page',
    savePath: outputDir,
    format: 'png',
    width: 1200,
    height: 1600
});

// 转换所有页面
console.log('开始提取PDF页面为图片...');

convert.bulk(-1)
    .then((result) => {
        console.log('提取完成！');
        console.log('图片保存位置:', outputDir);
        console.log('共提取页面数:', result.length);
        result.forEach((res, index) => {
            console.log(`页面 ${index + 1}: ${res.name}`);
        });
    })
    .catch((error) => {
        console.error('提取失败:', error);
    });

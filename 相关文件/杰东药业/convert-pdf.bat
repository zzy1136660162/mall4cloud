@echo off
chcp 65001
set PDF_PATH="h:\杰东药业\杰东药业 2(1).pdf"
set OUTPUT_DIR="h:\杰东药业\pdf_images\pages"

if not exist %OUTPUT_DIR% mkdir %OUTPUT_DIR%

echo 开始转换PDF为图片...
echo PDF路径: %PDF_PATH%
echo 输出目录: %OUTPUT_DIR%

:: 使用ImageMagick的convert命令（如果已安装）
where convert >nul 2>&1
if %errorlevel% == 0 (
    echo 使用ImageMagick转换...
    convert -density 150 %PDF_PATH% -quality 90 %OUTPUT_DIR%\page_%%02d.png
    goto :done
)

:: 使用pdftoppm（如果已安装）
where pdftoppm >nul 2>&1
if %errorlevel% == 0 (
    echo 使用pdftoppm转换...
    pdftoppm -png -r 150 %PDF_PATH% %OUTPUT_DIR%\page_
    goto :done
)

echo 未找到PDF转换工具，请安装以下任一工具：
echo 1. ImageMagick: https://imagemagick.org/
echo 2. Poppler (包含pdftoppm): https://github.com/oschwartz10612/poppler-windows
echo.
echo 或者使用在线工具：
echo - https://www.ilovepdf.com/pdf_to_image
echo - https://smallpdf.com/cn/pdf-to-jpg

:done
echo.
echo 转换完成！
pause

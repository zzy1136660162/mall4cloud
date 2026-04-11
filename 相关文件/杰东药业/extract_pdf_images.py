import fitz  # PyMuPDF
import os
from PIL import Image
import io

def extract_images_from_pdf(pdf_path, output_dir):
    """从PDF中提取所有图片"""
    
    # 创建输出目录
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # 打开PDF
    pdf_document = fitz.open(pdf_path)
    
    image_count = 0
    
    print(f"PDF总页数: {len(pdf_document)}")
    
    # 遍历每一页
    for page_num in range(len(pdf_document)):
        page = pdf_document[page_num]
        
        # 获取页面中的图片
        image_list = page.get_images(full=True)
        
        print(f"\n第 {page_num + 1} 页发现 {len(image_list)} 张图片")
        
        # 遍历页面中的每张图片
        for img_index, img in enumerate(image_list, start=1):
            xref = img[0]
            base_image = pdf_document.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            # 保存图片
            image_count += 1
            image_filename = f"page{page_num + 1}_img{img_index}.{image_ext}"
            image_path = os.path.join(output_dir, image_filename)
            
            with open(image_path, "wb") as img_file:
                img_file.write(image_bytes)
            
            print(f"  保存: {image_filename} ({len(image_bytes)} bytes)")
    
    pdf_document.close()
    
    print(f"\n✓ 提取完成！共提取 {image_count} 张图片")
    print(f"图片保存位置: {output_dir}")
    
    return image_count

def convert_pages_to_images(pdf_path, output_dir):
    """将PDF每一页转换为图片"""
    
    # 创建输出目录
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # 打开PDF
    pdf_document = fitz.open(pdf_path)
    
    print(f"\n开始将PDF页面转换为图片...")
    print(f"PDF总页数: {len(pdf_document)}")
    
    # 遍历每一页
    for page_num in range(len(pdf_document)):
        page = pdf_document[page_num]
        
        # 设置缩放比例以获得更清晰的图片
        mat = fitz.Matrix(2, 2)  # 2倍缩放
        pix = page.get_pixmap(matrix=mat)
        
        # 保存为PNG
        output_path = os.path.join(output_dir, f"page_{page_num + 1:02d}.png")
        pix.save(output_path)
        
        print(f"  第 {page_num + 1} 页 -> page_{page_num + 1:02d}.png")
    
    pdf_document.close()
    
    print(f"\n✓ 转换完成！共转换 {len(pdf_document)} 页")
    print(f"图片保存位置: {output_dir}")

if __name__ == "__main__":
    pdf_path = r"h:\杰东药业\杰东药业 2(1).pdf"
    
    # 提取PDF中嵌入的图片
    images_dir = r"h:\杰东药业\pdf_images\extracted"
    print("=" * 50)
    print("步骤1: 提取PDF中嵌入的图片")
    print("=" * 50)
    extract_images_from_pdf(pdf_path, images_dir)
    
    # 将PDF页面转换为图片
    pages_dir = r"h:\杰东药业\pdf_images\pages"
    print("\n" + "=" * 50)
    print("步骤2: 将PDF页面转换为图片")
    print("=" * 50)
    convert_pages_to_images(pdf_path, pages_dir)

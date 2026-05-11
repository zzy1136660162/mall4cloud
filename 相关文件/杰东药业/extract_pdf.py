import PyPDF2
import sys

pdf_path = r'h:\杰东药业\杰东药业 2(1).pdf'
try:
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        num_pages = len(pdf_reader.pages)
        print(f'PDF总页数: {num_pages}')
        print('='*50)
        
        full_text = ''
        for page_num in range(num_pages):
            page = pdf_reader.pages[page_num]
            text = page.extract_text()
            full_text += f'\n--- 第 {page_num + 1} 页 ---\n{text}\n'
        
        print(full_text)
except Exception as e:
    print(f'错误: {e}')
    sys.exit(1)

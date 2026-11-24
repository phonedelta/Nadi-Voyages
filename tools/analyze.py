import pathlib,re,fitz,json
root=pathlib.Path(__file__).resolve().parent.parent
s=(root/'docs/reference/index-CLVkx_k6.js').read_text(encoding='utf8')
paths=sorted(set(re.findall(r'"(/[^" ]{1,160})"',s)))
print(json.dumps(paths,ensure_ascii=True))
(root/'docs/reference/source-tail.txt').write_text(s[-180000:],encoding='utf8')
css=(root/'docs/reference/index-NKsWQM2J.css').read_text(encoding='utf8')
(root/'docs/reference/styles-readable.css').write_text(css.replace('}', '}\n'),encoding='utf8')
print('JS',len(s),'CSS',len(css))
d=fitz.open(r'C:\Users\hp\Downloads\Agence_de_voyage_nadi.pdf')
p=d[0]
# Isolate original vector artwork, retaining its original curves and colours.
for name,box in {'logo':(585,80,1410,450),'logo-white':(1195,718,1795,905),'monogram':(846,88,1154,268)}.items():
 out=fitz.open(); page=out.new_page(width=box[2]-box[0],height=box[3]-box[1]); page.show_pdf_page(page.rect,d,0,clip=fitz.Rect(box))
 (root/f'public/assets/{name}.svg').write_text(page.get_svg_image(),encoding='utf8')
 page.get_pixmap(matrix=fitz.Matrix(2,2),alpha=False).save(str(root/f'docs/reference/{name}-crop.png'))

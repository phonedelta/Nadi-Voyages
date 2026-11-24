import pathlib,re,fitz
from PIL import Image
assets=pathlib.Path(__file__).resolve().parent.parent/'public/assets'
for name in ['logo','logo-white','monogram']:
 p=assets/(name+'.svg');s=p.read_text()
 for board in ['M0 0H2000V1620.782H0Z','M.051 2161.523H1999.999V2702H.051Z','M.051 540.312H1000.052V1081.053H.051Z','M.051 1620.782H1000.052V2161.523H.051Z','M1000.052 1620.782H2000V2161.523H1000.052Z']:
  s=re.sub(r'<path\b[^>]*\bd="'+re.escape(board)+r'"[^>]*/>','',s)
 p.write_text(s,encoding='utf8');svg=fitz.open(stream=s.encode(),filetype='svg');svg[0].get_pixmap(matrix=fitz.Matrix(2,2),alpha=True).save(str(assets/(name+'.png')))
mark=Image.open(assets/'monogram.png');mark.thumbnail((56,56));icon=Image.new('RGBA',(64,64),(207,229,217,255));icon.alpha_composite(mark,((64-mark.width)//2,(64-mark.height)//2));icon.save(assets/'favicon.png')

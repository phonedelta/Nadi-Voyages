"""Export only the original PDF's logo curves, with transparent backgrounds."""
from pathlib import Path
import fitz
from PIL import Image
root=Path(__file__).resolve().parent.parent
pdf=fitz.open(r'C:\Users\hp\Downloads\Agence_de_voyage_nadi.pdf')
drawings=pdf[0].get_drawings()
for name,box in {'logo':(585,80,1410,450),'logo-white':(1195,718,1795,905),'monogram':(846,88,1154,268)}.items():
 bounds=fitz.Rect(box);paths=[]
 def point(p):return f'{p.x-bounds.x0:.4f} {p.y-bounds.y0:.4f}'
 def color(c):return '#'+''.join(f'{round(v*255):02x}' for v in c)
 for drawing in drawings:
  if not bounds.contains(drawing['rect']):continue
  commands=[];previous=None
  for item in drawing['items']:
   op=item[0]
   if op in ('l','c'):
    if previous!=item[1]:commands.append('M'+point(item[1]))
    commands.append(('L'+point(item[2])) if op=='l' else ('C'+' '.join(point(p) for p in item[2:])))
    previous=item[-1]
   elif op=='re':
    r=item[1];commands.append(f'M{point(r.tl)}L{point(r.tr)}L{point(r.br)}L{point(r.bl)}Z');previous=None
   else:raise ValueError(f'Unexpected artwork operation: {op}')
  if drawing.get('closePath'):commands.append('Z')
  fill=color(drawing['fill']) if drawing.get('fill') else 'none'
  stroke=color(drawing['color']) if drawing.get('color') else 'none'
  width=drawing.get('width') or 1
  paths.append(f'<path d="{" ".join(commands)}" fill="{fill}" stroke="{stroke}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round" fill-rule="{"evenodd" if drawing.get("even_odd") else "nonzero"}"/>')
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{bounds.width:g}" height="{bounds.height:g}" viewBox="0 0 {bounds.width:g} {bounds.height:g}">'+''.join(paths)+'</svg>'
 (root/f'public/assets/{name}.svg').write_text(svg,encoding='utf8')
 asset=fitz.open(stream=svg.encode(),filetype='svg');asset[0].get_pixmap(matrix=fitz.Matrix(2,2),alpha=True).save(str(root/f'public/assets/{name}.png'))
 print(name,len(paths),'paths',len(svg),'bytes')
mark=Image.open(root/'public/assets/monogram.png');mark.thumbnail((56,56));icon=Image.new('RGBA',(64,64),(207,229,217,255));icon.alpha_composite(mark,((64-mark.width)//2,(64-mark.height)//2));icon.save(root/'public/assets/favicon.png')

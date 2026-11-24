import pathlib,re,requests,concurrent.futures,xml.etree.ElementTree as ET,fitz
from PIL import Image
root=pathlib.Path(__file__).resolve().parent.parent
text=(root/'docs/reference/index-CLVkx_k6.js').read_text(encoding='utf8')
images=dict(re.findall(r'^    (\w+): `(\d{10,}-[\w]+)`,',text,re.M))
assets=root/'public/assets'
def get_asset(pair):
 name,url=pair
 try:
  r=requests.get(url,timeout=60);r.raise_for_status();path=assets/(name+'.webp');path.write_bytes(r.content)
  im=Image.open(path);im.save(path,'WEBP',quality=85);return name,im.size
 except Exception as e:return name,str(e)
pairs=[(name,f'https://images.unsplash.com/photo-{photo}?auto=format&fit=crop&q=85&w=1600') for name,photo in images.items()]
pairs += [(name,'https://anfaltravel.ma/assets/'+remote) for name,remote in [('home-hero','home-hero-kaaba-day.webp'),('home-intro','home-intro-kaaba.webp'),('voyages-hero','voyages-hero-kaaba.webp')]]
# Service photos are selected by subject, independently of destination imagery.
service_photos = {
 'service-group': '17087507',
 'service-planning': '346760',
 'service-activities': '5531594',
 'service-support': '7709224',
}
pairs += [(name, f'https://images.pexels.com/photos/{photo}/pexels-photo-{photo}.jpeg?auto=compress&cs=tinysrgb&w=1200') for name, photo in service_photos.items()]
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
 for result in pool.map(get_asset,pairs):print(result)
# Remove only full-board background vector rectangles from extracted SVG.
for name in ['logo','logo-white','monogram']:
 p=assets/(name+'.svg');s=p.read_text()
 for board in ['M0 0H2000V1620.782H0Z','M.051 2161.523H1999.999V2702H.051Z','M.051 540.312H1000.052V1081.053H.051Z','M.051 1620.782H1000.052V2161.523H.051Z','M1000.052 1620.782H2000V2161.523H1000.052Z']:
  s=re.sub(r'<path\b[^>]*\bd="'+re.escape(board)+r'"[^>]*/>','',s)
 p.write_text(s,encoding='utf8')
 svg=fitz.open(stream=s.encode(),filetype='svg');pix=svg[0].get_pixmap(matrix=fitz.Matrix(2,2),alpha=True);pix.save(str(assets/(name+'.png')))
mark=Image.open(assets/'monogram.png');mark.thumbnail((56,56));icon=Image.new('RGBA',(64,64),(207,229,217,255));icon.alpha_composite(mark,((64-mark.width)//2,(64-mark.height)//2));icon.save(assets/'favicon.png')
# Host the same font families locally.
for family,name in [('Manrope:wght@400;500;600;700','manrope'),('Alexandria:wght@400;500;600;700','alexandria')]:
 r=requests.get('https://fonts.googleapis.com/css2?family='+family+'&display=swap',headers={'User-Agent':'Mozilla/5.0'},timeout=30)
 css=r.text
 for i,url in enumerate(dict.fromkeys(re.findall(r'url\(([^)]+)\)',css))):
  ext='.woff2' if 'woff2' in url else '.ttf';local=name+'-'+str(i)+ext
  (assets/local).write_bytes(requests.get(url,timeout=30).content);css=css.replace(url,'/assets/'+local)
 (assets/(name+'.css')).write_text(css,encoding='utf8')

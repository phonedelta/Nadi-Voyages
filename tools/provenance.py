import pathlib,requests,re,json
root=pathlib.Path(__file__).resolve().parent.parent
s=(root/'docs/reference/index-CLVkx_k6.js').read_text(encoding='utf8')
images=dict(re.findall(r'^    (\w+): `(\d{10,}-[\w]+)`,',s,re.M))
(root/'docs/assets.json').write_text(json.dumps([{'local':f'public/assets/{name}.webp','source':f'https://images.unsplash.com/photo-{photo}','width':1600} for name,photo in images.items()]+[{'local':f'public/assets/{name}.webp','source':'https://anfaltravel.ma/assets/'+remote} for name,remote in [('home-hero','home-hero-kaaba-day.webp'),('home-intro','home-intro-kaaba.webp'),('voyages-hero','voyages-hero-kaaba.webp')]]+[{'local':'public/assets/logo.svg, logo-white.svg, monogram.svg','source':'Agence_de_voyage_nadi.pdf fourni par le client','method':'Extraction vectorielle, cadrage et suppression des seuls fonds de la planche'}],ensure_ascii=False,indent=2),encoding='utf8')
for name in ['manrope','alexandria']:
 r=requests.get(f'https://raw.githubusercontent.com/google/fonts/main/ofl/{name}/OFL.txt',timeout=30);r.raise_for_status();(root/f'public/assets/{name}-OFL.txt').write_bytes(r.content)

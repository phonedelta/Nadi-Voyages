from pathlib import Path
p=Path('src/pages.tsx');s=p.read_text(encoding='utf8')
s=s.replace('<section className="section"><div className="container detail-layout">','<section className="section trip-detail-section"><div className="container"><Gallery images={[trip.img,...trip.gallery]} title={l(trip.dest)}/><div className="detail-layout">')
s=s.replace('<Gallery images={trip.gallery.slice(0,3)} title={l(trip.dest)}/>','')
s=s.replace('</form></aside></div></section><section className="section related-section">','</form></aside></div></div></section><section className="section related-section">')
s=s.replace('<details key={i} open={i===0}><summary><span>{t(\'tdDay\')} {i+1}</span><strong>{l(day.t)}</strong></summary><p>{l(day.d)}</p></details>','<article className="itinerary-day" key={i}><span>{t(\'tdDay\')} {i+1}</span><h3>{l(day.t)}</h3><p>{l(day.d)}</p></article>')
p.write_text(s,encoding='utf8')
p=Path('src/components.tsx');s=p.read_text(encoding='utf8').replace('<button key={img} onClick=','<button key={`${img}-${i}`} onClick=');s=s.replace('alt="La Kaaba à La Mecque"','alt=""').replace('alt="Pyramides d’Égypte"','alt=""');p.write_text(s,encoding='utf8')

import requests
import os

def download_flag(url, save_path):
    response = requests.get(url)
    
    if response.status_code == 200:
        country_code = url.split('/')[-1].split('.')[0]
        file_path = os.path.join(save_path, f"{country_code}.svg")
        with open(file_path, 'wb') as file:
            file.write(response.content)
        print(f"Bandera de {country_code} descargada exitosamente.")
    else:
        print(f"No se pudo descargar la bandera de {url}. Código de estado: {response.status_code}")

# Lista de URLs de banderas
urls = [
    "https://flagcdn.com/af.svg",
    "https://flagcdn.com/al.svg",
    "https://flagcdn.com/de.svg",
    "https://flagcdn.com/ad.svg",
    "https://flagcdn.com/ao.svg",
    "https://flagcdn.com/ag.svg",
    "https://flagcdn.com/sa.svg",
    "https://flagcdn.com/dz.svg",
    "https://flagcdn.com/ar.svg",
    "https://flagcdn.com/am.svg",
    "https://flagcdn.com/au.svg",
    "https://flagcdn.com/at.svg",
    "https://flagcdn.com/az.svg",
    "https://flagcdn.com/bs.svg",
    "https://flagcdn.com/bh.svg",
    "https://flagcdn.com/bd.svg",
    "https://flagcdn.com/bb.svg",
    "https://flagcdn.com/be.svg",
    "https://flagcdn.com/bz.svg",
    "https://flagcdn.com/bj.svg",
    "https://flagcdn.com/by.svg",
    "https://flagcdn.com/mm.svg",
    "https://flagcdn.com/bo.svg",
    "https://flagcdn.com/ba.svg",
    "https://flagcdn.com/bw.svg",
    "https://flagcdn.com/br.svg",
    "https://flagcdn.com/bn.svg",
    "https://flagcdn.com/bg.svg",
    "https://flagcdn.com/bf.svg",
    "https://flagcdn.com/bi.svg",
    "https://flagcdn.com/bt.svg",
    "https://flagcdn.com/cv.svg",
    "https://flagcdn.com/kh.svg",
    "https://flagcdn.com/cm.svg",
    "https://flagcdn.com/ca.svg",
    "https://flagcdn.com/qa.svg",
    "https://flagcdn.com/td.svg",
    "https://flagcdn.com/cl.svg",
    "https://flagcdn.com/cn.svg",
    "https://flagcdn.com/cy.svg",
    "https://flagcdn.com/co.svg",
    "https://flagcdn.com/km.svg",
    "https://flagcdn.com/kp.svg",
    "https://flagcdn.com/kr.svg",
    "https://flagcdn.com/ci.svg",
    "https://flagcdn.com/cr.svg",
    "https://flagcdn.com/hr.svg",
    "https://flagcdn.com/cu.svg",
    "https://flagcdn.com/dk.svg",
    "https://flagcdn.com/dm.svg",
    "https://flagcdn.com/ec.svg",
    "https://flagcdn.com/eg.svg",
    "https://flagcdn.com/sv.svg",
    "https://flagcdn.com/ae.svg",
    "https://flagcdn.com/er.svg",
    "https://flagcdn.com/sk.svg",
    "https://flagcdn.com/si.svg",
    "https://flagcdn.com/es.svg",
    "https://flagcdn.com/us.svg",
    "https://flagcdn.com/ee.svg",
    "https://flagcdn.com/sz.svg",
    "https://flagcdn.com/et.svg",
    "https://flagcdn.com/ph.svg",
    "https://flagcdn.com/fi.svg",
    "https://flagcdn.com/fj.svg",
    "https://flagcdn.com/fr.svg",
    "https://flagcdn.com/ga.svg",
    "https://flagcdn.com/gm.svg",
    "https://flagcdn.com/ge.svg",
    "https://flagcdn.com/gh.svg",
    "https://flagcdn.com/gd.svg",
    "https://flagcdn.com/gr.svg",
    "https://flagcdn.com/gt.svg",
    "https://flagcdn.com/gn.svg",
    "https://flagcdn.com/gq.svg",
    "https://flagcdn.com/gw.svg",
    "https://flagcdn.com/gy.svg",
    "https://flagcdn.com/ht.svg",
    "https://flagcdn.com/hn.svg",
    "https://flagcdn.com/hu.svg",
    "https://flagcdn.com/in.svg",
    "https://flagcdn.com/id.svg",
    "https://flagcdn.com/iq.svg",
    "https://flagcdn.com/ir.svg",
    "https://flagcdn.com/ie.svg",
    "https://flagcdn.com/is.svg",
    "https://flagcdn.com/mh.svg",
    "https://flagcdn.com/sb.svg",
    "https://flagcdn.com/il.svg",
    "https://flagcdn.com/it.svg",
    "https://flagcdn.com/jm.svg",
    "https://flagcdn.com/jp.svg",
    "https://flagcdn.com/jo.svg",
    "https://flagcdn.com/kz.svg",
    "https://flagcdn.com/ke.svg",
    "https://flagcdn.com/kg.svg",
    "https://flagcdn.com/ki.svg",
    "https://flagcdn.com/kw.svg",
    "https://flagcdn.com/la.svg",
    "https://flagcdn.com/ls.svg",
    "https://flagcdn.com/lv.svg",
    "https://flagcdn.com/lb.svg",
    "https://flagcdn.com/lr.svg",
    "https://flagcdn.com/ly.svg",
    "https://flagcdn.com/li.svg",
    "https://flagcdn.com/lt.svg",
    "https://flagcdn.com/lu.svg",
    "https://flagcdn.com/mk.svg",
    "https://flagcdn.com/mg.svg",
    "https://flagcdn.com/my.svg",
    "https://flagcdn.com/mw.svg",
    "https://flagcdn.com/mv.svg",
    "https://flagcdn.com/ml.svg",
    "https://flagcdn.com/mt.svg",
    "https://flagcdn.com/ma.svg",
    "https://flagcdn.com/mu.svg",
    "https://flagcdn.com/mr.svg",
    "https://flagcdn.com/mx.svg",
    "https://flagcdn.com/fm.svg",
    "https://flagcdn.com/md.svg",
    "https://flagcdn.com/mc.svg",
    "https://flagcdn.com/mn.svg",
    "https://flagcdn.com/me.svg",
    "https://flagcdn.com/mz.svg",
    "https://flagcdn.com/na.svg",
    "https://flagcdn.com/nr.svg",
    "https://flagcdn.com/np.svg",
    "https://flagcdn.com/ni.svg",
    "https://flagcdn.com/ne.svg",
    "https://flagcdn.com/ng.svg",
    "https://flagcdn.com/no.svg",
    "https://flagcdn.com/nz.svg",
    "https://flagcdn.com/om.svg",
    "https://flagcdn.com/nl.svg",
    "https://flagcdn.com/pk.svg",
    "https://flagcdn.com/pw.svg",
    "https://flagcdn.com/ps.svg",
    "https://flagcdn.com/pa.svg",
    "https://flagcdn.com/pg.svg",
    "https://flagcdn.com/py.svg",
    "https://flagcdn.com/pe.svg",
    "https://flagcdn.com/pl.svg",
    "https://flagcdn.com/pt.svg",
    "https://flagcdn.com/gb.svg",
    "https://flagcdn.com/cf.svg",
    "https://flagcdn.com/cz.svg",
    "https://flagcdn.com/cg.svg",
    "https://flagcdn.com/cd.svg",
    "https://flagcdn.com/do.svg",
    "https://flagcdn.com/rw.svg",
    "https://flagcdn.com/ro.svg",
    "https://flagcdn.com/ru.svg",
    "https://flagcdn.com/ws.svg",
    "https://flagcdn.com/kn.svg",
    "https://flagcdn.com/sm.svg",
    "https://flagcdn.com/vc.svg",
    "https://flagcdn.com/lc.svg",
    "https://flagcdn.com/st.svg",
    "https://flagcdn.com/sn.svg",
    "https://flagcdn.com/rs.svg",
    "https://flagcdn.com/sc.svg",
    "https://flagcdn.com/sl.svg",
    "https://flagcdn.com/sg.svg",
    "https://flagcdn.com/sy.svg",
    "https://flagcdn.com/so.svg",
    "https://flagcdn.com/lk.svg",
    "https://flagcdn.com/za.svg",
    "https://flagcdn.com/sd.svg",
    "https://flagcdn.com/ss.svg",
    "https://flagcdn.com/se.svg",
    "https://flagcdn.com/ch.svg",
    "https://flagcdn.com/sr.svg",
    "https://flagcdn.com/th.svg",
    "https://flagcdn.com/tz.svg",
    "https://flagcdn.com/tj.svg",
    "https://flagcdn.com/tl.svg",
    "https://flagcdn.com/tg.svg",
    "https://flagcdn.com/to.svg",
    "https://flagcdn.com/tt.svg",
    "https://flagcdn.com/tn.svg",
    "https://flagcdn.com/tm.svg",
    "https://flagcdn.com/tr.svg",
    "https://flagcdn.com/tv.svg",
    "https://flagcdn.com/ua.svg",
    "https://flagcdn.com/ug.svg",
    "https://flagcdn.com/uy.svg",
    "https://flagcdn.com/uz.svg",
    "https://flagcdn.com/vu.svg",
    "https://flagcdn.com/va.svg",
    "https://flagcdn.com/ve.svg",
    "https://flagcdn.com/vn.svg",
    "https://flagcdn.com/ye.svg",
    "https://flagcdn.com/dj.svg",
    "https://flagcdn.com/zm.svg",
    "https://flagcdn.com/zw.svg"
]

# Directorio donde se guardarán las banderas
save_directory = r"X:\Banderas"

# Asegurarse de que el directorio exista
os.makedirs(save_directory, exist_ok=True)

# Descargar las banderas
for url in urls:
    download_flag(url, save_directory)

print("Proceso de descarga completado.")
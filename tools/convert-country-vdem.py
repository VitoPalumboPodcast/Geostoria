"""Conversione del file ufficiale R V-Dem (pyreadr, pandas)."""
from pathlib import Path
import sys
root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root/'.data-cache/python-libs'))
import pyreadr
d=pyreadr.read_r(str(root/'.data-cache/vdem.RData'))['vdem']
d[['country_name','country_text_id','year','v2x_regime','v2x_polyarchy','v2x_regime_amb']].to_csv(root/'.data-cache/vdem-reduced.csv',index=False)
c=pyreadr.read_r(str(root/'.data-cache/codebook.RData'))['codebook']
print(c.loc[c.tag=='v2x_regime_amb','responses'].to_string(index=False))

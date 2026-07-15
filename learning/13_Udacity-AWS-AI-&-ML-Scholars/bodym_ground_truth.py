"""
Ground truth do dataset BodyM para confronto com a análise do Whiskers (PartyRock).

Calcula de forma determinística:
  1. Descritivas por coluna (n, média, mediana, desvio, min, max, sinal de assimetria)
  2. Correlações entre todos os pares, ranqueadas
  3. Outliers por coluna (regra do IQR de 1.5)

Uso:
    python bodym_ground_truth.py caminho/para/bodym.csv

Convenções: Python 3.11 + venv, Polars. Identificadores em inglês, comentários em PT.
"""

import sys
from itertools import combinations

import polars as pl

# --- carregamento -----------------------------------------------------------
# passe o caminho como argumento; senão tenta "bodym.csv" no diretório atual
path = sys.argv[1] if len(sys.argv) > 1 else "bodym.csv"
df = pl.read_csv(path)

# colunas numéricas = tudo que não é o identificador
numeric_dtypes = (pl.Float64, pl.Float32, pl.Int64, pl.Int32)
num_cols = [c for c in df.columns if df[c].dtype in numeric_dtypes]

# --- 1. descritivas (confronta com o prompt de estatísticas do Whiskers) -----
desc_rows = []
for c in num_cols:
    s = df[c]
    mean_v, median_v = s.mean(), s.median()
    # sinal de assimetria via relação média x mediana (sniff test, não é skewness formal)
    if mean_v > median_v:
        skew = "direita (media > mediana)"
    elif mean_v < median_v:
        skew = "esquerda (media < mediana)"
    else:
        skew = "simetrico"
    desc_rows.append({
        "coluna": c,
        "n": s.len() - s.null_count(),
        "media": round(mean_v, 2),
        "mediana": round(median_v, 2),
        "desvio": round(s.std(), 2),
        "min": round(s.min(), 2),
        "max": round(s.max(), 2),
        "assimetria": skew,
    })

print("\n=== 1. DESCRITIVAS ===")
with pl.Config(tbl_rows=-1):
    print(pl.DataFrame(desc_rows))

# --- 2. correlações ranqueadas (confronta com o prompt de correlação) --------
corr_rows = []
for a, b in combinations(num_cols, 2):
    r = df.select(pl.corr(a, b)).item()
    corr_rows.append({"par": f"{a} ~ {b}", "r": round(r, 3)})

corr_df = pl.DataFrame(corr_rows).sort("r", descending=True)
print("\n=== 2. CORRELACOES (top 10 mais fortes) ===")
print(corr_df.head(10))

# --- 3. outliers por IQR (confronta com o prompt de outliers) ----------------
out_rows = []
for c in num_cols:
    q1 = df[c].quantile(0.25)
    q3 = df[c].quantile(0.75)
    iqr = q3 - q1
    lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
    n_out = df.filter((pl.col(c) < lo) | (pl.col(c) > hi)).height
    out_rows.append({
        "coluna": c,
        "limite_inf": round(lo, 2),
        "limite_sup": round(hi, 2),
        "n_outliers": n_out,
    })

print("\n=== 3. OUTLIERS (regra IQR 1.5) ===")
with pl.Config(tbl_rows=-1):
    print(pl.DataFrame(out_rows).sort("n_outliers", descending=True))
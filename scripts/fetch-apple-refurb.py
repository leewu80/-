#!/usr/bin/env python3
"""从苹果官网翻新页抓当前在售 MacBook，写成 src/data/live-listings.ts。"""

from __future__ import annotations

import json
import re
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

SOURCE = "https://www.apple.com.cn/shop/refurbished/mac"
OUT = Path(__file__).resolve().parents[1] / "src" / "data" / "live-listings.ts"

CHIP_RE = re.compile(r"(M5 Max|M5 Pro|M4 Max|M4 Pro|M3 Max|M3 Pro|M5|M4|M3|M2|M1|A18 Pro)")
GPU_RE = re.compile(r"(\d+)\s*核图形")
TITLE_RE = re.compile(
    r'"dimensionCapacity":"([^"]+)","dimensionScreensize":"([^"]*)","refurbClearModel":"([^"]+)"'
    r',"dimensionRelYear":"(\d+)","dimensionColor":"[^"]+","tsMemorySize":"([^"]+)"\}'
    r'\},"partNumber":"([^"]+)","title":"([^"]+)"'
)
PRICE_RE = re.compile(r'"raw_amount":"([0-9.]+)"')
URL_RE = re.compile(r'"productDetailsUrl":"(/shop/product/[^"?]+)')


def storage_gb(label: str) -> int:
    text = label.lower()
    if text.endswith("tb"):
        return int(float(text[:-2]) * 1024)
    if text.endswith("gb"):
        return int(text[:-2])
    raise ValueError(label)


def memory_gb(label: str) -> int:
    return int(label.lower().replace("gb", ""))


def series_of(model: str) -> str:
    if model == "macbookair":
        return "Air"
    if model == "macbookpro":
        return "Pro"
    if model == "macbookneo":
        return "Neo"
    return ""


def chip_family(detail: str) -> str:
    if detail.startswith("M5"):
        return "M5"
    if detail.startswith("M4"):
        return "M4"
    if detail.startswith("M3"):
        return "M3"
    if detail.startswith("M2"):
        return "M2"
    if detail.startswith("M1"):
        return "M1"
    if detail.startswith("A18"):
        return "A18"
    return "Intel"


def fetch() -> str:
    request = urllib.request.Request(SOURCE, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8", "ignore")


def parse(html: str) -> list[dict]:
    rows: list[dict] = []
    seen: set[str] = set()
    for match in TITLE_RE.finditer(html):
        capacity, screen, model, year, memory, part, title = match.groups()
        series = series_of(model)
        if not series:
            continue
        chip_match = CHIP_RE.search(title)
        if not chip_match:
            continue
        chip_detail = chip_match.group(1)
        gpu_match = GPU_RE.search(title)
        gpu = f"{gpu_match.group(1)} 核 GPU" if gpu_match else "集成 GPU"
        after = html[match.end() : match.end() + 900]
        before = html[max(0, match.start() - 6000) : match.start()]
        price_match = PRICE_RE.search(after)
        urls = list(URL_RE.finditer(before))
        url_match = urls[-1] if urls else None
        if not price_match or not url_match:
            continue
        if part in seen:
            continue
        seen.add(part)
        inches = screen.replace("inch", "")
        name = f"MacBook {series} {inches} 英寸" if inches else f"MacBook {series}"
        price = int(float(price_match.group(1)))
        rows.append(
            {
                "id": f"apple-{part.lower().replace('/', '-')}",
                "series": series,
                "model": name,
                "year": int(year),
                "chip": chip_family(chip_detail),
                "chipDetail": chip_detail,
                "memoryGb": memory_gb(memory),
                "storageGb": storage_gb(capacity),
                "gpu": gpu,
                "condition": "官翻",
                "price": price,
                "channel": "apple",
                "seller": "苹果官方翻新",
                "note": title.replace("翻新 ", ""),
                "linkUrl": "https://www.apple.com.cn" + url_match.group(1),
                "origin": "sample",
            }
        )
    rows.sort(key=lambda item: (item["price"], item["id"]))
    return rows


def emit(rows: list[dict], fetched_at: str) -> str:
    body = json.dumps(rows, ensure_ascii=False, indent=2)
    return (
        "// 由 scripts/fetch-apple-refurb.py 从苹果官网翻新页生成，不要手改价格。\n"
        f"export const LISTINGS_FETCHED_AT = {json.dumps(fetched_at)};\n"
        f"export const LISTINGS_SOURCE = {json.dumps(SOURCE)};\n"
        f"export const LIVE_LISTINGS = {body} as const;\n"
    )


def main() -> None:
    html = fetch()
    rows = parse(html)
    if len(rows) < 20:
        raise SystemExit(f"只解析到 {len(rows)} 条，放弃覆盖旧数据")
    fetched_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    OUT.write_text(emit(rows, fetched_at), encoding="utf-8")
    print(f"wrote {len(rows)} listings to {OUT}")


if __name__ == "__main__":
    main()

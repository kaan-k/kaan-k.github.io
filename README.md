# BizimPOS Dokümantasyon (Docsify Şablonu)

Bu repo, **sürüm bazlı dokümantasyon** yazabilmen için hazır bir Docsify şablonudur.

## Hedefler

- Her sürüm için ayrı doküman: `v1.0.0`, `v1.0.5`, ...
- Üst menüde **Sürüm seçici (Version Toggle)**
- Tek bir **Changelog** sayfası (`#/CHANGELOG`)
- Modül dokümanları: Cari, POS, Stok, Faturalar, Raporlar, Kullanıcılar, Ayarlar, Veritabanı Ayarları

## Hızlı Kurulum

> Node.js yüklü olmalı.

```bash
npm i -g docsify-cli
docsify serve docs
```

Tarayıcıdan aç:
- http://localhost:3000

## Sürüm Yapısı

- Her sürüm kendi klasöründe durur:
  - `docs/v1.0.0/*`
  - `docs/v1.0.5/*`

- Her sürüm kendi sidebar'ını taşır:
  - `docs/v1.0.0/_sidebar.md`
  - `docs/v1.0.5/_sidebar.md`

## Yeni sürüm eklemek

1) `docs/v1.0.5` klasörünü kopyala → `docs/v1.0.6`

2) `docs/versions.json` içine sürümü ekle ve `latest` güncelle:

```json
{
  "latest": "1.0.6",
  "versions": ["1.0.0", "1.0.5", "1.0.6"]
}
```

3) Sürüm klasöründe gereken sayfaları güncelle.

## Notlar

- Sürüm seçici, URL şu şekildeyken çalışır: `#/v1.0.5/...`
- Version switcher aynı sayfa yolunu korumaya çalışır (örnek: POS → POS).
  Eğer yeni sürümde o sayfa yoksa README’ye düşürmek için ilgili sayfaya link verebilirsin.

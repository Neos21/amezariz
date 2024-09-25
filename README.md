# Amezariz : アイドルプロジェクト「アメザリズ」

[![Netlify Status](https://api.netlify.com/api/v1/badges/6199102d-777d-4bab-bfa9-518ccb4595d1/deploy-status)](https://app.netlify.com/sites/amezariz/deploys)

__[Enter The WebSite](https://amezariz.netlify.app/)__


- ローカル開発では `$ npm run local-dev` を用いる
    - `netlify.toml` の設定に従い `$ npm run dev` を実行・ラップした開発用サーバが起動する
- ビルド後のサイト確認は `$ npm run serve` を用いる
    - `netlify.toml` の設定に従い `$ npm run build` が行われ、Netlify Functions 部分をラップしたローカルサーバが起動する
- Git Push すると、連携している Netlify へ自動的にデプロイされる

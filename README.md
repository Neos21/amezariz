# Amezariz : アイドルプロジェクト「アメザリズ」

[![Netlify Status](https://api.netlify.com/api/v1/badges/6199102d-777d-4bab-bfa9-518ccb4595d1/deploy-status)](https://app.netlify.com/sites/amezariz/deploys)

__[Enter The WebSite](https://amezariz.netlify.app/)__


## デプロイ方法

- 本リポジトリの `docs/` 配下のファイルを更新する
    - `docs/` 配下は完全な静的ページとして機能するようになっている
    - Dev : `$ npx sirv-cli ./docs/ --host --dev`
- Git Push すると、連携している Netlify へ自動的にデプロイされる

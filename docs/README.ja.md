# chrome-mru-tabs

[English](../README.md)

直前にアクティブだったタブへ戻る Chrome 拡張機能です。

## 開発

```sh
nix develop
just setup
```

| コマンド     | 説明                                 |
| ------------ | ------------------------------------ |
| `just fmt`   | フォーマット                         |
| `just lint`  | 型情報を使ったリント                 |
| `just check` | ファイルを変更せずに全チェックを実行 |
| `just build` | 拡張機能を `dist/` にバンドル        |

## ライセンス

[Apache-2.0](../LICENSE)

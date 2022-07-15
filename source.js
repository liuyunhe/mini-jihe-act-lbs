const { camelCase } = require('lodash')

const source = {
  "lbs-bg-act-rule": "lbs-bg-act-rule.png",
  "lbs-bg-pk-success": "lbs-bg-pk-success.png",
  "lbs-btn-known": "lbs-btn-known1.png",
  "lbs-icon-cloth": "lbs-icon-cloth.png",
  "lbs-icon-stone-circle": "lbs-icon-stone-circle.png",
  "lbs-bg-choose-guesture": "lbs-bg-choose-guesture.png",
  "lbs-bg-pk-xianzi-fail": "lbs-bg-pk-xianzi-fail.png",
  "lbs-btn-kuaisuxunhe": "lbs-btn-kuaisuxunhe.png",
  "lbs-icon-hebao": "lbs-icon-hebao.png",
  "lbs-icon-stone": "lbs-icon-stone.png",
  "lbs-bg-confirm": "lbs-bg-confirm1.png",
  "lbs-bg-pker-info": "lbs-bg-pker-info.png",
  "lbs-btn-pk-soon": "lbs-btn-pk-soon.png",
  "lbs-icon-hedian": "lbs-icon-hedian.png",
  "lbs-icon-vs": "lbs-icon-vs.png",
  "lbs-bg-game-history": "lbs-bg-game-history.png",
  "lbs-bg-xianzi": "lbs-bg-xianzi.png",
  "lbs-btn-rule": "lbs-btn-rule.png",
  "lbs-icon-marker-hebao": "lbs-icon-marker-hebao.png",
  "lbs-icon-xianzi": "lbs-icon-xianzi1.png",
  "lbs-bg-get-hebao": "lbs-bg-get-hebao.png",
  "lbs-btn-confirm": "lbs-btn-confirm.png",
  "lbs-btn-shanghezhongguoxing": "lbs-btn-shanghezhongguoxing.png",
  "lbs-icon-pker-left": "lbs-icon-pker-left.png",
  "lbs-marker-pk": "lbs-marker-pk.png",
  "lbs-bg-hedian-get": "lbs-bg-hedian-get.png",
  "lbs-btn-game-history": "lbs-btn-game-history.png",
  "lbs-btn-submit": "lbs-btn-submit.png",
  "lbs-icon-pker-right": "lbs-icon-pker-right.png",
  "lbs-marker-shop": "lbs-marker-shop.png",
  "lbs-bg-hedian-got": "lbs-bg-hedian-got.png",
  "lbs-btn-get-quick": "lbs-btn-get-quick.png",
  "lbs-icon-avatar-default": "lbs-icon-avatar-default.png",
  "lbs-icon-sisors-circle": "lbs-icon-sisors-circle.png",
  "lbs-pk-bg": "lbs-pk-bg.jpg",
  "lbs-bg-pk-fail": "lbs-bg-pk-fail.png",
  "lbs-btn-hejia-gift": "lbs-btn-hejia-gift.png",
  "lbs-icon-close-green": "lbs-icon-close-green.png",
  "lbs-icon-sisors": "lbs-icon-sisors.png",
  "lbs-bg-pk-rule": "lbs-bg-pk-rule.png",
  "lbs-btn-join": "lbs-btn-join.png",
  "lbs-icon-cloth-circle": "lbs-icon-cloth-circle.png",
  "lbs-icon-start": "lbs-icon-start.png"
}
let sourceNew = {}
for (const i in source) {
  sourceNew[camelCase(i.replace('lbs', ''))] = source[i]
}

console.log(JSON.stringify(sourceNew))
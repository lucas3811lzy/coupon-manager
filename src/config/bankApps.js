// 設為 null 時自動改用 App Store 搜尋；網址集中在此維護。
export const BANK_APPS = Object.freeze({
  boc: { name: '中國銀行', url: 'https://apps.apple.com/us/app/boc-macau/id479179008' },
  icbc: { name: '工商銀行', url: 'https://apps.apple.com/ru/app/icbc-mobile-banking/id584398176?l=en-GB&platform=mac' },
  macaupass: { name: 'MPay澳門錢包', url: 'https://apps.apple.com/us/app/mpay%E6%BE%B3%E9%96%80%E9%8C%A2%E5%8C%85/id1092594338' },
  luso: { name: '澳門國際銀行', url: 'https://apps.apple.com/au/app/%E6%BE%B3%E9%96%80%E5%9C%8B%E9%9A%9B%E9%8A%80%E8%A1%8C%E5%80%8B%E4%BA%BA%E6%89%8B%E6%A9%9F%E9%8A%80%E8%A1%8C/id1014923812' },
  taifung: { name: '大豐銀行', url: 'https://apps.apple.com/us/app/%E8%B1%90%E4%BB%98%E5%AF%B6/id500132293' },
  cgb: { name: '廣發銀行', url: 'https://apps.apple.com/us/app/%E5%BB%A3%E7%99%BC%E9%8A%80%E8%A1%8C%E6%B5%B7%E5%A4%96/id1002337256' },
  alipay: { name: '支付寶', url: 'https://apps.apple.com/us/app/alipay-simplify-your-life/id333206289' }
})

export function bankSearchUrl (bank) {
  return 'https://apps.apple.com/us/iphone/search?term=' + encodeURIComponent(BANK_APPS[bank]?.name || bank)
}

export function bankAppUrl (bank) {
  return BANK_APPS[bank]?.url || bankSearchUrl(bank)
}

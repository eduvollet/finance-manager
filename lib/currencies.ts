export const Currencies = [
    {value: "USD", label: "US Dollar ($)", locale: "en-US"},
    {value: "EUR", label: "Euro (€)", locale: "de-DE"},
    {value: "JPY", label: "Japanese Yen (¥)", locale: "ja-JP"},
    {value: "BRL", label: "Brazilian Real (R$)", locale: "pt-BR"},
]

export type Currency = (typeof Currencies)[0];
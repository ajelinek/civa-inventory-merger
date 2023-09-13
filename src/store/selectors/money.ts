export function penniesDisplay(pennies: number): string {
  return moneyDisplay(pennies / 100)
}

export function moneyDisplay(money: number): string {
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  return formatter.format(money)
}

export function penniesToMoney(pennies: number): number {
  return pennies / 100
}
import { moneyDisplay } from '../../store/selectors/money'

interface MoneyProps {
  children: number | null | undefined
  zero?: string
}

function Money({ children, zero = '-' }: MoneyProps) {
  const amount = Number(children) || 0
  const money = !amount ? zero : moneyDisplay(amount)

  return (
    <span className={'money'}>
      {money}
    </span>
  )
}

export default Money
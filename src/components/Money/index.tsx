import { moneyDisplay } from '../../store/selectors/money'

interface MoneyProps {
  children: number
  zero?: string
}

function Money({ children, zero = '-' }: MoneyProps) {
  const amount = +children || 0
  const money = !amount ? zero : moneyDisplay(children)

  return (
    <span className={'money'}>
      {money}
    </span>
  )
}

export default Money
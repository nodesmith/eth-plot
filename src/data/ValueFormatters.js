import Decimal from 'decimal.js';

export function formatEthValue(ammountInWei) {
  if (ammountInWei.length === 0) {
    return {
      value: '',
      unit: 'wei'
    }
  }

  const value = Decimal(ammountInWei);

  if (value.lessThan(Decimal('1.0e6'))) {
    return {
      value: value.toFixed(),
      unit: 'wei'
    };
  } else if (value.lessThan(Decimal('1.0e15'))) {
    return {
      value: value.div(Decimal('1.0e9')).toFixed(),
      unit: 'gwei'
    };
  } else {
    return {
      value: value.div(Decimal('1.0e18')).toFixed(),
      unit: 'eth'
    };
  }
}
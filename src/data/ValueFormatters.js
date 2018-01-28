import Decimal from 'decimal.js';

export function formatValue(decimal) {
  const decimalPoints = decimal.decimalPlaces();
  const numDecimals = Math.min(decimalPoints, 4);
  return decimal.toFixed(numDecimals);
}

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
      value: formatValue(value),
      unit: 'wei'
    };
  } else if (value.lessThan(Decimal('1.0e15'))) {
    return {
      value: formatValue(value.div(Decimal('1.0e9'))),
      unit: 'gwei'
    };
  } else {
    return {
      value: formatValue(value.div(Decimal('1.0e18'))),
      unit: 'eth'
    };
  }
}

export function formatEthValueToString(ammountInWei) {
  const formatObj = formatEthValue(ammountInWei);
  return `${formatObj.value} ${formatObj.unit}`;
}
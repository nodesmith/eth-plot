import Decimal from 'decimal.js';
export function formatValue(decimal) {
    var decimalPoints = decimal.decimalPlaces();
    var numDecimals = Math.min(decimalPoints, 4);
    return decimal.toFixed(numDecimals);
}
export function formatEthValue(ammountInWei) {
    if (typeof ammountInWei === 'string' && ammountInWei.length === 0) {
        return {
            value: '',
            unit: 'wei'
        };
    }
    var value = new Decimal(ammountInWei);
    if (value.lessThan(new Decimal('1.0e6'))) {
        return {
            value: formatValue(value),
            unit: 'wei'
        };
    }
    else if (value.lessThan(new Decimal('1.0e15'))) {
        return {
            value: formatValue(value.div(new Decimal('1.0e9'))),
            unit: 'gwei'
        };
    }
    else {
        return {
            value: formatValue(value.div(new Decimal('1.0e18'))),
            unit: 'eth'
        };
    }
}
export function formatEthValueToString(ammountInWei) {
    var formatObj = formatEthValue(ammountInWei);
    return formatObj.value + " " + formatObj.unit;
}
//# sourceMappingURL=ValueFormatters.js.map
export function GetNetworkColor(chain?: number) {
 if (chain === 1) return 'green'
 if (chain === 420) return 'red'
 if (chain === 84531) return 'blue'
 if (chain === 919) return 'yellow'
 if (chain === 999) return 'purple'

 return 'grey'
}

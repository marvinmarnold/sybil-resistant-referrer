import { computeExternalNullifier, hashToField } from '../../lib/wld'

export default function Subject() {
 const signal = '0x1635b64e3f897C4E3E5bA9972ea4618ee682dADE'
 const field = hashToField(signal)
 console.log('Converting signal ' + signal)
 console.log(field.toString())

 const externalNullifier = computeExternalNullifier('app_staging_f76857baa94ac9ef1ec53f86bbecccba', '20001')
 console.log('externalNullifier')
 console.log(externalNullifier.toString())
 return null
}

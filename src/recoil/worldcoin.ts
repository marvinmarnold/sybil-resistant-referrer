import { atom, selector } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

// Atoms
export const merkleRootAtom = atom({
 key: 'merkleRoot',
 default: null as bigint | null,
 effects_UNSTABLE: [persistAtom],
})

export const nullifierAtom = atom({
 key: 'nullifier',
 default: null as bigint | null,
 effects_UNSTABLE: [persistAtom],
})

export const proofAtom = atom({
 key: 'proof',
 default: null as [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint] | null,
 effects_UNSTABLE: [persistAtom],
})

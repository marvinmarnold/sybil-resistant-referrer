import { atom, selector } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist({
 key: 'recoil',
})

// Atoms
export const merkleRootAtom = atom({
 key: 'merkleRoot',
 default: null as string | null,
 effects_UNSTABLE: [persistAtom],
})

export const nullifierAtom = atom({
 key: 'nullifier',
 default: null as string | null,
 effects_UNSTABLE: [persistAtom],
})

export const proofAtom = atom({
 key: 'proof',
 default: [] as (string | null)[],
 effects_UNSTABLE: [persistAtom],
})

// Selectors

import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  AcceptedReferral,
  Initialized,
  OwnershipTransferred,
  ReferrerAdded
} from "../generated/ReferralCampaign/ReferralCampaign"

export function createAcceptedReferralEvent(
  param0: Address,
  param1: Address
): AcceptedReferral {
  let acceptedReferralEvent = changetype<AcceptedReferral>(newMockEvent())

  acceptedReferralEvent.parameters = new Array()

  acceptedReferralEvent.parameters.push(
    new ethereum.EventParam("param0", ethereum.Value.fromAddress(param0))
  )
  acceptedReferralEvent.parameters.push(
    new ethereum.EventParam("param1", ethereum.Value.fromAddress(param1))
  )

  return acceptedReferralEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createReferrerAddedEvent(param0: Address): ReferrerAdded {
  let referrerAddedEvent = changetype<ReferrerAdded>(newMockEvent())

  referrerAddedEvent.parameters = new Array()

  referrerAddedEvent.parameters.push(
    new ethereum.EventParam("param0", ethereum.Value.fromAddress(param0))
  )

  return referrerAddedEvent
}

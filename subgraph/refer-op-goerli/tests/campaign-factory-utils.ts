import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  CampaignCreated,
  CampaignTagged,
  CampaignWorking
} from "../generated/CampaignFactory/CampaignFactory"

export function createCampaignCreatedEvent(
  owner: Address,
  campaign: Address,
  actionId: BigInt
): CampaignCreated {
  let campaignCreatedEvent = changetype<CampaignCreated>(newMockEvent())

  campaignCreatedEvent.parameters = new Array()

  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("campaign", ethereum.Value.fromAddress(campaign))
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "actionId",
      ethereum.Value.fromUnsignedBigInt(actionId)
    )
  )

  return campaignCreatedEvent
}

export function createCampaignTaggedEvent(
  param0: Address,
  param1: string
): CampaignTagged {
  let campaignTaggedEvent = changetype<CampaignTagged>(newMockEvent())

  campaignTaggedEvent.parameters = new Array()

  campaignTaggedEvent.parameters.push(
    new ethereum.EventParam("param0", ethereum.Value.fromAddress(param0))
  )
  campaignTaggedEvent.parameters.push(
    new ethereum.EventParam("param1", ethereum.Value.fromString(param1))
  )

  return campaignTaggedEvent
}

export function createCampaignWorkingEvent(
  param0: Address,
  param1: Address
): CampaignWorking {
  let campaignWorkingEvent = changetype<CampaignWorking>(newMockEvent())

  campaignWorkingEvent.parameters = new Array()

  campaignWorkingEvent.parameters.push(
    new ethereum.EventParam("param0", ethereum.Value.fromAddress(param0))
  )
  campaignWorkingEvent.parameters.push(
    new ethereum.EventParam("param1", ethereum.Value.fromAddress(param1))
  )

  return campaignWorkingEvent
}

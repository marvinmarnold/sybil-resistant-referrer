import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { CampaignCreated } from "../generated/CampaignFactory/CampaignFactory"

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

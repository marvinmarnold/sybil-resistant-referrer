import {
  CampaignCreated as CampaignCreatedEvent,
  CampaignTagged as CampaignTaggedEvent,
  CampaignWorking as CampaignWorkingEvent
} from "../generated/CampaignFactory/CampaignFactory"
import {
  CampaignCreated,
  CampaignTagged,
  CampaignWorking
} from "../generated/schema"

export function handleCampaignCreated(event: CampaignCreatedEvent): void {
  let entity = new CampaignCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.campaign = event.params.campaign
  entity.actionId = event.params.actionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCampaignTagged(event: CampaignTaggedEvent): void {
  let entity = new CampaignTagged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.param0 = event.params.param0
  entity.param1 = event.params.param1

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCampaignWorking(event: CampaignWorkingEvent): void {
  let entity = new CampaignWorking(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.param0 = event.params.param0
  entity.param1 = event.params.param1

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

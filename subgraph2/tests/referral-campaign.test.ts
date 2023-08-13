import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { AcceptedReferral } from "../generated/schema"
import { AcceptedReferral as AcceptedReferralEvent } from "../generated/ReferralCampaign/ReferralCampaign"
import { handleAcceptedReferral } from "../src/referral-campaign"
import { createAcceptedReferralEvent } from "./referral-campaign-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let param0 = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let param1 = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newAcceptedReferralEvent = createAcceptedReferralEvent(param0, param1)
    handleAcceptedReferral(newAcceptedReferralEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AcceptedReferral created and stored", () => {
    assert.entityCount("AcceptedReferral", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AcceptedReferral",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "param0",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AcceptedReferral",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "param1",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

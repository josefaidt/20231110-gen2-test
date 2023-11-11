import type { PreSignUpTriggerHandler } from 'aws-lambda'

export const handler: PreSignUpTriggerHandler = async (event) => {
  console.log('event: ', JSON.stringify(event, null, 2))
}

import * as url from 'node:url'
import { createRequire } from 'node:module'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs'
import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import { data } from './data/resource'

const backend = defineBackend({
  auth,
  data,
})

// create function stack for the auth triggers
const authTriggerStack = backend.getStack('AuthTriggerStack')

// create the PostConfirmation trigger
const postConfirmationTrigger = new lambda.NodejsFunction(
  authTriggerStack,
  'PostConfirmation',
  {
    entry: url.fileURLToPath(
      new URL('./custom/post-confirmation.ts', import.meta.url)
    ),
  }
)

// add the newly-created trigger to the auth resource
const userPool = backend.resources.auth.resources.userPool as cognito.UserPool
userPool.addTrigger(
  cognito.UserPoolOperation.POST_CONFIRMATION,
  postConfirmationTrigger
)

// try something crazy

const require = createRequire(import.meta.url)
const preSignupTrigger = new lambda.NodejsFunction(
  authTriggerStack,
  'PreSignup',
  {
    entry: require.resolve('@my/pre-signup'),
  }
)
userPool.addTrigger(cognito.UserPoolOperation.PRE_SIGN_UP, preSignupTrigger)

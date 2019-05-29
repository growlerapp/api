import { GraphQLResolveInfo } from 'graphql'
import { Request } from 'express'

export interface Context {
  req: Request
}

export interface Args<TInputArgs> {
  input: TInputArgs
}

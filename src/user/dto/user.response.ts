// class TokenData {
//   @Field()
//   token: string;

//   @Field(() => Int)
//   expiresIn: number;
// }

// @ObjectType()
// export class AuthResponse {
//   @Field(() => TokenData)
//   access: TokenData;

//   @Field(() => TokenData)
//   refresh: TokenData;
// }

// @ObjectType()
// export class ClientAuthResponse {
//   @Field(() => TokenData)
//   access: TokenData;
// }

interface TokenData {
  token: string;
  expiresIn: number;
}

export class AuthResponse {
  access: TokenData;
  refresh: TokenData;
}

import { IsInt, IsString, IsUrl, Max, Min } from 'class-validator';
import { type StringValue } from 'ms';
import { IsDuration } from 'src/common/decorators/is-duration.decorator';
import { ShouldBeNestedValidated } from 'src/common/decorators/should-be-nested-validated.decorator';

export class ServerConfig {
  @Min(0)
  @Max(65535)
  @IsInt()
  port!: number;
}

export class HashConfig {
  @IsInt()
  memoryCost!: number;
  @IsInt()
  timeCost!: number;
  @IsInt()
  parallelism!: number;
}

export class DatabaseConfig {
  @IsUrl({
    require_tld: false,
    require_protocol: false,
    require_port: false,
    disallow_auth: true,
  })
  @IsString()
  host!: string;
  @Min(0)
  @Max(65535)
  @IsInt()
  port!: number;
  @IsString()
  dbName!: string;
  @IsString()
  username!: string;
  @IsString()
  password!: string;
}

export class TokenConfig {
  @IsString()
  secret!: string;
  @IsDuration()
  expirationDuration!: StringValue;
}

export class JwtConfig {
  @ShouldBeNestedValidated(() => TokenConfig)
  access!: TokenConfig;
  @ShouldBeNestedValidated(() => TokenConfig)
  refresh!: TokenConfig;
}

export class AuthConfig {
  @ShouldBeNestedValidated(() => JwtConfig)
  jwt!: JwtConfig;
}

export class RootConfig {
  @ShouldBeNestedValidated(() => ServerConfig)
  server!: ServerConfig;

  @ShouldBeNestedValidated(() => AuthConfig)
  auth!: AuthConfig;

  @ShouldBeNestedValidated(() => HashConfig)
  hash!: HashConfig;

  @ShouldBeNestedValidated(() => DatabaseConfig)
  database!: DatabaseConfig;
}

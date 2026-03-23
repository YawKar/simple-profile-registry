import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { RootConfig } from './root-config';
import { validateSync } from 'class-validator';
import { RootConfigService } from './root-config.service';
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';
import envsubst from '@tuplo/envsubst';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        (): RootConfig => {
          const configFilePath = process.env['CONFIG_FILE'];
          if (configFilePath === undefined) {
            throw new Error('CONFIG_FILE is not set!');
          }
          const yamlContent = readFileSync(configFilePath, 'utf8');
          const expandedYaml = envsubst(yamlContent);
          const configYaml = yaml.load(expandedYaml);

          const validatedConfig = plainToInstance(RootConfig, configYaml, {
            enableImplicitConversion: true,
          });

          const errors = validateSync(validatedConfig, {
            skipMissingProperties: false,
            forbidUnknownValues: true,
          });
          if (errors.length > 0) {
            throw new Error(errors.toString());
          }

          return validatedConfig;
        },
      ],
    }),
  ],
  providers: [RootConfigService],
  exports: [RootConfigService],
})
export class ConfigsModule {}

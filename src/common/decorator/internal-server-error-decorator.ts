import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { InternalServerErrorException, applyDecorators } from '@nestjs/common';
import { INTERNAL_SERVER_ERROR } from 'src/constants/messages/messagesConst';

export function ApiInternalServerError() {
  return applyDecorators(
    ApiException(() => InternalServerErrorException, {
      description: INTERNAL_SERVER_ERROR,
    }),
  );
}

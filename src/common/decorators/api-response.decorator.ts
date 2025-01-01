import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { BaseResponse } from '../interfaces/base-response.interface';

export const ApiResponseDecorator = <TModel extends Type<any>>(
  model: TModel,
  status = 200,
) => {
  return applyDecorators(
    ApiExtraModels(BaseResponse, model),
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponse) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};

import errorMessages from '../constants/errorMessages.json';

interface ErrorMessages {
  [code: string]: string;
}

interface ResponseObject {
  createSuccessResponse: (data: any, ...paginationParams: [number, number, number]) => Object;
  createErrorResponse: (code: string, error: string | null) => Object;
}

const typedErrorMessages: ErrorMessages = errorMessages;

const response: ResponseObject = {
  createSuccessResponse: (data, ...paginationParams) => {
    const [total_records, page, limit] = paginationParams;

    const total_pages = (limit === 0) ? 0 : Math.ceil(total_records / limit)
    const next_page =  (page + 1) <= total_pages ? page + 1 : null
    const prev_page =  page > 1 ? page - 1 : null

    const pagination = {
      total_records,
      current_page: page,
      per_page: limit,
      total_pages,
      next_page,
      prev_page
    }

    return {
      data,
      pagination
    }
  },
  createErrorResponse: (code, error = null) => ({
    error: {
      code,
      message: error ? `${error} ${typedErrorMessages[code]}` : typedErrorMessages[code]
    }
  })
}

export default response

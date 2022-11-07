type ResponseData = {
    id: string,
    token: string,
    error: string,
}

export default interface IError {
    //json: () => Promise<ResponseData>;
    statusCode: string;
    message: string;
}
export enum ModalType {
    CREATE = 'create',
    UPDATE = 'update'
}

export enum Method {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE'
}

export interface Endpoint {
    path: string;
    method: Method;
    headers: object;
    body: string;
    statusCode: number;
}

export interface EndpointModalConfig {
    type: ModalType;
    onClose: (isUpdated: boolean) => void;
    values: Endpoint;
}
class ApiError extends Error {
    constructor (
        statusCode,
        message="Something went Wrong",
        errors=[],
        stack=""
    ){
        super(message)
        this.stack=stack
        this.data=null
        this.message=message
        this.errors=errors

        if(stack) {
            this.stack=stack
        }
        else {
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}
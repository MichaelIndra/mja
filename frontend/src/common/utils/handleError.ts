export function handleError(err: any) {
    if (err.response) {
        if (err.response.message) {
            return err.response.message;
        } else if (err.response.data) {
            if (err.response.data.message) {
                return err.response.data.message;
            } else {
                return JSON.stringify(err.response.data);
            }
        } else {
            return JSON.stringify(err.response);
        }
    } else {
        return JSON.stringify(err);
    }
}

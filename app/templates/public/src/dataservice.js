const baseUri = window.service || '/';

function ajax(request, callback) {
    // If callback exists, use callback form:
    if (callback) return _ajax(request, callback);

    // Else, use promises:
    return new Promise((resolve, reject) => {
        _ajax(request, (error, data) => {
            if (error) return reject(error);
            return resolve(data);
        });
    });
}

// request can either be a string (url), or an object with request.url, and/or request.options
// request.options can specify the options.type (GET/POST/ect), and options.data to send in request.
function _ajax(request, callback) {
    // Extract options and url from request:
    let req = request || baseUri; // Default for request when falsy
    const isRequestString = (typeof req === 'string' || req instanceof String),
        url = (isRequestString ? req : req.url || '/') + (req.uri || ''),
        // use request.options if exists, otherwise use {}
        options = (!isRequestString && req.options) || {},
        type = (options.type || 'GET').toUpperCase(),
        data = req.data || req.data;

    // Create request:
    req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        // Check to make sure request is completed, otherwise ignore:
        if (this.readyState === XMLHttpRequest.DONE) {
            let response = this.response;
            if (this.status === 200) {
                // Request was successful, now parse:
                if (this.getResponseHeader('Content-Type').includes('application/json')) {
                    try {
                        response = JSON.parse(response);
                    } catch (error) {
                        // Failed to parse, error:
                        return callback({
                            error: error,
                            status: this.status,
                            message: response
                        });
                    }
                }

                callback(undefined, response);
            } else {
                // Request errored in some way, return error:
                callback({
                    error: this.statusText,
                    status: this.status,
                    message: response
                });
            }
        }
    };

    // Open and send request:
    req.open(type, url, true);

    // Set options:
    if (type !== 'GET') { req.setRequestHeader('Content-Type', 'application/json'); }

    req.send(type !== 'GET' && JSON.stringify(data));
}

export {
    ajax
};

export default {
    ajax
};
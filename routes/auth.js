module.exports = {
    'method': 'POST',
    'url': 'https://stage-api.travia.is/oauth/token',
    'headers': {
        'Authorization': 'Basic Z29kby1pczpnb2RvQXBwbGljYXRpb24=',
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
        'grant_type': 'password',
        'username': 'larus@islandsvefir.is',
        'password': 'TAbekind4441!'
    }
};

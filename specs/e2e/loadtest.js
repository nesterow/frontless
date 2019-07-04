
const loadtest = require('loadtest');
const app = require('index').default

let LAST_LATENCY;
function statusCallback(error, result, latency) {
    if (error) {
        return console.error(error)
    }
    LAST_LATENCY = latency
}
 
const baseOptions = {
    maxRequests: 100,
    requestsPerSecond: 10,
    statusCallback: statusCallback,
    timeout: 5000,
    concurrency: 12
};


describe("Test request performance", function() {
    this.timeout(10000000)
    before(async () => {
        return app
    })
    
    after(async () => {
        app.then(({server, mongo}) => {
            server.close()
            mongo.close()
        })
    })


    it('perform a load test on `/playground/routes`', async () => {
        return new Promise((resolve, reject) => {
            loadtest.loadTest({url: 'http://localhost:6767/playground/routes', ...baseOptions}, function(error) {
                if (error) {
                    reject(error)
                }
                console.log(`
                ------------------------------------
                Total requests: ${LAST_LATENCY.totalRequests}
                RPS: ${LAST_LATENCY.rps}
                ====================================
                Total errors: ${LAST_LATENCY.totalErrors}
                Mean Latency: ${LAST_LATENCY.meanLatencyMs}ms
                Max Latency: ${LAST_LATENCY.maxLatencyMs}ms
                Min Latency: ${LAST_LATENCY.minLatencyMs}ms
                ====================================
                `)
                resolve(true)
                setTimeout(()=>{
                    process.exit()
                },100)
            });
        })
    })

})
 

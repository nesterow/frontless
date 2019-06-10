
// Use CORS
// you can use dynamic resolution if allowed hosts are kept in some storage
const ALOWED_HOSTS = (process.env.ALOWED_HOSTS || '*').split(',')
const corsResolver = async (host, cb) => {
  if (ALOWED_HOSTS.includes('*') || ALOWED_HOSTS.includes(host))
    return cb(null, true);
  return cb('Host is not alowed', false)
}

module.exports.corsResolver = corsResolver
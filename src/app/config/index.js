let config = {
    PORT: process.env.PORT ? +process.env.PORT : 3000,
    DRONE_URL: process.env.DRONE_URL,
    DRONE_TOKEN: process.env.DRONE_TOKEN,
    morgan: {
        format: process.env.NODE_ENV === 'development' ? 'dev' : 'common'
    }
};

if (config.DRONE_URL === undefined) throw new Error("DRONE_URL environment variable must be set.");
if (config.DRONE_TOKEN === undefined) throw new Error("DRONE_TOKEN environment variable must be set.");

module.exports = config;
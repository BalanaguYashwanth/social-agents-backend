import ENV_CONFIG from "../config/env"

export const addAgent = async (agent: any) => {
    await fetch(ENV_CONFIG.NOSQL_API, {
        method: 'POST',
        body: JSON.stringify(agent)
    })
}

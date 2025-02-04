import ENV_CONFIG from "../config/env"

export const addAgent = async (agent: any) => {
    await fetch(ENV_CONFIG.NOSQL_API, {
        method: 'POST',
        body: JSON.stringify(agent)
    })
}

//token accounts
export const fetchSplTokens = async (ownerWalletAddress: string) => {
    const response = await fetch(`https://devnet.helius-rpc.com/?api-key=${ENV_CONFIG.HELIUS_API_KEY}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "id": "text",
          "method": "getTokenAccounts",
          "params": {
            "owner": ownerWalletAddress,
            "limit":100
          }
        }),
    });
    const data = await response.json();
    return data;
}
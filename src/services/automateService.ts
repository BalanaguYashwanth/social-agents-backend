import { GoogleGenerativeAI } from "@google/generative-ai";
import ENV_CONFIG from "../config/env";

let cursor = ''
export class AutomateService {
    private context = 'all'

    async geminiLLM(prompt: string){
        const genAI = new GoogleGenerativeAI(ENV_CONFIG.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        return result.response.text();
    }

    async handleComment({hash, commentText}) {
        try {
            const signerUuid = ENV_CONFIG.FARCASTER_NEYNAR_SIGNER_UUID;
            const body = {
                parent: hash,
                text: commentText,
                signer_uuid: signerUuid
            }

            await fetch(
                `${ENV_CONFIG.FARCASTER_HUB_URL}/cast`,
              {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-api-key': ENV_CONFIG.FARCASTER_NEYNAR_API_KEY || ''
                }
              }
            );
            console.log('Commented successfully', hash)
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    }

    async handleReaction({reactionType,hash, commentText}){
        const signerUuid = ENV_CONFIG.FARCASTER_NEYNAR_SIGNER_UUID;

        if(reactionType === 'comment'){
            return this.handleComment({hash, commentText})
        }

        const data = {
          reaction_type: reactionType,
          signer_uuid: signerUuid,
          target: hash,
        };
    
        const response = await fetch(`${ENV_CONFIG.FARCASTER_HUB_URL}/reaction`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-key': ENV_CONFIG.FARCASTER_NEYNAR_API_KEY || ''
          },
        });
        console.log('Liked successfully', hash)
        if (!response.ok) {
          throw new Error('Failed to post reaction');
        }
    }

    async decision(text, hash){
        const prompt = `
        Here is the user interest: ${this.context}, and here is the post: ${text}. 
        Based on the user interest, if post is matching then respond with ONLY the specified JSON format, or else respond with ONLY "false". Do not respond with any other text.
        If the post is matching, let me know if you want to like or comment.
        If you want to like, return ONLY this JSON format: {"reactionType":"like"}
        If you want to comment, return ONLY this JSON format: {"reactionType":"comment","commentText":"comment text"}

        Note: Follow this format very strictly. Do NOT include any markdown formatting around the JSON. The comment text should sound human, not robotic.
    `;
        const agentResponse = await this.geminiLLM(prompt);
        const parsedResponse = JSON.parse(agentResponse);
        if (parsedResponse) {
            await this.handleReaction({reactionType:parsedResponse?.reactionType, hash, commentText: parsedResponse?.commentText})
        }
    }

    async start(){
        const cursorParam = cursor ? `&cursor=${cursor}` : ''
        const fid = ENV_CONFIG.FARCASTER_FID
        const url = `${ENV_CONFIG.FARCASTER_HUB_URL}/feed/trending?limit=1${cursorParam}&time_window=24h&provider=neynar`
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'x-api-key': ENV_CONFIG.FARCASTER_NEYNAR_API_KEY || '' // Ensure this is the correct API key
            }
        });
        const responseBody = await response.json(); // Use text() first for debugging
        const casts = responseBody?.casts;
        cursor = responseBody?.next?.cursor
        console.log('Reading casts')
        if(casts[0]?.author?.fid){
            if(casts[0].author.fid != fid){
                for(let cast of casts){
                    this.decision(cast.text, cast.hash)
                }
            }
        }
    }


}

export default AutomateService

import { AireIdentity } from "./models/identity"

export const AireID = {
    getIdentity: getIdentity
}

let identity: AireIdentity | undefined = undefined;

function getIdentity() : AireIdentity | undefined
{
    // TODO
    console.warn("AIRe ID service not implemented - using placeholders")
    
    if(!identity)
    {
        identity = {
            id: self.crypto.randomUUID(),
            first_name: "Tero",
            last_name: "Testaaja"
        }
    }

    return identity;
}

export function whitelistedCandidates({candidates,whitelistedNames}){
    return candidates.filter(candidate=>whitelistedNames.includes(candidate.name))
}
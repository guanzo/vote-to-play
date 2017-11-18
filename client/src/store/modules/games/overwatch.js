
import heroes from '@/assets/json/overwatch_heroes'

var candidates = _(heroes).map(candidate=>{
    candidate.img = candidate.avatar
    candidate.imgSplash = cl.url("overwatch/splash/" + candidate.name.replace(/ /g,'') + `_splash.jpg`);
    return candidate
}).sortBy('name').value()

export const NAMESPACE = 'Overwatch'

const ow = {
    state: { 
        gameName: NAMESPACE,
        candidateNomenclature: 'hero',
        maxVoteResults: 3,
        candidates
    },
}

export default ow

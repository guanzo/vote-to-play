
import candidates from '@/assets/json/overwatch_heroes'

candidates.forEach(candidate=>{
    candidate.img = candidate.avatar
    candidate.imgSplash = cl.url("overwatch/splash/" + candidate.name.replace(/ /g,'') + `_splash.jpg`);
})

const ow = {
    state: { 
        gameName: 'Overwatch',
        candidateNomenclature: 'hero',
        maxResults: 3,
        candidates
    },
}

export default ow

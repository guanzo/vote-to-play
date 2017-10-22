
import heroes from '@/assets/json/overwatch_heroes'

heroes.forEach(hero=>{
    hero.img = hero.avatar
})

const ow = {
    state: { 
        gameName: 'Overwatch',
        characterNomenclature: 'hero',
        maxResults: 3,
        heroes
    },
}

export default ow

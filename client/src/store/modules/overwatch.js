
import heroes from '@/assets/json/overwatch_heroes'

heroes.forEach(hero=>{
    hero.img = hero.avatar
    hero.imgSplash = cl.url("overwatch/splash/" + hero.name.replace(/ /g,'') + `_splash.jpg`);
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

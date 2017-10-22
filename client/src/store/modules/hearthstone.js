
import util from '@/util'

const IMG_BASE_URL = 'https://us.battle.net/hearthstone/static/images/game-guide/heroes/artwork-'

export const NAMESPACE_HEARTHSTONE = 'hearthstone'

const hearthstone = {
    state: { 
        gameName: 'Hearthstone',
        characterNomenclature: 'class',
        maxResults: 3,
        heroes: [
             {
                name: "Druid",
                img: IMG_BASE_URL + 'malfurion.jpg',
                imgSplash: util.getImage('./hearthstone/splash/Druid_splash.jpg')
            },
            {
                name: "Hunter",
                img: IMG_BASE_URL + 'rexxar.jpg',
                imgSplash: util.getImage('./hearthstone/splash/Hunter_splash.jpg')
            },
            {
                name: "Mage",
                img: IMG_BASE_URL + 'jaina.jpg',
                imgSplash: util.getImage('./hearthstone/splash/Mage_splash.jpg')
            },
            {
                name: "Paladin",
                img: IMG_BASE_URL + 'uther.jpg',
                imgSplash: util.getImage('./hearthstone/splash/Paladin_splash.jpg')
            },
            {
                name: "Priest",
                img: IMG_BASE_URL + 'anduin.jpg',
                imgSplash: util.getImage('./hearthstone/splash/Priest_splash.jpg')
            },
            {
                name: "Rogue",
                img: IMG_BASE_URL + 'valeera.jpg',
                imgSplash: util.getImage('./hearthstone/splash/Rogue_splash.jpg')
            },
            {
                name: "Shaman",
                img: IMG_BASE_URL + 'thrall.jpg',
                imgSplash: util.getImage('./hearthstone/splash/Shaman_splash.jpg')
            },
            {
                name: "Warlock",
                img: IMG_BASE_URL + 'guldan.jpg',
                imgSplash: util.getImage('./hearthstone/splash/Warlock_splash.jpg')
            },
            {
                name: "Warrior",
                img: IMG_BASE_URL + 'garrosh.jpg',
                imgSplash: util.getImage('./hearthstone/splash/Warrior_splash.jpg')
            }
        ]
    },
}

export default hearthstone

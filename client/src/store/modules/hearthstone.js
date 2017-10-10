const IMG_BASE_URL = 'https://us.battle.net/hearthstone/static/images/game-guide/heroes/artwork-'

export const NAMESPACE_HEARTHSTONE = 'hearthstone'

const hearthstone = {
    state: { 
        gameName: 'Hearthstone',
        nomenclature: 'class',
        maxResults: 3,
        heroes: [
            { name: "Druid",   img: IMG_BASE_URL + 'malfurion.jpg'},
            { name: "Hunter",  img: IMG_BASE_URL + 'rexxar.jpg'},
            { name: "Mage",    img: IMG_BASE_URL + 'jaina.jpg'},
            { name: "Paladin", img: IMG_BASE_URL + 'uther.jpg'},
            { name: "Priest",  img: IMG_BASE_URL + 'anduin.jpg'},
            { name: "Rogue",   img: IMG_BASE_URL + 'valeera.jpg'},
            { name: "Shaman",  img: IMG_BASE_URL + 'thrall.jpg'},
            { name: "Warlock", img: IMG_BASE_URL + 'guldan.jpg'},
            { name: "Warrior", img: IMG_BASE_URL + 'garrosh.jpg'}
        ]
    },
}

export default hearthstone

const IMG_BASE_URL = 'https://us.battle.net/hearthstone/static/images/game-guide/heroes/artwork-'

export const NS_HEARTHSTONE = 'hearthstone'

const hearthstone = {
    state: { 
        heroes: [
            { class: "Druid",   img: IMG_BASE_URL + 'malfurion.jpg'},
            { class: "Hunter",  img: IMG_BASE_URL + 'rexxar.jpg'},
            { class: "Mage",    img: IMG_BASE_URL + 'jaina.jpg'},
            { class: "Paladin", img: IMG_BASE_URL + 'uther.jpg'},
            { class: "Priest",  img: IMG_BASE_URL + 'anduin.jpg'},
            { class: "Rogue",   img: IMG_BASE_URL + 'valeera.jpg'},
            { class: "Shaman",  img: IMG_BASE_URL + 'thrall.jpg'},
            { class: "Warlock", img: IMG_BASE_URL + 'guldan.jpg'},
            { class: "Warrior", img: IMG_BASE_URL + 'garrosh.jpg'}
        ]
    },
}

export default hearthstone

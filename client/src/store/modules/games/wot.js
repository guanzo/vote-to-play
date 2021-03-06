import gameApi from '@/api/game-api'
import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import whitelistMixin from './util/whitelistMixin'
import { gameOptions, gameMixin, FILTER_MODE_REMOVE } from './util/gameMixin'

export const NAMESPACE = 'World of Tanks'

const worldoftanks = _.merge({}, gameMixin, whitelistMixin, {
    namespaced: true,
    state: {
        gameName: NAMESPACE,
        candidateNomenclature: 'tank',
        className: 'world-of-tanks',
        gameOptions: gameOptions({
            showNameInGrid: true,
            filterMode: FILTER_MODE_REMOVE,
            hasPaginatedGrid: true,
            sortBy: 'tier',
            sortOrder: 'desc',
            id: 'id'
        }),
        candidates: [],
        filters: [
            {
                id: 'name',
                type: 'text',
                vmodel: '',
                placeholder: 'Search tanks'
            },
            {
                id: 'tier',
                type: 'select',
                vmodel: 'Tier',
                options: ['Tier']
            },
            {
                id: 'nation',
                type: 'select',
                vmodel: 'Nation',
                options: ['Nation']
            },
            {
                id: 'type',
                type: 'select',
                vmodel: 'Type',
                options: ['Type']
            }
        ],
        vehicleNations: {
            italy: 'Italy',
            usa: 'U.S.A.',
            czech: 'Czechoslovakia',
            poland: 'Poland',
            france: 'France',
            sweden: 'Sweden',
            ussr: 'U.S.S.R.',
            china: 'China',
            uk: 'U.K.',
            japan: 'Japan',
            germany: 'Germany'
        }
    },
    mutations: {
        [MUTATIONS.SET_CANDIDATES] (state, { candidates }) {
            state.candidates = candidates
        },
        [MUTATIONS.SET_FILTERS] (state, { candidates }) {
            const tiers = _(candidates).map(d => d.tier).uniq().sort((a, b) => a - b).value()
            state.filters[1].options.push(...tiers)

            const nations = Object.values(state.vehicleNations).sort()
            state.filters[2].options.push(...nations)

            const types = _(candidates).map(d => d.type).uniq().sort().value()
            state.filters[3].options.push(...types)
        }

    },
    actions: {
        [ACTIONS.GET_CANDIDATES] ({ commit }) {
            return gameApi.fetch('worldoftanks')
                .then((response) => {
                    const candidates = response.data
                    commit(MUTATIONS.SET_CANDIDATES, { candidates })
                    commit(MUTATIONS.SET_FILTERS, { candidates })
                })
        }
    },
    getters: {
        candidates (state) {
            return state.candidates
        },
        filteredCandidates ({ candidates, vehicleNations }, { activeFilters }) {
            const nationsInverted = _.invert(vehicleNations)
            return candidates.filter(candidate => {
                return activeFilters.every(({ id, vmodel, options }) => {
                    if (id === 'name') { return candidate.name.toLowerCase().includes(vmodel.toLowerCase()) } else if (id === 'tier' && vmodel !== options[0]) { return candidate.tier === parseInt(vmodel) } else if (id === 'nation' && vmodel !== options[0]) { return candidate.nation === nationsInverted[vmodel] } else if (id === 'type' && vmodel !== options[0]) { return candidate.type === vmodel }
                })
            })
        }
    }
})

export default worldoftanks

import CandidateGrid from '@/components/grid/CandidateGrid'
import gameOptions, { 
	FILTER_MODE_HIGHLIGHT, FILTER_MODE_REMOVE, FILTER_MODE_NONE 
} from '@/store/modules/games/util/gameOptions'

let candidates = [{ name: 'yo' },{ name: 'hi'}];
let filteredCandidates = [candidates[0]]

function mockComponent(gameOptions){
	const Constructor = Vue.extend(CandidateGrid)
	const vm = new Constructor({
		store: new Vuex.Store({}),
		propsData: {
			candidates,
			filteredCandidates,
			gameOptions
		}
	}).$mount()
	return vm
}

describe('CandidateGrid.vue', () => {
	
    it(`filtermode: ${FILTER_MODE_HIGHLIGHT}, filtered grid should have correct class names`,()=>{
        let gameOptions = {
			filterMode: FILTER_MODE_HIGHLIGHT
		}
        const vm = mockComponent(gameOptions)
		let children = vm.$el.children
		expect(children.length).to.equal(candidates.length)
        expect(children[0].className).to.include('filtered-in')
        expect(children[1].className).to.include('filtered-out')
	})
	
    it(`filtermode: ${FILTER_MODE_REMOVE}, filtered grid should only contain matched candidates`,()=>{
        let gameOptions = {
			filterMode: FILTER_MODE_REMOVE
		}
        const vm = mockComponent(gameOptions)
        let children = vm.$el.children
		expect(children.length).to.equal(filteredCandidates.length)
	})

})

